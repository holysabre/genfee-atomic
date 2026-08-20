import { common } from '@kit.AbilityKit';
import { router } from '@kit.ArkUI';
import { hilog } from '@kit.PerformanceAnalysisKit';
import { Topic, TopicApi } from '../services/TopicApi';
import { AdService } from '../services/AdService';
import { AdIds } from '../constants/AdIds';
import { Store } from '../utils/Store';
import { Dialer } from '../utils/Dialer';
import { ListRow, TopicDataSource } from '../utils/TopicDataSource';
import { TopicCard } from '../components/TopicCard';
import { NativeAdCard } from '../components/NativeAdCard';

const PAGE_SIZE: number = 10;
const AD_INSERT_POS: number = 8; // 每批帖子第 8 条后插入 1 条原生广告
const CAPSULE_MARGIN_RIGHT: number = 96; // 元服务胶囊占位宽度（避免内容/标题与胶囊重叠）

@Entry
@Component
struct TopicListPage {
  @State private dataSource: TopicDataSource = new TopicDataSource();
  @State private refreshing: boolean = false;
  @State private address: string = '全国'; // 简化版固定全国（无地区选择页）
  @State private statusBarHeight: number = 0;
  @State private navBarHeight: number = 0; // 底部导航条避让高度（审核整改）

  private page: number = 1;
  private pageTotal: number = -1;
  private loading: boolean = false;

  aboutToAppear(): void {
    this.statusBarHeight = (AppStorage.get<number>('statusBarHeight') ?? 0);
    this.navBarHeight = (AppStorage.get<number>('navBarHeight') ?? 0);
    // 合规：首次启动必须先获得隐私协议同意，同意后才请求数据与广告
    if (Store.getBool('privacy_agreed', false)) {
      this.loadList(true, true);
    } else {
      this.showPrivacyDialog();
    }
  }

  /** 首启隐私协议弹窗（广告合规硬性要求：同意前不得请求广告） */
  private showPrivacyDialog(): void {
    this.getUIContext().getPromptAction().showDialog({
      title: '用户协议与隐私政策',
      message: '感谢您使用工蜂招工找活平台。我们将严格遵守法律法规，保护您的个人信息安全。' +
        '我们会基于网络状态加载招聘信息，并在您同意后展示广告内容。请您仔细阅读并同意《用户协议》和《隐私政策》后继续使用。',
      buttons: [
        { text: '同意', color: '#A67C00' },
        { text: '不同意', color: '#595959' }
      ]
    }).then((result) => {
      if (result.index === 0) {
        Store.putBool('privacy_agreed', true);
        this.initAfterConsent();
      } else {
        // 不同意则退出（行业通行合规做法）
        (getContext(this) as common.UIAbilityContext).terminateSelf();
      }
    });
  }

  private async initAfterConsent(): Promise<void> {
    // 注：元服务不支持 OAID（identifier 被禁用），无需广告权限初始化，仅非个性化广告
    this.loadList(true, true);
  }

  private async loadList(refresh: boolean, replace: boolean): Promise<void> {
    if (this.loading) {
      return;
    }
    this.loading = true;
    try {
      const res = await TopicApi.list(this.page, 1, 0);
      if (res.code === 200 && res.data) {
        const topics: Topic[] = res.data.data ?? [];
        this.pageTotal = res.data.last_page ?? -1;

        const rows: ListRow[] = topics.map((t: Topic) => {
          const r = new ListRow();
          r.kind = 0;
          r.topic = t;
          return r;
        });

        // 信息流广告：每批请求 1 条新广告插入（合规：不重复展示同一广告）
        if (AdIds.AD_ENABLED && rows.length > 0) {
          const ads = await AdService.loadNativeAds(getContext(this), AdIds.nativeAdId(), 1);
          if (ads.length > 0) {
            const adRow = new ListRow();
            adRow.kind = 1;
            adRow.ad = ads[0];
            rows.splice(Math.min(AD_INSERT_POS, rows.length), 0, adRow);
          }
        }

        if (replace) {
          this.dataSource.replaceAll(rows);
        } else {
          this.dataSource.append(rows);
        }
      } else {
        this.getUIContext().getPromptAction().showToast({ message: res.msg ?? '加载失败' });
      }
    } finally {
      this.loading = false;
      if (refresh) {
        this.refreshing = false;
      }
    }
  }

  private onRefresh(): void {
    this.page = 1;
    this.loadList(true, true);
  }

  private onReachEnd(): void {
    if (!this.loading && this.pageTotal > 0 && this.page < this.pageTotal) {
      this.page += 1;
      this.loadList(false, false);
    }
  }

  /** 一级标题栏：仅 1 个文字元素，高度 ≥44vp，字号 ≥20fp 加粗，右侧留出胶囊占位 */
  @Builder
  titleBar() {
    Row() {
      // 左侧与右侧占位等宽，使标题在视觉中心与胶囊水平中心对齐
      Blank()
        .width(CAPSULE_MARGIN_RIGHT)
      Text('工蜂招工找活平台')
        .fontSize(20)
        .fontWeight(FontWeight.Bold)
        .fontColor('#222222')
        .textAlign(TextAlign.Center)
        .layoutWeight(1)
      Blank()
        .width(CAPSULE_MARGIN_RIGHT)
    }
    .width('100%')
    .height(this.statusBarHeight + 44)
    .padding({ top: this.statusBarHeight })
    .backgroundColor('#B0CBEB')
  }

  @Builder
  filterBar() {
    // 原标题栏中的"全国"+tabs 图下移到内容区，避免占用胶囊区域
    Stack() {
      Row() {
        Text(this.address)
          .fontSize(12)
          .fontColor('#222222')
          .margin({ left: 10 })
      }
      .width('100%')

      Row() {
        Image($r('app.media.zzrz'))
          .width('100%')
          .height('100%')
      }
      .width(177)
      .height(24)
      .backgroundColor(Color.White)
      .borderRadius(12)
    }
    .alignContent(Alignment.Center)
    .width('100%')
    .height(36)
    .padding({ left: 20, right: 20 })
    .backgroundColor('#B0CBEB')
  }

  @Builder
  emptyView() {
    Column() {
      Image($r('app.media.empty'))
        .width(130)
        .height(130)
        .margin({ bottom: 10 })
      Text('暂无数据')
        .fontSize(14)
        .fontColor('#333333')
    }
    .width('100%')
    .height(400)
    .justifyContent(FlexAlign.Center)
  }

  build() {
    Column() {
      this.titleBar()
      this.filterBar()

      if (this.dataSource.isEmpty() && !this.loading) {
        this.emptyView()
      } else {
        Refresh({ refreshing: $$this.refreshing }) {
          List() {
            LazyForEach(this.dataSource, (item: ListRow, index: number) => {
              ListItem() {
                if (item.kind === 0) {
                  TopicCard({
                    topic: item.topic,
                    onContact: (mobile: string) => {
                      Dialer.dial(this.getUIContext(), mobile);
                    }
                  })
                    .onClick(() => {
                      const id = item.topic?.id;
                      if (id) {
                        router.pushUrl({ url: 'pages/TopicDetailPage', params: { id: id } });
                      }
                    })
                } else {
                  NativeAdCard({ ad: item.ad })
                }
              }
            }, (item: ListRow, index: number) => `${item.kind}_${index}_${item.topic?.id ?? 'ad'}`)
          }
          .width('100%')
          // 审核整改：底部 padding 避让导航条，滚动到底部时最后一条卡片不被遮挡
          .padding({ left: 20, right: 20, bottom: this.navBarHeight })
          .onReachEnd(() => this.onReachEnd())
        }
        .onRefreshing(() => this.onRefresh())
        .layoutWeight(1)
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#B0CBEB')
  }
}
