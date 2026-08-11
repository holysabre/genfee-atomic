import { Topic } from '../services/TopicApi';

/**
 * 帖子卡片（1:1 还原小程序版视觉）：
 * 白底圆角卡片，顶部 类别+薪资，中部内容，底部 地址 + 立刻联系。
 * 尺寸换算：小程序 rpx / 2 ≈ vp（750rpx 设计稿 ↔ 360vp）。
 */
@Component
export struct TopicCard {
  topic: Topic | null = null;
  onContact: (mobile: string) => void = () => {};

  build() {
    Column() {
      // 顶部：图标 + 类别 + 薪资
      Row() {
        Image($r('app.media.recruit'))
          .width(25)
          .height(25)
          .margin({ right: 11 })
        Text(this.topic?.category_name ?? '')
          .fontSize(18)
          .fontWeight(FontWeight.Bold)
          .fontColor('#222222')
          .maxLines(1)
          .textOverflow({ overflow: TextOverflow.Ellipsis })
          .layoutWeight(1)
        Text(this.topic?.salary ?? '')
          .fontSize(12)
          .fontWeight(FontWeight.Bold)
          .fontColor('#FD7272')
      }
      .width('100%')
      .margin({ bottom: 8 })

      // 内容
      Text(this.topic?.content ?? '')
        .fontSize(14)
        .fontColor('#222222')
        .lineHeight(19)
        .width('100%')
        .margin({ bottom: 10 })

      // 企业
      Text(this.topic?.company_name ?? '')
        .fontSize(12)
        .fontColor('#4D222222')
        .width('100%')
        .margin({ bottom: 8 })

      // 底部：地址 + 立刻联系
      Row() {
        Image($r('app.media.address'))
          .width(16)
          .height(16)
          .margin({ right: 2 })
        Text(this.topic?.address ?? '')
          .fontSize(12)
          .fontColor('#4D222222')
          .maxLines(1)
          .textOverflow({ overflow: TextOverflow.Ellipsis })
          .layoutWeight(1)
        Text('立刻联系')
          .fontSize(12)
          .fontColor('#FFC900')
          .textAlign(TextAlign.Center)
          .width(65)
          .height(25)
          .borderRadius(13)
          .border({ width: 1, color: '#FFE37B' })
          .onClick(() => {
            const mobile = this.topic?.mobile;
            if (mobile !== undefined && mobile !== null) {
              this.onContact(String(mobile));
            }
          })
      }
      .width('100%')
    }
    .width('100%')
    .padding(10)
    .margin({ bottom: 10 })
    .backgroundColor(Color.White)
    .borderRadius(8)
  }
}
