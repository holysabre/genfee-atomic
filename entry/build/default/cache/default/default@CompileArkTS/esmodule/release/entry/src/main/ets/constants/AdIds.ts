export class AdIds {
    static readonly AD_ENABLED: boolean = true;
    static readonly USE_TEST_IDS: boolean = true;
    private static readonly TEST_NATIVE: string = 'testu7m3hc4gvm';
    private static readonly TEST_BANNER: string = 'testw6vs28auh3';
    private static readonly TEST_REWARD: string = 'testx9dtjwj8hp';
    private static readonly TEST_INTERSTITIAL_VIDEO: string = 'testb4znbuh3n2';
    private static readonly TEST_INTERSTITIAL_IMAGE: string = 'teste9ih9j0rc3';
    private static readonly PROD_NATIVE: string = '';
    private static readonly PROD_BANNER: string = '';
    private static readonly PROD_REWARD: string = '';
    private static readonly PROD_INTERSTITIAL_VIDEO: string = '';
    private static readonly PROD_INTERSTITIAL_IMAGE: string = '';
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
    static interstitialAdId(): string {
        const v2 = AdIds.interstitialVideoAdId();
        return v2.length > 0 ? v2 : AdIds.interstitialImageAdId();
    }
}
