import { preferences } from '@kit.ArkData';
import { common } from '@kit.AbilityKit';

const STORE_NAME: string = 'worker_bee_store';

/** 轻量本地存储（替代 uni.getStorageSync/setStorageSync） */
export class Store {
  private static prefs: preferences.Preferences | null = null;

  static init(context: common.Context): void {
    Store.prefs = preferences.getPreferencesSync(context, { name: STORE_NAME });
  }

  static getBool(key: string, def: boolean = false): boolean {
    if (!Store.prefs) {
      return def;
    }
    return Store.prefs.getSync(key, def) as boolean;
  }

  static putBool(key: string, val: boolean): void {
    if (!Store.prefs) {
      return;
    }
    Store.prefs.putSync(key, val);
    Store.prefs.flush();
  }

  static getStr(key: string, def: string = ''): string {
    if (!Store.prefs) {
      return def;
    }
    return Store.prefs.getSync(key, def) as string;
  }

  static putStr(key: string, val: string): void {
    if (!Store.prefs) {
      return;
    }
    Store.prefs.putSync(key, val);
    Store.prefs.flush();
  }
}
