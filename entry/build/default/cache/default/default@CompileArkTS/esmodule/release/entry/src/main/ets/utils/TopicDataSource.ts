import type advertising from "@ohos:advertising";
import type { Topic } from '../services/TopicApi';
export class ListRow {
    kind: number = 0;
    topic: Topic | null = null;
    ad: advertising.Advertisement | null = null;
}
export class TopicDataSource implements IDataSource {
    private rows: ListRow[] = [];
    private listeners: DataChangeListener[] = [];
    totalCount(): number {
        return this.rows.length;
    }
    getData(l11: number): ListRow {
        return this.rows[l11];
    }
    registerDataChangeListener(k11: DataChangeListener): void {
        if (this.listeners.indexOf(k11) < 0) {
            this.listeners.push(k11);
        }
    }
    unregisterDataChangeListener(i11: DataChangeListener): void {
        const j11 = this.listeners.indexOf(i11);
        if (j11 >= 0) {
            this.listeners.splice(j11, 1);
        }
    }
    replaceAll(h11: ListRow[]): void {
        this.rows = h11;
        this.notifyReload();
    }
    append(g11: ListRow[]): void {
        this.rows = this.rows.concat(g11);
        this.notifyReload();
    }
    isEmpty(): boolean {
        return this.rows.length === 0;
    }
    private notifyReload(): void {
        this.listeners.forEach((f11: DataChangeListener) => f11.onDataReloaded());
    }
}
