import advertising from "@ohos:advertising";
import type common from "@ohos:app.ability.common";
import hilog from "@ohos:hilog";
const TAG: string = 'WorkerBeeAd';
const AD_TYPE_SPLASH: number = 1;
const AD_TYPE_NATIVE: number = 3;
const AD_TYPE_REWARD: number = 7;
const AD_TYPE_BANNER: number = 8;
const AD_TYPE_INTERSTITIAL: number = 12;
const AD_TYPE_ROLL: number = 60;
export interface RewardAdCallbacks {
    onReward?: () => void;
    onClose?: () => void;
    onError?: (code: number, msg: string) => void;
}
export class AdService {
    static loadNativeAds(g12: common.Context, h12: string, i12: number = 1): Promise<advertising.Advertisement[]> {
        const j12: advertising.AdRequestParams = {
            adId: h12,
            adType: AD_TYPE_NATIVE,
            adCount: i12,
            adWidth: 360,
            adHeight: 320
        };
        const k12: advertising.AdOptions = {
            allowMobileTraffic: 0,
            tagForChildProtection: -1,
            tagForUnderAgeOfPromise: -1,
            adContentClassification: 'A'
        };
        return new Promise((l12: (ads: advertising.Advertisement[]) => void) => {
            try {
                const n12 = new advertising.AdLoader(g12);
                const o12: advertising.AdLoadListener = {
                    onAdLoadSuccess: (r12: advertising.Advertisement[]) => {
                        hilog.info(0x0000, TAG, 'native ads loaded: %{public}d', r12?.length ?? 0);
                        l12(r12 ?? []);
                    },
                    onAdLoadFailure: (p12: number, q12: string) => {
                        hilog.error(0x0000, TAG, 'loadNativeAds failed code=%{public}d msg=%{public}s', p12, q12);
                        l12([]);
                    }
                };
                n12.loadAd(j12, k12, o12);
            }
            catch (m12) {
                hilog.error(0x0000, TAG, 'loadNativeAds exception %{public}s', JSON.stringify(m12));
                l12([]);
            }
        });
    }
    static loadRewardAd(u11: common.Context, v11: string): Promise<advertising.Advertisement | null> {
        const w11: advertising.AdRequestParams = {
            adId: v11,
            adType: AD_TYPE_REWARD
        };
        const x11: advertising.AdOptions = {
            allowMobileTraffic: 0,
            tagForChildProtection: -1,
            tagForUnderAgeOfPromise: -1,
            adContentClassification: 'A'
        };
        return new Promise((y11: (ad: advertising.Advertisement | null) => void) => {
            try {
                const a12 = new advertising.AdLoader(u11);
                const b12: advertising.AdLoadListener = {
                    onAdLoadSuccess: (e12: advertising.Advertisement[]) => {
                        const f12 = e12?.[0] ?? null;
                        hilog.info(0x0000, TAG, 'reward ad loaded %{public}s', f12 !== null ? 'ok' : 'empty');
                        y11(f12);
                    },
                    onAdLoadFailure: (c12: number, d12: string) => {
                        hilog.error(0x0000, TAG, 'loadRewardAd failed code=%{public}d msg=%{public}s', c12, d12);
                        y11(null);
                    }
                };
                a12.loadAd(w11, x11, b12);
            }
            catch (z11) {
                hilog.error(0x0000, TAG, 'loadRewardAd exception %{public}s', JSON.stringify(z11));
                y11(null);
            }
        });
    }
    static showRewardAd(p11: common.UIAbilityContext, q11: advertising.Advertisement, r11: RewardAdCallbacks): void {
        const s11: advertising.AdDisplayOptions = {
            mute: false,
            useMobileDataReminder: true
        };
        try {
            advertising.showAd(q11, s11, p11);
            r11.onReward?.();
            r11.onClose?.();
        }
        catch (t11) {
            hilog.error(0x0000, TAG, 'showRewardAd exception %{public}s', JSON.stringify(t11));
            r11.onError?.(-1, JSON.stringify(t11));
        }
    }
    static loadInterstitialAd(i11: common.Context, j11: string, k11: string): Promise<advertising.Advertisement | null> {
        return new Promise((l11: (ad: advertising.Advertisement | null) => void) => {
            AdService.loadSingleAd(i11, j11, AD_TYPE_INTERSTITIAL)
                .then((o11: advertising.Advertisement | null) => {
                if (o11 !== null) {
                    l11(o11);
                    return;
                }
                hilog.info(0x0000, TAG, 'interstitial video id failed, fallback to image id');
                return AdService.loadSingleAd(i11, k11, AD_TYPE_INTERSTITIAL);
            })
                .then((n11: advertising.Advertisement | null | undefined) => {
                l11(n11 ?? null);
            })
                .catch((m11: Error) => {
                hilog.error(0x0000, TAG, 'loadInterstitialAd exception %{public}s', m11.message);
                l11(null);
            });
        });
    }
    private static loadSingleAd(v10: common.Context, w10: string, x10: number): Promise<advertising.Advertisement | null> {
        const y10: advertising.AdRequestParams = {
            adId: w10,
            adType: x10
        };
        const z10: advertising.AdOptions = {
            allowMobileTraffic: 0,
            tagForChildProtection: -1,
            tagForUnderAgeOfPromise: -1,
            adContentClassification: 'A'
        };
        return new Promise((a11: (ad: advertising.Advertisement | null) => void) => {
            try {
                const c11 = new advertising.AdLoader(v10);
                const d11: advertising.AdLoadListener = {
                    onAdLoadSuccess: (g11: advertising.Advertisement[]) => {
                        const h11 = g11?.[0] ?? null;
                        hilog.info(0x0000, TAG, 'interstitial ad loaded type=%{public}d ok=%{public}s', x10, h11 !== null);
                        a11(h11);
                    },
                    onAdLoadFailure: (e11: number, f11: string) => {
                        hilog.error(0x0000, TAG, 'loadSingleAd type=%{public}d failed code=%{public}d msg=%{public}s', x10, e11, f11);
                        a11(null);
                    }
                };
                c11.loadAd(y10, z10, d11);
            }
            catch (b11) {
                hilog.error(0x0000, TAG, 'loadSingleAd exception %{public}s', JSON.stringify(b11));
                a11(null);
            }
        });
    }
    static showInterstitialAd(r10: common.UIAbilityContext, s10: advertising.Advertisement): void {
        const t10: advertising.AdDisplayOptions = {
            useMobileDataReminder: true
        };
        try {
            advertising.showAd(s10, t10, r10);
        }
        catch (u10) {
            hilog.error(0x0000, TAG, 'showInterstitialAd exception %{public}s', JSON.stringify(u10));
        }
    }
}
