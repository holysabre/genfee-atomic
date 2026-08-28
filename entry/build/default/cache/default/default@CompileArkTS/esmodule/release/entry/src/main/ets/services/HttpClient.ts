import http from "@ohos:net.http";
import type { BusinessError } from "@ohos:base";
export interface ApiResponse<T> {
    code: number;
    msg?: string;
    data?: T;
}
export class HttpClient {
    private static readonly BASE_URL: string = 'https://api.ggfee.cn/mini';
    static async get<t12>(u12: string): Promise<ApiResponse<t12>> {
        const v12 = HttpClient.BASE_URL + u12;
        const w12 = http.createHttp();
        try {
            const z12 = await w12.request(v12, {
                method: http.RequestMethod.GET,
                header: { 'content-type': 'application/json' },
                connectTimeout: 10000,
                readTimeout: 10000
            });
            if (z12.responseCode === 200 && typeof z12.result === 'string') {
                return JSON.parse(z12.result) as ApiResponse<t12>;
            }
            return { code: z12.responseCode, msg: '网络异常' };
        }
        catch (x12) {
            const y12 = x12 as BusinessError;
            return { code: y12.code ?? -1, msg: y12.message ?? '请求失败' };
        }
        finally {
            w12.destroy();
        }
    }
}
