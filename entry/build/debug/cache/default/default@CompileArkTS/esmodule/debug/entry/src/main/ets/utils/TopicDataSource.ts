import type advertising from "@ohos:advertising";
import type { Topic } from '../services/TopicApi';
/** 列表行：帖子 or 广告（ArkTS 兼容性考虑，kind 用数字而非联合字面量类型） */
export class ListRow {
    kind: number = 0; // 0=帖子 1=广告
    topic: Topic | null = null;
    ad: advertising.Advertisement | null = null;
}
/** LazyForEach 数据源（列表规模小，统一 onDataReloaded 全量刷新，简单可靠） */
export class TopicDataSource implements IDataSource {
    private rows: ListRow[] = [];
    private listeners: DataChangeListener[] = [];
    totalCount(): number {
        return this.rows.length;
    }
    getData(index: number): ListRow {
        return this.rows[index];
    }
    registerDataChangeListener(listener: DataChangeListener): void {
        if (this.listeners.indexOf(listener) < 0) {
            this.listeners.push(listener);
        }
    }
    unregisterDataChangeListener(listener: DataChangeListener): void {
        const idx = this.listeners.indexOf(listener);
        if (idx >= 0) {
            this.listeners.splice(idx, 1);
        }
    }
    replaceAll(rows: ListRow[]): void {
        this.rows = rows;
        this.notifyReload();
    }
    append(rows: ListRow[]): void {
        this.rows = this.rows.concat(rows);
        this.notifyReload();
    }
    isEmpty(): boolean {
        return this.rows.length === 0;
    }
    private notifyReload(): void {
        this.listeners.forEach((l: DataChangeListener) => l.onDataReloaded());
    }
}
