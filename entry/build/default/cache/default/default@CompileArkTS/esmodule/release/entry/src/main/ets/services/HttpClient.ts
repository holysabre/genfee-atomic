import http from "@ohos:net.http";
import type { BusinessError } from "@ohos:base";
export interface ApiResponse<T> {
    code: number;
    msg?: string;
    data?: T;
}
export class HttpClient {
    private static readonly BASE_URL: string = 'https://api.ggfee.cn/mini';
    static async get<s12>(t12: string): Promise<ApiResponse<s12>> {
        const u12 = HttpClient.BASE_URL + t12;
        const v12 = http.createHttp();
        try {
            const y12 = await v12.request(u12, {
                method: http.RequestMethod.GET,
                header: { 'content-type': 'application/json' },
                connectTimeout: 10000,
                readTimeout: 10000
            });
            if (y12.responseCode === 200 && typeof y12.result === 'string') {
                return JSON.parse(y12.result) as ApiResponse<s12>;
            }
            return { code: y12.responseCode, msg: '网络异常' };
        }
        catch (w12) {
            const x12 = w12 as BusinessError;
            return { code: x12.code ?? -1, msg: x12.message ?? '请求失败' };
        }
        finally {
            v12.destroy();
        }
    }
}
