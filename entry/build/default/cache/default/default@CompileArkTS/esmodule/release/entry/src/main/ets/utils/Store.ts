import preferences from "@ohos:data.preferences";
import type common from "@ohos:app.ability.common";
const STORE_NAME: string = 'worker_bee_store';
export class Store {
    private static prefs: preferences.Preferences | null = null;
    static init(u13: common.Context): void {
        Store.prefs = preferences.getPreferencesSync(u13, { name: STORE_NAME });
    }
    static getBool(s13: string, t13: boolean = false): boolean {
        if (!Store.prefs) {
            return t13;
        }
        return Store.prefs.getSync(s13, t13) as boolean;
    }
    static putBool(q13: string, r13: boolean): void {
        if (!Store.prefs) {
            return;
        }
        Store.prefs.putSync(q13, r13);
        Store.prefs.flush();
    }
    static getStr(o13: string, p13: string = ''): string {
        if (!Store.prefs) {
            return p13;
        }
        return Store.prefs.getSync(o13, p13) as string;
    }
    static putStr(m13: string, n13: string): void {
        if (!Store.prefs) {
            return;
        }
        Store.prefs.putSync(m13, n13);
        Store.prefs.flush();
    }
}
