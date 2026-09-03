import { AdIds } from '../constants/AdIds';

/**
 * Banner 广告（鸿蒙 4.0 占位实现）。
 * 当前分支为优先跑通基础功能，广告总开关已关闭，本组件不实际渲染广告。
 * 后续如需恢复广告，需使用 @ohos.cloud.AutoAdComponent 或按 API 10 广告文档重写。
 */
@Component
export struct BannerAdView {
  build() {
    // 广告关闭期间不渲染任何内容
    Column()
      .width('100%')
      .height(0)
  }
}
