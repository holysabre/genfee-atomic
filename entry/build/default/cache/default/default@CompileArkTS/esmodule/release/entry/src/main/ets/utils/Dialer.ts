import call from "@ohos:telephony.call";
import pasteboard from "@ohos:pasteboard";
import type { UIContext } from "@ohos:arkui.UIContext";
import hilog from "@ohos:hilog";
export class Dialer {
    static dial(t10: UIContext, u10: string): void {
        try {
            call.makeCall(u10).then(() => {
                hilog.info(0x0000, 'WorkerBee', 'makeCall ok');
            }).catch(() => {
                Dialer.fallback(t10, u10);
            });
        }
        catch (v10) {
            Dialer.fallback(t10, u10);
        }
    }
    private static fallback(n10: UIContext, o10: string): void {
        const p10 = n10.getPromptAction();
        p10.showDialog({
            title: '联系电话',
            message: o10,
            buttons: [
                { text: '复制号码', color: '#FFC900' },
                { text: '取消', color: '#888888' }
            ]
        }).then((q10) => {
            if (q10.index === 0) {
                const r10 = pasteboard.getSystemPasteboard();
                const s10 = pasteboard.createData(pasteboard.MIMETYPE_TEXT_PLAIN, o10);
                r10.setDataSync(s10);
                p10.showToast({ message: '号码已复制' });
            }
        });
    }
}
