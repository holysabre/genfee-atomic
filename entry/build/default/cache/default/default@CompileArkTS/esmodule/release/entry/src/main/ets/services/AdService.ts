import advertising from "@ohos:advertising";
import type common from "@ohos:app.ability.common";
import hilog from "@ohos:hilog";
const TAG: string = 'WorkerBeeAd';
export class AdService {
    static loadNativeAds(q9: common.Context, r9: string, s9: number = 1): Promise<advertising.Advertisement[]> {
        const t9: advertising.AdRequestParams = {
            adId: r9,
            adType: 3,
            adCount: s9,
            adWidth: 360,
            adHeight: 320
        };
        const u9: advertising.AdOptions = {
            allowMobileTraffic: 0,
            tagForChildProtection: -1,
            tagForUnderAgeOfPromise: -1,
            adContentClassification: 'A'
        };
        return new Promise((v9: (ads: advertising.Advertisement[]) => void) => {
            try {
                const x9 = new advertising.AdLoader(q9);
                const y9: advertising.AdLoadListener = {
                    onAdLoadSuccess: (b10: advertising.Advertisement[]) => {
                        hilog.info(0x0000, TAG, 'native ads loaded: %{public}d', b10?.length ?? 0);
                        v9(b10 ?? []);
                    },
                    onAdLoadFailure: (z9: number, a10: string) => {
                        hilog.error(0x0000, TAG, 'loadNativeAds failed code=%{public}d msg=%{public}s', z9, a10);
                        v9([]);
                    }
                };
                x9.loadAd(t9, u9, y9);
            }
            catch (w9) {
                hilog.error(0x0000, TAG, 'loadNativeAds exception %{public}s', JSON.stringify(w9));
                v9([]);
            }
        });
    }
}
