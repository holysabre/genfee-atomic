import preferences from "@ohos:data.preferences";
import type common from "@ohos:app.ability.common";
const STORE_NAME: string = 'worker_bee_store';
export class Store {
    private static prefs: preferences.Preferences | null = null;
    static init(e11: common.Context): void {
        Store.prefs = preferences.getPreferencesSync(e11, { name: STORE_NAME });
    }
    static getBool(c11: string, d11: boolean = false): boolean {
        if (!Store.prefs) {
            return d11;
        }
        return Store.prefs.getSync(c11, d11) as boolean;
    }
    static putBool(a11: string, b11: boolean): void {
        if (!Store.prefs) {
            return;
        }
        Store.prefs.putSync(a11, b11);
        Store.prefs.flush();
    }
    static getStr(y10: string, z10: string = ''): string {
        if (!Store.prefs) {
            return z10;
        }
        return Store.prefs.getSync(y10, z10) as string;
    }
    static putStr(w10: string, x10: string): void {
        if (!Store.prefs) {
            return;
        }
        Store.prefs.putSync(w10, x10);
        Store.prefs.flush();
    }
}
