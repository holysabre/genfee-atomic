import { GlobalSettings } from '../services/SettingsApi';

/**
 * 鲸鸿动能广告位配置
 * - AD_ENABLED：全局广告总开关（可由 /settings/global.jhdn_ad_enable 接口覆盖）
 * - USE_TEST_IDS：true=华为官方测试广告位，false=接口下发的正式广告位
 * - 五个广告位 ID 优先读取 /settings/global 下发的正式位；接口未下发时退回本地测试位
 */
export class AdIds {
  static AD_ENABLED: boolean = true;
  static USE_TEST_IDS: boolean = true;

  private static jhdn_ad_native: string = '';
  private static jhdn_ad_banner: string = '';
  private static jhdn_ad_reward: string = '';
  private static jhdn_ad_interstitial_video: string = '';
  private static jhdn_ad_interstitial_image: string = '';

  /** 用 /settings/global 响应刷新广告配置。应在 Ability onCreate 或首页 aboutToAppear 时调用一次 */
  static applySettings(settings: GlobalSettings | null): void {
    if (settings) {
      AdIds.AD_ENABLED = AdIds.parseBool(settings.jhdn_ad_enable, AdIds.AD_ENABLED);
      AdIds.USE_TEST_IDS = AdIds.parseBool(settings.jhdn_ad_test, true);
      AdIds.jhdn_ad_native = AdIds.fieldOrEmpty(settings.jhdn_ad_native);
      AdIds.jhdn_ad_banner = AdIds.fieldOrEmpty(settings.jhdn_ad_banner);
      AdIds.jhdn_ad_reward = AdIds.fieldOrEmpty(settings.jhdn_ad_reward);
      AdIds.jhdn_ad_interstitial_video = AdIds.fieldOrEmpty(settings.jhdn_ad_interstitial_video);
      AdIds.jhdn_ad_interstitial_image = AdIds.fieldOrEmpty(settings.jhdn_ad_interstitial_image);
    }
  }

  private static parseBool(v: string | null | undefined, def: boolean): boolean {
    if (v === null || v === undefined || v === '') {
      return def;
    }
    return v === '1' || v.toLowerCase() === 'true';
  }

  private static fieldOrEmpty(v: string | null | undefined): string {
    return v ?? '';
  }

  private static TEST_NATIVE: string = 'testu7m3hc4gvm';
  private static TEST_BANNER: string = 'testw6vs28auh3';
  private static TEST_REWARD: string = 'testx9dtjwj8hp';
  private static TEST_INTERSTITIAL_VIDEO: string = 'testb4znbuh3n2';
  private static TEST_INTERSTITIAL_IMAGE: string = 'teste9ih9j0rc3';

  static nativeAdId(): string {
    const prod = AdIds.jhdn_ad_native;
    if (!AdIds.USE_TEST_IDS && prod.length > 0) {
      return prod;
    }
    return AdIds.TEST_NATIVE;
  }

  static bannerAdId(): string {
    const prod = AdIds.jhdn_ad_banner;
    if (!AdIds.USE_TEST_IDS && prod.length > 0) {
      return prod;
    }
    return AdIds.TEST_BANNER;
  }

  static rewardAdId(): string {
    const prod = AdIds.jhdn_ad_reward;
    if (!AdIds.USE_TEST_IDS && prod.length > 0) {
      return prod;
    }
    return AdIds.TEST_REWARD;
  }

  static interstitialVideoAdId(): string {
    const prod = AdIds.jhdn_ad_interstitial_video;
    if (!AdIds.USE_TEST_IDS && prod.length > 0) {
      return prod;
    }
    return AdIds.TEST_INTERSTITIAL_VIDEO;
  }

  static interstitialImageAdId(): string {
    const prod = AdIds.jhdn_ad_interstitial_image;
    if (!AdIds.USE_TEST_IDS && prod.length > 0) {
      return prod;
    }
    return AdIds.TEST_INTERSTITIAL_IMAGE;
  }

  /**
   * 插屏广告位 ID：优先视频，若视频为空则退回图片
   */
  static interstitialAdId(): string {
    const video = AdIds.interstitialVideoAdId();
    return video.length > 0 ? video : AdIds.interstitialImageAdId();
  }
}
