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
export interface TopicListData {
    data: Topic[];
    last_page: number;
}
export interface TopicDetailData {
    data: Topic;
}
export class TopicApi {
    static list(t8: number, u8: number = 1, v8: number = 0): Promise<ApiResponse<TopicListData>> {
        return HttpClient.get<TopicListData>(`/agent_topics?page=${t8}&per_page=10&party=${u8}&region_id=${v8}`);
    }
    static detail(s8: number): Promise<ApiResponse<TopicDetailData>> {
        return HttpClient.get<TopicDetailData>(`/agent_topics/${s8}`);
    }
}
