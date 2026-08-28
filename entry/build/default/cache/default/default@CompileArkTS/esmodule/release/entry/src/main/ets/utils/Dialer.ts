import call from "@ohos:telephony.call";
import pasteboard from "@ohos:pasteboard";
import type { UIContext } from "@ohos:arkui.UIContext";
import hilog from "@ohos:hilog";
import { Colors } from "@bundle:com.atomicservice.6917614059205018261/entry/ets/constants/Colors";
export class Dialer {
    static dial(k13: UIContext, l13: string): void {
        try {
            call.makeCall(l13).then(() => {
                hilog.info(0x0000, 'WorkerBee', 'makeCall ok');
            }).catch(() => {
                Dialer.fallback(k13, l13);
            });
        }
        catch (m13) {
            Dialer.fallback(k13, l13);
        }
    }
    private static fallback(e13: UIContext, f13: string): void {
        const g13 = e13.getPromptAction();
        g13.showDialog({
            title: '联系电话',
            message: f13,
            buttons: [
                { text: '复制号码', color: Colors.PRIMARY_TEXT },
                { text: '取消', color: Colors.SECONDARY_TEXT }
            ]
        }).then((h13) => {
            if (h13.index === 0) {
                const i13 = pasteboard.getSystemPasteboard();
                const j13 = pasteboard.createData(pasteboard.MIMETYPE_TEXT_PLAIN, f13);
                i13.setDataSync(j13);
                g13.showToast({ message: '号码已复制' });
            }
        });
    }
}
