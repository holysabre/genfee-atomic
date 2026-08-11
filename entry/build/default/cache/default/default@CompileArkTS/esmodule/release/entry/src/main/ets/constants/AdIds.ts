export class AdIds {
    static readonly AD_ENABLED: boolean = true;
    static readonly USE_TEST_IDS: boolean = true;
    private static readonly TEST_NATIVE: string = 'testu7m3hc4gvm';
    private static readonly TEST_BANNER: string = 'testw6vs28auh3';
    private static readonly PROD_NATIVE: string = '';
    private static readonly PROD_BANNER: string = '';
    static nativeAdId(): string {
        return AdIds.USE_TEST_IDS ? AdIds.TEST_NATIVE : AdIds.PROD_NATIVE;
    }
    static bannerAdId(): string {
        return AdIds.USE_TEST_IDS ? AdIds.TEST_BANNER : AdIds.PROD_BANNER;
    }
}
