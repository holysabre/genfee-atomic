import { HttpClient } from "@bundle:com.atomicservice.6917612394359487010/entry/ets/services/HttpClient";
import type { ApiResponse } from "@bundle:com.atomicservice.6917612394359487010/entry/ets/services/HttpClient";
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
    static list(k10: number, l10: number = 1, m10: number = 0): Promise<ApiResponse<TopicListData>> {
        return HttpClient.get<TopicListData>(`/agent_topics?page=${k10}&per_page=10&party=${l10}&region_id=${m10}`);
    }
    static detail(j10: number): Promise<ApiResponse<TopicDetailData>> {
        return HttpClient.get<TopicDetailData>(`/agent_topics/${j10}`);
    }
}
