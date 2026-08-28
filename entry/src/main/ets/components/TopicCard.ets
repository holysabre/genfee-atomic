import { Topic } from '../services/TopicApi';
import { Colors } from '../constants/Colors';

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
          .fontColor(Colors.BODY_TEXT)
          .maxLines(1)
          .textOverflow({ overflow: TextOverflow.Ellipsis })
          .layoutWeight(1)
        Text(this.topic?.salary ?? '')
          .fontSize(12)
          .fontWeight(FontWeight.Bold)
          .fontColor(Colors.SALARY_TEXT)
      }
      .width('100%')
      .margin({ bottom: 8 })

      // 内容
      Text(this.topic?.content ?? '')
        .fontSize(14)
        .fontColor(Colors.BODY_TEXT)
        .lineHeight(19)
        .width('100%')
        .margin({ bottom: 10 })

      // 企业
      Text(this.topic?.company_name ?? '')
        .fontSize(12)
        .fontColor(Colors.SECONDARY_TEXT)
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
          .fontColor(Colors.SECONDARY_TEXT)
          .maxLines(1)
          .textOverflow({ overflow: TextOverflow.Ellipsis })
          .layoutWeight(1)
        Text('立刻联系')
          .fontSize(12)
          .fontColor(Colors.PRIMARY_TEXT)
          .textAlign(TextAlign.Center)
          .width(65)
          .height(25)
          .borderRadius(13)
          .border({ width: 1, color: Colors.PRIMARY_TEXT })
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
