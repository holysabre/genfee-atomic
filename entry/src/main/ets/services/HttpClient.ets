import http from '@ohos.net.http';
import { BusinessError } from '@ohos.base';

/** 与小程序端 requestFun 对齐的响应包装：{ code, msg, data } */
export interface ApiResponse<T> {
  code: number;
  msg?: string;
  data?: T;
}

export class HttpClient {
  private static BASE_URL: string = 'https://api.ggfee.cn/mini';

  /** GET 请求。path 可自带查询串（调用方拼接，规避 ArkTS 对象字面量类型限制） */
  static async get<T>(path: string): Promise<ApiResponse<T>> {
    const url = HttpClient.BASE_URL + path;

    const req = http.createHttp();
    try {
      const res = await req.request(url, {
        method: http.RequestMethod.GET,
        header: { 'content-type': 'application/json' },
        connectTimeout: 10000,
        readTimeout: 10000
      });
      if (res.responseCode === 200 && typeof res.result === 'string') {
        return JSON.parse(res.result) as ApiResponse<T>;
      }
      return { code: res.responseCode, msg: '网络异常' };
    } catch (e) {
      const err = e as BusinessError;
      return { code: err.code ?? -1, msg: err.message ?? '请求失败' };
    } finally {
      req.destroy();
    }
  }
}
