/**
 * 鲸鸿动能广告位配置
 * - AD_ENABLED：全局广告总开关（验收/审核出问题时一键关闭）
 * - USE_TEST_IDS：true=华为官方测试广告位（联调用），false=正式广告位（上线前替换）
 */
export class AdIds {
  // 鸿蒙 4.0 分支：广告已按 @ohos.advertising (API 11) 恢复
  static AD_ENABLED: boolean = true;
  static USE_TEST_IDS: boolean = true;

  // 华为官方测试广告位 ID
  private static TEST_NATIVE: string = 'testu7m3hc4gvm'; // 原生大图
  private static TEST_BANNER: string = 'testw6vs28auh3'; // Banner
  private static TEST_REWARD: string = 'testx9dtjwj8hp'; // 激励视频
  private static TEST_INTERSTITIAL_VIDEO: string = 'testb4znbuh3n2'; // 插屏视频
  private static TEST_INTERSTITIAL_IMAGE: string = 'teste9ih9j0rc3'; // 插屏图片

  // TODO: 鲸鸿动能媒体服务平台创建展示位后，替换为正式广告位 ID
  private static PROD_NATIVE: string = '';
  private static PROD_BANNER: string = '';
  private static PROD_REWARD: string = '';
  private static PROD_INTERSTITIAL_VIDEO: string = '';
  private static PROD_INTERSTITIAL_IMAGE: string = '';

  static nativeAdId(): string {
    return AdIds.USE_TEST_IDS ? AdIds.TEST_NATIVE : AdIds.PROD_NATIVE;
  }

  static bannerAdId(): string {
    return AdIds.USE_TEST_IDS ? AdIds.TEST_BANNER : AdIds.PROD_BANNER;
  }

  static rewardAdId(): string {
    return AdIds.USE_TEST_IDS ? AdIds.TEST_REWARD : AdIds.PROD_REWARD;
  }

  static interstitialVideoAdId(): string {
    return AdIds.USE_TEST_IDS ? AdIds.TEST_INTERSTITIAL_VIDEO : AdIds.PROD_INTERSTITIAL_VIDEO;
  }

  static interstitialImageAdId(): string {
    return AdIds.USE_TEST_IDS ? AdIds.TEST_INTERSTITIAL_IMAGE : AdIds.PROD_INTERSTITIAL_IMAGE;
  }

  /**
   * 插屏广告位 ID：优先视频，若视频为空则退回图片
   * 正式环境建议同时创建视频和图片展示位，按填充情况动态选择
   */
  static interstitialAdId(): string {
    const video = AdIds.interstitialVideoAdId();
    return video.length > 0 ? video : AdIds.interstitialImageAdId();
  }
}
