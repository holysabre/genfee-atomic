import advertising from '@ohos.advertising';
import common from '@ohos.app.ability.common';
import hilog from '@ohos.hilog';

const TAG: string = 'WorkerBeeAd';

/** 鲸鸿动能广告类型常量（按官方文档校准） */
const AD_TYPE_SPLASH: number = 1;
const AD_TYPE_NATIVE: number = 3;
const AD_TYPE_REWARD: number = 7;
const AD_TYPE_BANNER: number = 8;
const AD_TYPE_INTERSTITIAL: number = 12;
const AD_TYPE_ROLL: number = 60;

/** 激励视频生命周期回调 */
export interface RewardAdCallbacks {
  onReward?: () => void;
  onClose?: () => void;
  onError?: (code: number, msg: string) => void;
}

/**
 * 鲸鸿动能广告服务封装（Ads Kit）
 *
 * 元服务限制（编译器确认）：
 * - 不支持 identifier / getOAID → 无法获取 OAID，只能投放**非个性化广告**
 * - AdLoader.loadAd 仅支持三参回调形式（无 Promise 重载），此处封装为 Promise
 * - 模拟器不出广告，必须真机联调。隐私声明已由平台托管（AGC 标准化隐私声明托管服务），页面无需自建同意弹窗，可直接请求广告
 */
export class AdService {
  /** 加载原生广告（adType=3）。返回空数组表示无填充/失败，调用方静默隐藏广告位即可 */
  static loadNativeAds(context: common.Context, adId: string, count: number = 1): Promise<advertising.Advertisement[]> {
    const params: advertising.AdRequestParams = {
      adId: adId,
      adType: AD_TYPE_NATIVE,
      adCount: count,
      adWidth: 360,
      adHeight: 320
      // 注：元服务不支持 OAID，不传 oaid 字段（非个性化广告）
    };
    const options: advertising.AdOptions = {
      allowMobileTraffic: 0,
      tagForChildProtection: -1,
      tagForUnderAgeOfPromise: -1,
      adContentClassification: 'A'
    };

    return new Promise((resolve: (ads: advertising.Advertisement[]) => void) => {
      try {
        const loader = new advertising.AdLoader(context);
        const listener: advertising.AdLoadListener = {
          onAdLoadSuccess: (ads: advertising.Advertisement[]) => {
            hilog.info(0x0000, TAG, 'native ads loaded: %{public}d', ads?.length ?? 0);
            resolve(ads ?? []);
          },
          onAdLoadFailure: (errorCode: number, errorMsg: string) => {
            hilog.error(0x0000, TAG, 'loadNativeAds failed code=%{public}d msg=%{public}s', errorCode, errorMsg);
            resolve([]);
          }
        };
        loader.loadAd(params, options, listener);
      } catch (e) {
        hilog.error(0x0000, TAG, 'loadNativeAds exception %{public}s', JSON.stringify(e));
        resolve([]);
      }
    });
  }

  /**
   * 加载激励视频广告。
   * 返回 null 表示加载失败，调用方应降级处理（如允许用户直接操作）。
   */
  static loadRewardAd(context: common.Context, adId: string): Promise<advertising.Advertisement | null> {
    const params: advertising.AdRequestParams = {
      adId: adId,
      adType: AD_TYPE_REWARD
      // 注：元服务不支持 OAID，不传 oaid 字段
    };
    const options: advertising.AdOptions = {
      allowMobileTraffic: 0,
      tagForChildProtection: -1,
      tagForUnderAgeOfPromise: -1,
      adContentClassification: 'A'
    };

    return new Promise((resolve: (ad: advertising.Advertisement | null) => void) => {
      try {
        const loader = new advertising.AdLoader(context);
        const listener: advertising.AdLoadListener = {
          onAdLoadSuccess: (ads: advertising.Advertisement[]) => {
            const ad = ads?.[0] ?? null;
            hilog.info(0x0000, TAG, 'reward ad loaded %{public}s', ad !== null ? 'ok' : 'empty');
            resolve(ad);
          },
          onAdLoadFailure: (errorCode: number, errorMsg: string) => {
            hilog.error(0x0000, TAG, 'loadRewardAd failed code=%{public}d msg=%{public}s', errorCode, errorMsg);
            resolve(null);
          }
        };
        loader.loadAd(params, options, listener);
      } catch (e) {
        hilog.error(0x0000, TAG, 'loadRewardAd exception %{public}s', JSON.stringify(e));
        resolve(null);
      }
    });
  }

  /**
   * 展示激励视频广告。
   * @param context UIAbility 上下文
   * @param ad 已加载的激励视频广告对象
   * @param callbacks 激励视频生命周期回调
   */
  static showRewardAd(
    context: common.UIAbilityContext,
    ad: advertising.Advertisement,
    callbacks: RewardAdCallbacks
  ): void {
    const displayOptions: advertising.AdDisplayOptions = {
      mute: false,
      useMobileDataReminder: true
    };

    try {
      // showAd 为全屏广告展示，同步阻塞直到广告关闭
      advertising.showAd(ad, displayOptions, context);
      // 注意：真机测试中发现 showAd 返回后 ad.rewarded/ad.shown 仍为 undefined，
      // 且 SDK 未暴露激励视频关闭/奖励回调。因此只要 showAd 正常返回（用户已走完广告流程），
      // 即视为获得奖励。生产环境建议接入服务端验证（rewardVerifyConfig）。
      callbacks.onReward?.();
      callbacks.onClose?.();
    } catch (e) {
      hilog.error(0x0000, TAG, 'showRewardAd exception %{public}s', JSON.stringify(e));
      callbacks.onError?.(-1, JSON.stringify(e));
    }
  }

  /**
   * 加载插屏广告。
   * 优先视频，视频加载失败时退回图片。
   * 返回 null 表示两种类型都加载失败。
   */
  static loadInterstitialAd(
    context: common.Context,
    videoId: string,
    imageId: string
  ): Promise<advertising.Advertisement | null> {
    return new Promise((resolve: (ad: advertising.Advertisement | null) => void) => {
      AdService.loadSingleAd(context, videoId, AD_TYPE_INTERSTITIAL)
        .then((videoAd: advertising.Advertisement | null) => {
          if (videoAd !== null) {
            resolve(videoAd);
            return;
          }
          hilog.info(0x0000, TAG, 'interstitial video id failed, fallback to image id');
          return AdService.loadSingleAd(context, imageId, AD_TYPE_INTERSTITIAL);
        })
        .then((imageAd: advertising.Advertisement | null | undefined) => {
          resolve(imageAd ?? null);
        })
        .catch((e: Error) => {
          hilog.error(0x0000, TAG, 'loadInterstitialAd exception %{public}s', e.message);
          resolve(null);
        });
    });
  }

  private static loadSingleAd(
    context: common.Context,
    adId: string,
    adType: number
  ): Promise<advertising.Advertisement | null> {
    const params: advertising.AdRequestParams = {
      adId: adId,
      adType: adType
      // 注：元服务不支持 OAID，不传 oaid 字段
    };
    const options: advertising.AdOptions = {
      allowMobileTraffic: 0,
      tagForChildProtection: -1,
      tagForUnderAgeOfPromise: -1,
      adContentClassification: 'A'
    };

    return new Promise((resolve: (ad: advertising.Advertisement | null) => void) => {
      try {
        const loader = new advertising.AdLoader(context);
        const listener: advertising.AdLoadListener = {
          onAdLoadSuccess: (ads: advertising.Advertisement[]) => {
            const ad = ads?.[0] ?? null;
            hilog.info(0x0000, TAG, 'interstitial ad loaded type=%{public}d ok=%{public}s', adType, ad !== null);
            resolve(ad);
          },
          onAdLoadFailure: (errorCode: number, errorMsg: string) => {
            hilog.error(0x0000, TAG, 'loadSingleAd type=%{public}d failed code=%{public}d msg=%{public}s', adType, errorCode, errorMsg);
            resolve(null);
          }
        };
        loader.loadAd(params, options, listener);
      } catch (e) {
        hilog.error(0x0000, TAG, 'loadSingleAd exception %{public}s', JSON.stringify(e));
        resolve(null);
      }
    });
  }

  /** 展示插屏广告 */
  static showInterstitialAd(
    context: common.UIAbilityContext,
    ad: advertising.Advertisement
  ): void {
    const displayOptions: advertising.AdDisplayOptions = {
      useMobileDataReminder: true
    };
    try {
      advertising.showAd(ad, displayOptions, context);
    } catch (e) {
      hilog.error(0x0000, TAG, 'showInterstitialAd exception %{public}s', JSON.stringify(e));
    }
  }
}
