import { ApiResponse, HttpClient } from './HttpClient';

/** /settings/global 接口返回的 data.data 结构 */
export interface GlobalSettings {
  jhdn_ad_enable?: string | null;
  jhdn_ad_test?: string | null;
  jhdn_ad_native?: string | null;
  jhdn_ad_banner?: string | null;
  jhdn_ad_reward?: string | null;
  jhdn_ad_interstitial_video?: string | null;
  jhdn_ad_interstitial_image?: string | null;
}

/** /settings/global 外层 data：{ data: GlobalSettings, total: number } */
export interface GlobalSettingsData {
  data: GlobalSettings;
  total: number;
}

export class SettingsApi {
  /** 全局配置接口 */
  static global(): Promise<ApiResponse<GlobalSettingsData>> {
    return HttpClient.get<GlobalSettingsData>('/settings/global');
  }
}
