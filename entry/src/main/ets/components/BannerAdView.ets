import { advertising, AutoAdComponent } from '@kit.AdsKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
import { AdIds } from '../constants/AdIds';

/**
 * Banner 广告（详情页底部）：
 * 使用 AutoAdComponent —— 自动请求/轮播/上报，最省事。
 */
@Component
export struct BannerAdView {
  @State private visibilityState: Visibility = Visibility.None;

  private adParam: advertising.AdRequestParams = {
    adType: 8, // 横幅
    adId: AdIds.bannerAdId(),
    adWidth: 360,
    adHeight: 57
  };
  private adOptions: advertising.AdOptions = {
    allowMobileTraffic: 0,
    tagForChildProtection: -1,
    tagForUnderAgeOfPromise: -1,
    adContentClassification: 'A'
  };
  private displayOptions: advertising.AdDisplayOptions = {
    refreshTime: 30000 // 轮播间隔 30s（允许范围 30000~120000）
  };

  aboutToAppear(): void {
    if (AdIds.AD_ENABLED) {
      this.visibilityState = Visibility.Visible;
    }
  }

  build() {
    if (AdIds.AD_ENABLED) {
      Row() {
        AutoAdComponent({
          adParam: this.adParam,
          adOptions: this.adOptions,
          displayOptions: this.displayOptions,
          interactionListener: {
            onStatusChanged: (status: string) => {
              hilog.info(0x0000, 'WorkerBeeAd', 'banner status %{public}s', status);
              // 用户关闭或加载失败时隐藏占位，避免留下空白区域
              if (status === 'onAdClose' || status === 'onAdFail') {
                this.visibilityState = Visibility.None;
              }
            }
          }
        })
      }
      .width('100%')
      .aspectRatio(360 / 57)
      .visibility(this.visibilityState)
    }
  }
}
