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
    getData(c9: number): ListRow {
        return this.rows[c9];
    }
    registerDataChangeListener(b9: DataChangeListener): void {
        if (this.listeners.indexOf(b9) < 0) {
            this.listeners.push(b9);
        }
    }
    unregisterDataChangeListener(z8: DataChangeListener): void {
        const a9 = this.listeners.indexOf(z8);
        if (a9 >= 0) {
            this.listeners.splice(a9, 1);
        }
    }
    replaceAll(y8: ListRow[]): void {
        this.rows = y8;
        this.notifyReload();
    }
    append(x8: ListRow[]): void {
        this.rows = this.rows.concat(x8);
        this.notifyReload();
    }
    isEmpty(): boolean {
        return this.rows.length === 0;
    }
    private notifyReload(): void {
        this.listeners.forEach((w8: DataChangeListener) => w8.onDataReloaded());
    }
}
