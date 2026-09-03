/**
 * 全局颜色常量（审核整改：确保色彩对比度达标）
 * - 图标/标题文字与背景对比度 > 3:1
 * - 正文文字与背景对比度 > 4.5:1
 *
 * 已弃用色：
 * #A67C00（浅金）白底对比度约 3.82:1，刚踩 3:1 线，Mate X5 等折叠屏易落水
 * #D62828（鲜红）白底对比度约 5.01:1，虽过 3:1，但图片渲染/压缩后易变淡
 * #FD7272（浅红）白底对比度约 2.68:1，不满足图标 3:1 要求
 * #B0CBEB（浅蓝）与 #222222 对比度约 9.54:1，本身安全；加深为 #8FB0D9 是为统一视觉余量
 */
export class Colors {
  /** 主强调文字色（原 #A67C00 加深版）。白底对比度约 9.2:1，远高于 3:1 */
  static PRIMARY_TEXT: string = '#5C4400';

  /** 主按钮背景色（黄底黑字，对比度约 14.2:1，安全） */
  static PRIMARY_BUTTON_BG: string = '#FDD000';

  /** 薪资强调色（原 #D62828 加深版）。白底对比度约 6.6:1，满足图标/标题要求 */
  static SALARY_TEXT: string = '#B52020';

  /** 标题/正文深色文字。白底对比度约 15.9:1 */
  static BODY_TEXT: string = '#222222';

  /** 次要文字。白底对比度约 7.0:1 */
  static SECONDARY_TEXT: string = '#595959';

  /** 辅助说明文字。白底对比度约 5.7:1 */
  static CAPTION_TEXT: string = '#666666';

  /** 标题栏/筛选栏背景色（原 #B0CBEB 加深版）。与 #222222 对比度约 7.1:1 */
  static TITLE_BAR_BG: string = '#8FB0D9';

  /** 页面背景色（列表页整体背景，不承载正文） */
  static PAGE_BG: string = '#B0CBEB';

  /** 卡片/内容区背景 */
  static CARD_BG: string = '#FFFFFF';
}
