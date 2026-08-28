import preferences from "@ohos:data.preferences";
import type common from "@ohos:app.ability.common";
const STORE_NAME: string = 'worker_bee_store';
export class Store {
    private static prefs: preferences.Preferences | null = null;
    static init(v13: common.Context): void {
        Store.prefs = preferences.getPreferencesSync(v13, { name: STORE_NAME });
    }
    static getBool(t13: string, u13: boolean = false): boolean {
        if (!Store.prefs) {
            return u13;
        }
        return Store.prefs.getSync(t13, u13) as boolean;
    }
    static putBool(r13: string, s13: boolean): void {
        if (!Store.prefs) {
            return;
        }
        Store.prefs.putSync(r13, s13);
        Store.prefs.flush();
    }
    static getStr(p13: string, q13: string = ''): string {
        if (!Store.prefs) {
            return q13;
        }
        return Store.prefs.getSync(p13, q13) as string;
    }
    static putStr(n13: string, o13: string): void {
        if (!Store.prefs) {
            return;
        }
        Store.prefs.putSync(n13, o13);
        Store.prefs.flush();
    }
}
