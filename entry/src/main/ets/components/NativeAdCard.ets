import { advertising, AdComponent } from '@kit.AdsKit';
import { hilog } from '@kit.PerformanceAnalysisKit';

/**
 * 原生广告卡片：混入列表信息流。
 * 使用系统渲染的 AdComponent —— 曝光/点击上报由系统自动完成，符合鲸鸿动能合规要求。
 */
@Component
export struct NativeAdCard {
  ad: advertising.Advertisement | null = null;
  private displayOptions: advertising.AdDisplayOptions = {
    mute: true
  };

  build() {
    if (this.ad !== null) {
      Column() {
        AdComponent({
          ads: [this.ad as advertising.Advertisement],
          displayOptions: this.displayOptions,
          interactionListener: {
            onStatusChanged: (status: string) => {
              hilog.info(0x0000, 'WorkerBeeAd', 'native ad status %{public}s', status);
            }
          }
        })
          .width('100%')
          .height(240) // 联调校准点：按实际返回素材比例微调（请求参数 360x320）
      }
      .width('100%')
      .margin({ bottom: 10 })
      .backgroundColor(Color.White)
      .borderRadius(8)
      .clip(true)
    }
  }
}
