import router from '@ohos.router';
import common from '@ohos.app.ability.common';
import { Topic, TopicApi } from '../services/TopicApi';
import { Dialer } from '../utils/Dialer';
import { BannerAdView } from '../components/BannerAdView';
import { AdIds } from '../constants/AdIds';
import { AdService } from '../services/AdService';
import hilog from '@ohos.hilog';
import advertising from '@ohos.advertising';
import { Colors } from '../constants/Colors';

const CAPSULE_MARGIN_RIGHT: number = 96; // 元服务胶囊占位宽度
const INTERSTITIAL_SHOWN_KEY: string = 'interstitial_shown_in_session';

/** 详情页（自绘标题栏带返回图片，满足胶囊规范） */
@Entry
@Component
struct TopicDetailPage {
  @State private info: Topic | null = null;
  @State private tags: string[] = [];
  @State private statusBarHeight: number = 0;
  @State private navBarHeight: number = 0; // 底部导航条避让高度（审核整改）
  @State private rewardGranted: boolean = false; // 激励视频是否已看完
  @State private adLoading: boolean = false; // 广告加载中状态
  @State private rewardCountdown: number = 0; // 激励视频倒计时（秒）

  private rewardAd: advertising.Advertisement | null = null;
  private countdownTimer: number = -1;

  aboutToAppear(): void {
    this.statusBarHeight = (AppStorage.get('statusBarHeight') as number) ?? 0;
    this.navBarHeight = (AppStorage.get('navBarHeight') as number) ?? 0;
    const params = router.getParams() as Record<string, number> | undefined;
    const id = params?.id ?? 0;
    if (id > 0) {
      this.loadDetail(id);
    }
    // 隐私声明已由平台托管（AGC 标准化隐私声明托管服务），页面无需自建同意弹窗，可直接展示广告
    this.tryShowInterstitial();
  }

  private async loadDetail(id: number): Promise<void> {
    const res = await TopicApi.detail(id);
    if (res.code === 200 && res.data?.data) {
      this.info = res.data.data;
      this.tags = (this.info.category_name ?? '').split('、').filter((s: string) => s.length > 0);
    } else {
      this.getUIContext().getPromptAction().showToast({ message: res.msg ?? '加载失败' });
    }
  }

  /** 应用生命周期内最多展示 1 次插屏广告 */
  private async tryShowInterstitial(): Promise<void> {
    if (!AdIds.AD_ENABLED) {
      return;
    }
    const alreadyShown = AppStorage.get(INTERSTITIAL_SHOWN_KEY) as boolean ?? false;
    if (alreadyShown) {
      return;
    }
    const ad = await AdService.loadInterstitialAd(
      getContext(this),
      AdIds.interstitialVideoAdId(),
      AdIds.interstitialImageAdId()
    );
    if (ad !== null) {
      AppStorage.setOrCreate(INTERSTITIAL_SHOWN_KEY, true);
      AdService.showInterstitialAd(getContext(this) as common.UIAbilityContext, ad);
    }
  }

  /** 点击免费联系：未看激励视频则先加载并播放，看完才能拨号 */
  private async onContactClick(): Promise<void> {
    if (this.rewardGranted) {
      this.doDial();
      return;
    }
    if (this.adLoading) {
      return;
    }
    if (!AdIds.AD_ENABLED) {
      // 广告总开关关闭时直接允许联系
      this.doDial();
      return;
    }

    this.adLoading = true;
    try {
      const ad = await AdService.loadRewardAd(getContext(this), AdIds.rewardAdId());
      if (ad === null) {
        this.getUIContext().getPromptAction().showToast({ message: '广告加载失败，请稍后重试' });
        return;
      }
      this.rewardAd = ad;
      AdService.showRewardAd(getContext(this) as common.UIAbilityContext, ad, {
        onReward: () => {
          hilog.info(0x0000, 'WorkerBeeAd', 'reward granted callback');
        },
        onClose: () => {
          // SDK 未暴露广告关闭回调，倒计时已在 showAd 调用时启动。
          hilog.info(0x0000, 'WorkerBeeAd', 'reward ad closed, countdown=%{public}d', this.rewardCountdown);
        },
        onError: (code: number, msg: string) => {
          hilog.error(0x0000, 'WorkerBeeAd', 'reward show error code=%{public}d msg=%{public}s', code, msg);
          this.stopCountdown();
          this.getUIContext().getPromptAction().showToast({ message: '广告播放失败，请稍后重试' });
        }
      });
      // 激励视频播放后启动倒计时，防止用户直接关闭广告就跳过观看
      this.startCountdown(10);
    } finally {
      this.adLoading = false;
    }
  }

  private doDial(): void {
    const mobile = this.info?.mobile;
    if (mobile !== undefined && mobile !== null) {
      Dialer.dial(this.getUIContext(), String(mobile));
    }
  }

  private startCountdown(seconds: number): void {
    this.stopCountdown();
    this.rewardCountdown = seconds;
    this.countdownTimer = setInterval(() => {
      if (this.rewardCountdown > 0) {
        this.rewardCountdown -= 1;
      }
      if (this.rewardCountdown <= 0) {
        this.rewardGranted = true;
        this.stopCountdown();
        this.getUIContext().getPromptAction().showToast({ message: '已获得免费联系权限' });
      }
    }, 1000);
  }

  private stopCountdown(): void {
    if (this.countdownTimer !== -1) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = -1;
    }
    if (!this.rewardGranted) {
      this.rewardCountdown = 0;
    }
  }

  private getContactButtonText(): string {
    if (this.rewardGranted) {
      return '免费联系';
    }
    if (this.rewardCountdown > 0) {
      return `观看中 (${this.rewardCountdown}s)`;
    }
    if (this.adLoading) {
      return '广告加载中...';
    }
    return '观看视频后免费联系';
  }

  /** 二级标题栏：返回图片 + 标题，共 2 个元素；右侧留出胶囊占位 */
  @Builder
  titleBar() {
    Row() {
      Row() {
        Image($r('app.media.back'))
          .width(24)
          .height(24)
          .onClick(() => {
            router.back();
          })
      }
      .width(CAPSULE_MARGIN_RIGHT)
      .justifyContent(FlexAlign.Start)

      Text('内容详情')
        .fontSize(20)
        .fontWeight(FontWeight.Bold)
        .fontColor(Colors.BODY_TEXT)
        .textAlign(TextAlign.Center)
        .layoutWeight(1)

      Blank()
        .width(CAPSULE_MARGIN_RIGHT)
    }
    .width('100%')
    .height(this.statusBarHeight + 44)
    .padding({ top: this.statusBarHeight })
    .backgroundColor(Color.White)
  }

  @Builder
  labelRow(label: string, value: string, valueColor: string, bold: boolean) {
    Row() {
      Text(label)
        .fontSize(14)
        .fontColor(Colors.SECONDARY_TEXT)
      Text(value)
        .fontSize(14)
        .fontColor(valueColor)
        .fontWeight(bold ? FontWeight.Bold : FontWeight.Regular)
    }
    .width('100%')
    .justifyContent(FlexAlign.SpaceBetween)
    .margin({ bottom: 10 })
  }

  build() {
    Column() {
      this.titleBar()

      Stack({ alignContent: Alignment.Bottom }) {
        // 内容区
        Scroll() {
          Column() {
            // 需求职业标签
            Row() {
              Text('需求职业：')
                .fontSize(14)
                .fontColor(Colors.SECONDARY_TEXT)
              Flex({ wrap: FlexWrap.Wrap }) {
                ForEach(this.tags, (tag: string) => {
                  Text(tag)
                    .fontSize(13)
                    .fontColor(Colors.PRIMARY_TEXT)
                    .height(20)
                    .padding({ left: 12, right: 12 })
                    .borderRadius(13)
                    .border({ width: 1, color: Colors.PRIMARY_TEXT })
                    .margin({ right: 10, bottom: 10 })
                })
              }
              .layoutWeight(1)
            }
            .width('100%')
            .alignItems(VerticalAlign.Top)
            .margin({ bottom: 10 })

            // 要求 + 发布时间 + 内容 + 地址
            Column() {
              Row() {
                Text('要求：')
                  .fontSize(14)
                  .fontColor(Colors.SECONDARY_TEXT)
                Text(`发布时间：${this.info?.created_at ?? '暂无'}`)
                  .fontSize(12)
                  .fontColor(Colors.SECONDARY_TEXT)
              }
              .width('100%')
              .justifyContent(FlexAlign.SpaceBetween)

              Text(this.info?.content ?? '')
                .fontSize(14)
                .fontColor(Colors.BODY_TEXT)
                .lineHeight(24)
                .width('100%')
                .margin({ top: 8, bottom: 10 })

              Row() {
                Image($r('app.media.address2'))
                  .width(12)
                  .height(12)
                  .margin({ right: 4 })
                Text(this.info?.address ?? '')
                  .fontSize(14)
                  .fontColor(Colors.SECONDARY_TEXT)
              }
              .width('100%')
            }
            .width('100%')
            .margin({ bottom: 10 })

            // party != 2（招工）才展示薪酬/企业/收费说明
            if ((this.info?.party ?? 1) !== 2) {
              this.labelRow('薪酬范围：', this.info?.salary ?? '暂无', Colors.SALARY_TEXT, true)
              this.labelRow('企业单位：', this.info?.company_name ?? '暂无', Colors.BODY_TEXT, false)
              this.labelRow('岗位收费要求：', '该岗位招聘不涉及收费', Colors.BODY_TEXT, false)
            }
          }
          .width('100%')
          // 审核整改：内容区底部留白 = 固定操作区高度 + 导航条高度，滚到底不被遮挡
          .padding({ left: 16, right: 16, top: 14, bottom: 150 + this.navBarHeight })
        }
        .width('100%')
        .height('100%')

        // 底部固定操作区（温馨提示 + Banner 广告 + 免费联系）
        Column() {
          Row() {
            Image($r('app.media.warn'))
              .width(24)
              .height(24)
            Text('温馨提示')
              .fontSize(12)
              .fontColor(Colors.PRIMARY_TEXT)
          }
          .margin({ bottom: 3 })

          Text('联系之前请您注意辨别信息真伪，核实岗位实情及实际情况，谨防上当受骗。平台不参与招聘事宜，相关招聘及履约问题由招聘双方确认并担责。')
            .fontSize(10)
            .fontColor(Colors.CAPTION_TEXT)
            .width('100%')
            .margin({ bottom: 10 })

          if (AdIds.AD_ENABLED) {
            BannerAdView()
              .margin({ bottom: 8 })
          }

          Text(this.getContactButtonText())
            .fontSize(15)
            .fontColor(Colors.BODY_TEXT)
            .textAlign(TextAlign.Center)
            .width('100%')
            .height(44)
            .backgroundColor(Colors.PRIMARY_BUTTON_BG)
            .borderRadius(8)
            .onClick(() => this.onContactClick())
        }
        .width('100%')
        // 审核整改：底部固定区整体抬高避让导航条，白色背景延伸进导航条区域形成沉浸融合
        .padding({ left: 17, right: 17, top: 10, bottom: 15 + this.navBarHeight })
        .backgroundColor(Color.White)
      }
      .width('100%')
      .layoutWeight(1)
      .backgroundColor(Color.White)
    }
    .width('100%')
    .height('100%')
    .backgroundColor(Color.White)
  }
}
