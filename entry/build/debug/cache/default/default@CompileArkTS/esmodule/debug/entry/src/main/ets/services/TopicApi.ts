import { HttpClient } from "@bundle:com.atomicservice.6917614059205018261/entry/ets/services/HttpClient";
import type { ApiResponse } from "@bundle:com.atomicservice.6917614059205018261/entry/ets/services/HttpClient";
export interface Topic {
    id: number;
    user_id?: number;
    category_name: string;
    salary?: string;
    content: string;
    company_name?: string;
    address?: string;
    mobile?: string | number;
    party?: number;
    created_at?: string;
}
/** 列表接口的 data 结构：{ data: Topic[], last_page }（对齐小程序端 res.data.data / res.data.last_page） */
export interface TopicListData {
    data: Topic[];
    last_page: number;
}
/** 详情接口的 data 结构：{ data: Topic } */
export interface TopicDetailData {
    data: Topic;
}
export class TopicApi {
    /** 帖子列表。party: 1=招工 2=找活；regionId: 0=全国（简化版固定）。参数均为数字，直接拼路径（绕开 ArkTS 对象字面量限制） */
    static list(page: number, party: number = 1, regionId: number = 0): Promise<ApiResponse<TopicListData>> {
        return HttpClient.get<TopicListData>(`/agent_topics?page=${page}&per_page=10&party=${party}&region_id=${regionId}`);
    }
    /** 帖子详情 */
    static detail(id: number): Promise<ApiResponse<TopicDetailData>> {
        return HttpClient.get<TopicDetailData>(`/agent_topics/${id}`);
    }
}
