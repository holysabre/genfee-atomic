import call from "@ohos:telephony.call";
import pasteboard from "@ohos:pasteboard";
import type { UIContext } from "@ohos:arkui.UIContext";
import hilog from "@ohos:hilog";
/**
 * 拨号（对齐 uni-app 版 dialMobile 策略）：
 * 优先 call.makeCall 直接拉起拨号盘；
 * ⚠️ 实测项：三方元服务可能被限制 PLACE_CALL 能力 —— 失败/抛异常时降级为"弹窗展示号码 + 复制到剪贴板"。
 */
export class Dialer {
    static dial(ui: UIContext, mobile: string): void {
        try {
            call.makeCall(mobile).then(() => {
                hilog.info(0x0000, 'WorkerBee', 'makeCall ok');
            }).catch(() => {
                Dialer.fallback(ui, mobile);
            });
        }
        catch (e) {
            Dialer.fallback(ui, mobile);
        }
    }
    private static fallback(ui: UIContext, mobile: string): void {
        const prompt = ui.getPromptAction();
        prompt.showDialog({
            title: '联系电话',
            message: mobile,
            buttons: [
                { text: '复制号码', color: '#FFC900' },
                { text: '取消', color: '#888888' }
            ]
        }).then((result) => {
            if (result.index === 0) {
                const board = pasteboard.getSystemPasteboard();
                const data = pasteboard.createData(pasteboard.MIMETYPE_TEXT_PLAIN, mobile);
                board.setDataSync(data);
                prompt.showToast({ message: '号码已复制' });
            }
        });
    }
}
