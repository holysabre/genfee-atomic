import { AbilityConstant, UIAbility, Want } from '@kit.AbilityKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
import { window } from '@kit.ArkUI';
import { Store } from '../utils/Store';

export default class EntryAbility extends UIAbility {
  onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): void {
    hilog.info(0x0000, 'WorkerBee', 'Ability onCreate');
    // 初始化本地存储（替代 uni.getStorageSync）
    Store.init(this.context);
  }

  onWindowStageCreate(windowStage: window.WindowStage): void {
    // 沉浸式：记录状态栏高度供页面避让（替代 uni.getSystemInfoSync 的 statusBarHeight）
    try {
      const win = windowStage.getMainWindowSync();
      const avoidArea = win.getWindowAvoidArea(window.AvoidAreaType.TYPE_SYSTEM);
      AppStorage.setOrCreate('statusBarHeight', px2vp(avoidArea.topRect.height));
      win.setWindowLayoutFullScreen(true);
    } catch (e) {
      hilog.error(0x0000, 'WorkerBee', 'immersive setup failed %{public}s', JSON.stringify(e));
    }

    windowStage.loadContent('pages/TopicListPage', (err) => {
      if (err.code) {
        hilog.error(0x0000, 'WorkerBee', 'loadContent failed %{public}s', JSON.stringify(err));
      }
    });
  }
}
