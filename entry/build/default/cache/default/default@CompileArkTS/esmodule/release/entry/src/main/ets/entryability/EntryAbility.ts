import type AbilityConstant from "@ohos:app.ability.AbilityConstant";
import ConfigurationConstant from "@ohos:app.ability.ConfigurationConstant";
import UIAbility from "@ohos:app.ability.UIAbility";
import type Want from "@ohos:app.ability.Want";
import hilog from "@ohos:hilog";
import window from "@ohos:window";
import { Store } from "@bundle:com.atomicservice.6917614059205018261/entry/ets/utils/Store";
export default class EntryAbility extends UIAbility {
    onCreate(c3: Want, d3: AbilityConstant.LaunchParam): void {
        hilog.info(0x0000, 'WorkerBee', 'Ability onCreate');
        Store.init(this.context);
        try {
            this.context.getApplicationContext().setColorMode(ConfigurationConstant.ColorMode.COLOR_MODE_LIGHT);
        }
        catch (e3) {
            hilog.error(0x0000, 'WorkerBee', 'setColorMode failed %{public}s', JSON.stringify(e3));
        }
    }
    onWindowStageCreate(w2: window.WindowStage): void {
        try {
            const z2 = w2.getMainWindowSync();
            const a3 = z2.getWindowAvoidArea(window.AvoidAreaType.TYPE_SYSTEM);
            AppStorage.setOrCreate('statusBarHeight', px2vp(a3.topRect.height));
            const b3 = z2.getWindowAvoidArea(window.AvoidAreaType.TYPE_NAVIGATION_INDICATOR);
            AppStorage.setOrCreate('navBarHeight', px2vp(b3.bottomRect.height));
            z2.setWindowLayoutFullScreen(true);
        }
        catch (y2) {
            hilog.error(0x0000, 'WorkerBee', 'immersive setup failed %{public}s', JSON.stringify(y2));
        }
        w2.loadContent('pages/TopicListPage', (x2) => {
            if (x2.code) {
                hilog.error(0x0000, 'WorkerBee', 'loadContent failed %{public}s', JSON.stringify(x2));
            }
        });
    }
}
