import { advertising } from '@kit.AdsKit';
import { common } from '@kit.AbilityKit';
import { hilog } from '@kit.PerformanceAnalysisKit';

const TAG: string = 'WorkerBeeAd';

/**
 * 鲸鸿动能广告服务封装（Ads Kit）
 *
 * 元服务限制（编译器确认）：
 * - 不支持 identifier / getOAID → 无法获取 OAID，只能投放**非个性化广告**
 * - AdLoader.loadAd 仅支持三参回调形式（无 Promise 重载），此处封装为 Promise
 * - 模拟器不出广告，必须真机联调；请求广告前须先获得隐私协议同意（页面层控制）
 */
export class AdService {
  /** 加载原生广告（adType=3）。返回空数组表示无填充/失败，调用方静默隐藏广告位即可 */
  static loadNativeAds(context: common.Context, adId: string, count: number = 1): Promise<advertising.Advertisement[]> {
    const params: advertising.AdRequestParams = {
      adId: adId,
      adType: 3,
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
}
