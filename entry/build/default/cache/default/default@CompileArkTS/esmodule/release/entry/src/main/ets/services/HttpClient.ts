import http from "@ohos:net.http";
import type { BusinessError } from "@ohos:base";
export interface ApiResponse<T> {
    code: number;
    msg?: string;
    data?: T;
}
export class HttpClient {
    private static readonly BASE_URL: string = 'https://api.ggfee.cn/mini';
    static async get<c10>(d10: string): Promise<ApiResponse<c10>> {
        const e10 = HttpClient.BASE_URL + d10;
        const f10 = http.createHttp();
        try {
            const i10 = await f10.request(e10, {
                method: http.RequestMethod.GET,
                header: { 'content-type': 'application/json' },
                connectTimeout: 10000,
                readTimeout: 10000
            });
            if (i10.responseCode === 200 && typeof i10.result === 'string') {
                return JSON.parse(i10.result) as ApiResponse<c10>;
            }
            return { code: i10.responseCode, msg: '网络异常' };
        }
        catch (g10) {
            const h10 = g10 as BusinessError;
            return { code: h10.code ?? -1, msg: h10.message ?? '请求失败' };
        }
        finally {
            f10.destroy();
        }
    }
}
