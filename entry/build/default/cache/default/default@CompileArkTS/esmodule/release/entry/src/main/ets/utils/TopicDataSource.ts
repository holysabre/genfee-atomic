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
    getData(d9: number): ListRow {
        return this.rows[d9];
    }
    registerDataChangeListener(c9: DataChangeListener): void {
        if (this.listeners.indexOf(c9) < 0) {
            this.listeners.push(c9);
        }
    }
    unregisterDataChangeListener(a9: DataChangeListener): void {
        const b9 = this.listeners.indexOf(a9);
        if (b9 >= 0) {
            this.listeners.splice(b9, 1);
        }
    }
    replaceAll(z8: ListRow[]): void {
        this.rows = z8;
        this.notifyReload();
    }
    append(y8: ListRow[]): void {
        this.rows = this.rows.concat(y8);
        this.notifyReload();
    }
    isEmpty(): boolean {
        return this.rows.length === 0;
    }
    private notifyReload(): void {
        this.listeners.forEach((x8: DataChangeListener) => x8.onDataReloaded());
    }
}
