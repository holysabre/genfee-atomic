import advertising from '@ohos.advertising';
import hilog from '@ohos.hilog';
import common from '@ohos.app.ability.common';
import { Colors } from '../constants/Colors';
import { AdIds } from '../constants/AdIds';

const TAG: string = 'WorkerBeeAd';

/**
 * Banner 广告（API 11 自渲染实现）。
 * API 11 没有 AutoAdComponent 模板组件，需自行加载并渲染广告素材。
 * 组件初始化时拉取 1 条 Banner 类型广告，成功则渲染；失败则占位高度为 0。
 */
@Component
export struct BannerAdView {
  @State private ad: advertising.Advertisement | null = null;
  @State private loaded: boolean = false;

  aboutToAppear(): void {
    this.loadBannerAd();
  }

  private async loadBannerAd(): Promise<void> {
    if (!AdIds.AD_ENABLED) {
      return;
    }
    try {
      const params: advertising.AdRequestParams = {
        adId: AdIds.bannerAdId(),
        adType: 8, // BANNER
        adCount: 1
      };
      const options: advertising.AdOptions = {
        allowMobileTraffic: 0,
        tagForChildProtection: -1,
        tagForUnderAgeOfPromise: -1,
        adContentClassification: 'A'
      };
      const loader = new advertising.AdLoader(getContext(this));
      const listener: advertising.AdLoadListener = {
        onAdLoadSuccess: (ads: advertising.Advertisement[]) => {
          const banner = ads?.[0] ?? null;
          hilog.info(0x0000, TAG, 'banner ad loaded ok=%{public}s', banner !== null);
          this.ad = banner;
          this.loaded = true;
        },
        onAdLoadFailure: (errorCode: number, errorMsg: string) => {
          hilog.error(0x0000, TAG, 'banner ad failed code=%{public}d msg=%{public}s', errorCode, errorMsg);
          this.loaded = true;
        }
      };
      loader.loadAd(params, options, listener);
    } catch (e) {
      hilog.error(0x0000, TAG, 'loadBannerAd exception %{public}s', JSON.stringify(e));
      this.loaded = true;
    }
  }

  private showAd(): void {
    if (this.ad === null) {
      return;
    }
    try {
      const ctx: common.UIAbilityContext = getContext(this) as common.UIAbilityContext;
      const displayOptions: advertising.AdDisplayOptions = {
        useMobileDataReminder: true
      };
      advertising.showAd(this.ad, displayOptions, ctx);
    } catch (e) {
      hilog.error(0x0000, TAG, 'banner ad click showAd exception %{public}s', JSON.stringify(e));
    }
  }

  build() {
    if (this.ad === null) {
      // 无填充或加载失败时不占用空间
      Column()
        .width('100%')
        .height(0)
    } else {
      Row() {
        Image(this.ad.iconUrl ?? '')
          .width(32)
          .height(32)
          .borderRadius(4)
          .objectFit(ImageFit.Cover)
          .margin({ right: 8 })

        Column() {
          Text(this.ad.title ?? '')
            .fontSize(13)
            .fontColor(Colors.BODY_TEXT)
            .fontWeight(FontWeight.Medium)
            .maxLines(1)
            .textOverflow({ overflow: TextOverflow.Ellipsis })
            .width('100%')

          Text(this.ad.description ?? '')
            .fontSize(11)
            .fontColor(Colors.SECONDARY_TEXT)
            .maxLines(1)
            .textOverflow({ overflow: TextOverflow.Ellipsis })
            .width('100%')
        }
        .layoutWeight(1)
        .alignItems(HorizontalAlign.Start)

        Text(this.ad.callToAction ?? '查看')
          .fontSize(12)
          .fontColor(Color.White)
          .textAlign(TextAlign.Center)
          .padding({ left: 10, right: 10, top: 5, bottom: 5 })
          .backgroundColor(Colors.PRIMARY_TEXT)
          .borderRadius(4)
      }
      .width('100%')
      .height(54)
      .padding({ left: 10, right: 10 })
      .backgroundColor(Color.White)
      .borderRadius(6)
      .alignItems(VerticalAlign.Center)
      .onClick(() => this.showAd())
    }
  }
}
