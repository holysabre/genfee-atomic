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
    static list(u8: number, v8: number = 1, w8: number = 0): Promise<ApiResponse<TopicListData>> {
        return HttpClient.get<TopicListData>(`/agent_topics?page=${u8}&per_page=10&party=${v8}&region_id=${w8}`);
    }
    static detail(t8: number): Promise<ApiResponse<TopicDetailData>> {
        return HttpClient.get<TopicDetailData>(`/agent_topics/${t8}`);
    }
}
