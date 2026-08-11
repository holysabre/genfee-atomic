import type AbilityConstant from "@ohos:app.ability.AbilityConstant";
import UIAbility from "@ohos:app.ability.UIAbility";
import type Want from "@ohos:app.ability.Want";
import hilog from "@ohos:hilog";
import window from "@ohos:window";
import { Store } from "@bundle:com.atomicservice.6917612394359487010/entry/ets/utils/Store";
export default class EntryAbility extends UIAbility {
    onCreate(a3: Want, b3: AbilityConstant.LaunchParam): void {
        hilog.info(0x0000, 'WorkerBee', 'Ability onCreate');
        Store.init(this.context);
    }
    onWindowStageCreate(v2: window.WindowStage): void {
        try {
            const y2 = v2.getMainWindowSync();
            const z2 = y2.getWindowAvoidArea(window.AvoidAreaType.TYPE_SYSTEM);
            AppStorage.setOrCreate('statusBarHeight', px2vp(z2.topRect.height));
            y2.setWindowLayoutFullScreen(true);
        }
        catch (x2) {
            hilog.error(0x0000, 'WorkerBee', 'immersive setup failed %{public}s', JSON.stringify(x2));
        }
        v2.loadContent('pages/TopicListPage', (w2) => {
            if (w2.code) {
                hilog.error(0x0000, 'WorkerBee', 'loadContent failed %{public}s', JSON.stringify(w2));
            }
        });
    }
}
