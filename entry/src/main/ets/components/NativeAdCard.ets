import advertising from '@ohos.advertising';
import hilog from '@ohos.hilog';
import common from '@ohos.app.ability.common';
import { Colors } from '../constants/Colors';

const TAG: string = 'WorkerBeeAd';

/**
 * 原生广告卡片（API 11 自渲染实现）。
 * 使用 @ohos.advertising 加载的广告素材自行布局，点击后调用 showAd 打开落地页。
 * 注意：元服务不支持 OAID，仅投放非个性化广告；模拟器不出广告，需真机联调。
 */
@Component
export struct NativeAdCard {
  ad: advertising.Advertisement | null = null;

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
      hilog.error(0x0000, TAG, 'native ad click showAd exception %{public}s', JSON.stringify(e));
    }
  }

  build() {
    Column() {
      // 标题行：图标 + 标题 + 广告标识
      Row() {
        Image(this.ad?.iconUrl ?? '')
          .width(36)
          .height(36)
          .borderRadius(4)
          .objectFit(ImageFit.Cover)
          .margin({ right: 8 })

        Column() {
          Text(this.ad?.title ?? '')
            .fontSize(15)
            .fontColor(Colors.BODY_TEXT)
            .fontWeight(FontWeight.Medium)
            .maxLines(1)
            .textOverflow({ overflow: TextOverflow.Ellipsis })
            .width('100%')

          Text(this.ad?.adSource ?? '广告')
            .fontSize(11)
            .fontColor(Colors.CAPTION_TEXT)
            .maxLines(1)
            .width('100%')
        }
        .layoutWeight(1)
        .alignItems(HorizontalAlign.Start)

        Text('广告')
          .fontSize(10)
          .fontColor(Colors.CAPTION_TEXT)
          .padding({ left: 4, right: 4 })
          .border({ width: 0.5, color: Colors.CAPTION_TEXT })
          .borderRadius(2)
      }
      .width('100%')
      .alignItems(VerticalAlign.Center)
      .margin({ bottom: 8 })

      // 主图
      Image(this.ad?.imgUrl ?? '')
        .width('100%')
        .height(160)
        .objectFit(ImageFit.Cover)
        .borderRadius(6)
        .margin({ bottom: 8 })

      // 描述 + 按钮
      Row() {
        Text(this.ad?.description ?? '')
          .fontSize(13)
          .fontColor(Colors.SECONDARY_TEXT)
          .maxLines(2)
          .textOverflow({ overflow: TextOverflow.Ellipsis })
          .layoutWeight(1)
          .margin({ right: 10 })

        Text(this.ad?.callToAction ?? '查看详情')
          .fontSize(13)
          .fontColor(Color.White)
          .textAlign(TextAlign.Center)
          .padding({ left: 12, right: 12, top: 6, bottom: 6 })
          .backgroundColor(Colors.PRIMARY_TEXT)
          .borderRadius(4)
      }
      .width('100%')
      .alignItems(VerticalAlign.Center)
    }
    .width('100%')
    .padding(12)
    .backgroundColor(Color.White)
    .borderRadius(8)
    .margin({ top: 8, bottom: 8 })
    .onClick(() => this.showAd())
  }
}
