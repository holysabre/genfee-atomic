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
    static loadNativeAds(h12: common.Context, i12: string, j12: number = 1): Promise<advertising.Advertisement[]> {
        const k12: advertising.AdRequestParams = {
            adId: i12,
            adType: AD_TYPE_NATIVE,
            adCount: j12,
            adWidth: 360,
            adHeight: 320
        };
        const l12: advertising.AdOptions = {
            allowMobileTraffic: 0,
            tagForChildProtection: -1,
            tagForUnderAgeOfPromise: -1,
            adContentClassification: 'A'
        };
        return new Promise((m12: (ads: advertising.Advertisement[]) => void) => {
            try {
                const o12 = new advertising.AdLoader(h12);
                const p12: advertising.AdLoadListener = {
                    onAdLoadSuccess: (s12: advertising.Advertisement[]) => {
                        hilog.info(0x0000, TAG, 'native ads loaded: %{public}d', s12?.length ?? 0);
                        m12(s12 ?? []);
                    },
                    onAdLoadFailure: (q12: number, r12: string) => {
                        hilog.error(0x0000, TAG, 'loadNativeAds failed code=%{public}d msg=%{public}s', q12, r12);
                        m12([]);
                    }
                };
                o12.loadAd(k12, l12, p12);
            }
            catch (n12) {
                hilog.error(0x0000, TAG, 'loadNativeAds exception %{public}s', JSON.stringify(n12));
                m12([]);
            }
        });
    }
    static loadRewardAd(v11: common.Context, w11: string): Promise<advertising.Advertisement | null> {
        const x11: advertising.AdRequestParams = {
            adId: w11,
            adType: AD_TYPE_REWARD
        };
        const y11: advertising.AdOptions = {
            allowMobileTraffic: 0,
            tagForChildProtection: -1,
            tagForUnderAgeOfPromise: -1,
            adContentClassification: 'A'
        };
        return new Promise((z11: (ad: advertising.Advertisement | null) => void) => {
            try {
                const b12 = new advertising.AdLoader(v11);
                const c12: advertising.AdLoadListener = {
                    onAdLoadSuccess: (f12: advertising.Advertisement[]) => {
                        const g12 = f12?.[0] ?? null;
                        hilog.info(0x0000, TAG, 'reward ad loaded %{public}s', g12 !== null ? 'ok' : 'empty');
                        z11(g12);
                    },
                    onAdLoadFailure: (d12: number, e12: string) => {
                        hilog.error(0x0000, TAG, 'loadRewardAd failed code=%{public}d msg=%{public}s', d12, e12);
                        z11(null);
                    }
                };
                b12.loadAd(x11, y11, c12);
            }
            catch (a12) {
                hilog.error(0x0000, TAG, 'loadRewardAd exception %{public}s', JSON.stringify(a12));
                z11(null);
            }
        });
    }
    static showRewardAd(q11: common.UIAbilityContext, r11: advertising.Advertisement, s11: RewardAdCallbacks): void {
        const t11: advertising.AdDisplayOptions = {
            mute: false,
            useMobileDataReminder: true
        };
        try {
            advertising.showAd(r11, t11, q11);
            s11.onReward?.();
            s11.onClose?.();
        }
        catch (u11) {
            hilog.error(0x0000, TAG, 'showRewardAd exception %{public}s', JSON.stringify(u11));
            s11.onError?.(-1, JSON.stringify(u11));
        }
    }
    static loadInterstitialAd(j11: common.Context, k11: string, l11: string): Promise<advertising.Advertisement | null> {
        return new Promise((m11: (ad: advertising.Advertisement | null) => void) => {
            AdService.loadSingleAd(j11, k11, AD_TYPE_INTERSTITIAL)
                .then((p11: advertising.Advertisement | null) => {
                if (p11 !== null) {
                    m11(p11);
                    return;
                }
                hilog.info(0x0000, TAG, 'interstitial video id failed, fallback to image id');
                return AdService.loadSingleAd(j11, l11, AD_TYPE_INTERSTITIAL);
            })
                .then((o11: advertising.Advertisement | null | undefined) => {
                m11(o11 ?? null);
            })
                .catch((n11: Error) => {
                hilog.error(0x0000, TAG, 'loadInterstitialAd exception %{public}s', n11.message);
                m11(null);
            });
        });
    }
    private static loadSingleAd(w10: common.Context, x10: string, y10: number): Promise<advertising.Advertisement | null> {
        const z10: advertising.AdRequestParams = {
            adId: x10,
            adType: y10
        };
        const a11: advertising.AdOptions = {
            allowMobileTraffic: 0,
            tagForChildProtection: -1,
            tagForUnderAgeOfPromise: -1,
            adContentClassification: 'A'
        };
        return new Promise((b11: (ad: advertising.Advertisement | null) => void) => {
            try {
                const d11 = new advertising.AdLoader(w10);
                const e11: advertising.AdLoadListener = {
                    onAdLoadSuccess: (h11: advertising.Advertisement[]) => {
                        const i11 = h11?.[0] ?? null;
                        hilog.info(0x0000, TAG, 'interstitial ad loaded type=%{public}d ok=%{public}s', y10, i11 !== null);
                        b11(i11);
                    },
                    onAdLoadFailure: (f11: number, g11: string) => {
                        hilog.error(0x0000, TAG, 'loadSingleAd type=%{public}d failed code=%{public}d msg=%{public}s', y10, f11, g11);
                        b11(null);
                    }
                };
                d11.loadAd(z10, a11, e11);
            }
            catch (c11) {
                hilog.error(0x0000, TAG, 'loadSingleAd exception %{public}s', JSON.stringify(c11));
                b11(null);
            }
        });
    }
    static showInterstitialAd(s10: common.UIAbilityContext, t10: advertising.Advertisement): void {
        const u10: advertising.AdDisplayOptions = {
            useMobileDataReminder: true
        };
        try {
            advertising.showAd(t10, u10, s10);
        }
        catch (v10) {
            hilog.error(0x0000, TAG, 'showInterstitialAd exception %{public}s', JSON.stringify(v10));
        }
    }
}
