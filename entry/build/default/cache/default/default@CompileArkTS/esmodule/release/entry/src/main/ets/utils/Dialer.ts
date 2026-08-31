import call from "@ohos:telephony.call";
import pasteboard from "@ohos:pasteboard";
import type { UIContext } from "@ohos:arkui.UIContext";
import hilog from "@ohos:hilog";
import { Colors } from "@bundle:com.atomicservice.6917614059205018261/entry/ets/constants/Colors";
export class Dialer {
    static dial(j13: UIContext, k13: string): void {
        try {
            call.makeCall(k13).then(() => {
                hilog.info(0x0000, 'WorkerBee', 'makeCall ok');
            }).catch(() => {
                Dialer.fallback(j13, k13);
            });
        }
        catch (l13) {
            Dialer.fallback(j13, k13);
        }
    }
    private static fallback(d13: UIContext, e13: string): void {
        const f13 = d13.getPromptAction();
        f13.showDialog({
            title: '联系电话',
            message: e13,
            buttons: [
                { text: '复制号码', color: Colors.PRIMARY_TEXT },
                { text: '取消', color: Colors.SECONDARY_TEXT }
            ]
        }).then((g13) => {
            if (g13.index === 0) {
                const h13 = pasteboard.getSystemPasteboard();
                const i13 = pasteboard.createData(pasteboard.MIMETYPE_TEXT_PLAIN, e13);
                h13.setDataSync(i13);
                f13.showToast({ message: '号码已复制' });
            }
        });
    }
}
