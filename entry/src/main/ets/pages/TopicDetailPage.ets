import { router } from '@kit.ArkUI';
import { Topic, TopicApi } from '../services/TopicApi';
import { Dialer } from '../utils/Dialer';
import { BannerAdView } from '../components/BannerAdView';
import { AdIds } from '../constants/AdIds';

/** 详情页（1:1 还原小程序版：白底、标签、底部固定操作区 + Banner 广告） */
@Entry
@Component
struct TopicDetailPage {
  @State private info: Topic | null = null;
  @State private tags: string[] = [];
  @State private statusBarHeight: number = 0;

  aboutToAppear(): void {
    this.statusBarHeight = (AppStorage.get<number>('statusBarHeight') ?? 0);
    const params = router.getParams() as Record<string, number> | undefined;
    const id = params?.id ?? 0;
    if (id > 0) {
      this.loadDetail(id);
    }
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

  @Builder
  labelRow(label: string, value: string, valueColor: string, bold: boolean) {
    Row() {
      Text(label)
        .fontSize(14)
        .fontColor('#80222222')
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
    Stack({ alignContent: Alignment.Bottom }) {
      // 内容区
      Scroll() {
        Column() {
          // 需求职业标签
          Row() {
            Text('需求职业：')
              .fontSize(14)
              .fontColor('#80222222')
            Flex({ wrap: FlexWrap.Wrap }) {
              ForEach(this.tags, (tag: string) => {
                Text(tag)
                  .fontSize(13)
                  .fontColor('#FAC23C')
                  .height(20)
                  .padding({ left: 12, right: 12 })
                  .borderRadius(13)
                  .border({ width: 1, color: '#FAC23C' })
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
                .fontColor('#80222222')
              Text(`发布时间：${this.info?.created_at ?? '暂无'}`)
                .fontSize(12)
                .fontColor('#80222222')
            }
            .width('100%')
            .justifyContent(FlexAlign.SpaceBetween)

            Text(this.info?.content ?? '')
              .fontSize(14)
              .fontColor('#222222')
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
                .fontColor('#80222222')
            }
            .width('100%')
          }
          .width('100%')
          .margin({ bottom: 10 })

          // party != 2（招工）才展示薪酬/企业/收费说明
          if ((this.info?.party ?? 1) !== 2) {
            this.labelRow('薪酬范围：', this.info?.salary ?? '暂无', '#FFC900', true)
            this.labelRow('企业单位：', this.info?.company_name ?? '暂无', '#222222', false)
            this.labelRow('岗位收费要求：', '该岗位招聘不涉及收费', '#222222', false)
          }
        }
        .width('100%')
        .padding({ left: 16, right: 16, top: 14, bottom: 150 })
      }
      .width('100%')
      .height('100%')
      .padding({ top: this.statusBarHeight })

      // 底部固定操作区（温馨提示 + Banner 广告 + 免费联系）
      Column() {
        Row() {
          Image($r('app.media.warn'))
            .width(24)
            .height(24)
          Text('温馨提示')
            .fontSize(12)
            .fontColor('#FDD000')
        }
        .margin({ bottom: 3 })

        Text('联系之前请您注意辨别信息真伪，核实岗位实情及实际情况，谨防上当受骗。平台不参与招聘事宜，相关招聘及履约问题由招聘双方确认并担责。')
          .fontSize(10)
          .fontColor('#666666')
          .width('100%')
          .margin({ bottom: 10 })

        if (AdIds.AD_ENABLED) {
          BannerAdView()
            .margin({ bottom: 8 })
        }

        Text('免费联系')
          .fontSize(15)
          .fontColor('#000000')
          .textAlign(TextAlign.Center)
          .width('100%')
          .height(44)
          .backgroundColor('#FDD000')
          .borderRadius(8)
          .onClick(() => {
            const mobile = this.info?.mobile;
            if (mobile !== undefined && mobile !== null) {
              Dialer.dial(this.getUIContext(), String(mobile));
            }
          })
      }
      .width('100%')
      .padding({ left: 17, right: 17, top: 10, bottom: 15 })
      .backgroundColor(Color.White)
    }
    .width('100%')
    .height('100%')
    .backgroundColor(Color.White)
  }
}
