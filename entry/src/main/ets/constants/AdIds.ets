/**
 * 鲸鸿动能广告位配置
 * - AD_ENABLED：全局广告总开关（验收/审核出问题时一键关闭）
 * - USE_TEST_IDS：true=华为官方测试广告位（联调用），false=正式广告位（上线前替换）
 */
export class AdIds {
  static readonly AD_ENABLED: boolean = true;
  static readonly USE_TEST_IDS: boolean = true;

  // 华为官方测试广告位 ID
  private static readonly TEST_NATIVE: string = 'testu7m3hc4gvm'; // 原生大图
  private static readonly TEST_BANNER: string = 'testw6vs28auh3'; // Banner

  // TODO: 鲸鸿动能媒体服务平台创建展示位后，替换为正式广告位 ID
  private static readonly PROD_NATIVE: string = '';
  private static readonly PROD_BANNER: string = '';

  static nativeAdId(): string {
    return AdIds.USE_TEST_IDS ? AdIds.TEST_NATIVE : AdIds.PROD_NATIVE;
  }

  static bannerAdId(): string {
    return AdIds.USE_TEST_IDS ? AdIds.TEST_BANNER : AdIds.PROD_BANNER;
  }
}
