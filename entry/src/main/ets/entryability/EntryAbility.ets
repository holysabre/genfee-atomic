import AbilityConstant from '@ohos.app.ability.AbilityConstant';
import UIAbility from '@ohos.app.ability.UIAbility';
import Want from '@ohos.app.ability.Want';
import hilog from '@ohos.hilog';
import window from '@ohos.window';
import { Store } from '../utils/Store';

export default class EntryAbility extends UIAbility {
  onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): void {
    hilog.info(0x0000, 'WorkerBee', 'Ability onCreate');
    // 初始化本地存储（替代 uni.getStorageSync）
    Store.init(this.context);
  }

  onWindowStageCreate(windowStage: window.WindowStage): void {
    // 沉浸式：记录状态栏 + 底部导航条避让高度供页面使用（替代 uni.getSystemInfoSync）
    windowStage.getMainWindow((err, win) => {
      if (err) {
        hilog.error(0x0000, 'WorkerBee', 'getMainWindow failed %{public}s', JSON.stringify(err));
        return;
      }
      try {
        const systemArea = win.getWindowAvoidArea(window.AvoidAreaType.TYPE_SYSTEM);
        AppStorage.setOrCreate('statusBarHeight', px2vp(systemArea.topRect.height));
        // 审核整改：底部手势导航条避让（手机/折叠屏/平板均有导航条）
        const navArea = win.getWindowAvoidArea(window.AvoidAreaType.TYPE_NAVIGATION_INDICATOR);
        AppStorage.setOrCreate('navBarHeight', px2vp(navArea.bottomRect.height));
        win.setWindowLayoutFullScreen(true);
      } catch (e) {
        hilog.error(0x0000, 'WorkerBee', 'immersive setup failed %{public}s', JSON.stringify(e));
      }
    });

    windowStage.loadContent('pages/TopicListPage', (err) => {
      if (err && err.code) {
        hilog.error(0x0000, 'WorkerBee', 'loadContent failed %{public}s', JSON.stringify(err));
      }
    });
  }
}
