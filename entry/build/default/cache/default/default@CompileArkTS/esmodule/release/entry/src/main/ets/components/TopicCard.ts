if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface TopicCard_Params {
    topic?: Topic | null;
    onContact?: (mobile: string) => void;
}
import type { Topic } from '../services/TopicApi';
import { Colors } from "@bundle:com.atomicservice.6917614059205018261/entry/ets/constants/Colors";
export class TopicCard extends ViewPU {
    constructor(a1, b1, c1, d1 = -1, e1 = undefined, f1) {
        super(a1, c1, d1, f1);
        if (typeof e1 === "function") {
            this.paramsGenerator_ = e1;
        }
        this.topic = null;
        this.onContact = () => { };
        this.setInitiallyProvidedValue(b1);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(z: TopicCard_Params) {
        if (z.topic !== undefined) {
            this.topic = z.topic;
        }
        if (z.onContact !== undefined) {
            this.onContact = z.onContact;
        }
    }
    updateStateVars(y: TopicCard_Params) {
    }
    purgeVariableDependenciesOnElmtId(x) {
    }
    aboutToBeDeleted() {
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private topic: Topic | null;
    private onContact: (mobile: string) => void;
    initialRender() {
        this.observeComponentCreation2((v, w) => {
            Column.create();
            Column.width('100%');
            Column.padding(10);
            Column.margin({ bottom: 10 });
            Column.backgroundColor(Color.White);
            Column.borderRadius(8);
        }, Column);
        this.observeComponentCreation2((t, u) => {
            Row.create();
            Row.width('100%');
            Row.margin({ bottom: 8 });
        }, Row);
        this.observeComponentCreation2((r, s) => {
            Image.create({ "id": 16777229, "type": 20000, params: [], "bundleName": "com.atomicservice.6917614059205018261", "moduleName": "entry" });
            Image.width(25);
            Image.height(25);
            Image.margin({ right: 11 });
        }, Image);
        this.observeComponentCreation2((p, q) => {
            Text.create(this.topic?.category_name ?? '');
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Colors.BODY_TEXT);
            Text.maxLines(1);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((n, o) => {
            Text.create(this.topic?.salary ?? '');
            Text.fontSize(12);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Colors.SALARY_TEXT);
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((l, m) => {
            Text.create(this.topic?.content ?? '');
            Text.fontSize(14);
            Text.fontColor(Colors.BODY_TEXT);
            Text.lineHeight(19);
            Text.width('100%');
            Text.margin({ bottom: 10 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((j, k) => {
            Text.create(this.topic?.company_name ?? '');
            Text.fontSize(12);
            Text.fontColor(Colors.SECONDARY_TEXT);
            Text.width('100%');
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((h, i) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((f, g) => {
            Image.create({ "id": 16777223, "type": 20000, params: [], "bundleName": "com.atomicservice.6917614059205018261", "moduleName": "entry" });
            Image.width(16);
            Image.height(16);
            Image.margin({ right: 2 });
        }, Image);
        this.observeComponentCreation2((d, e) => {
            Text.create(this.topic?.address ?? '');
            Text.fontSize(12);
            Text.fontColor(Colors.SECONDARY_TEXT);
            Text.maxLines(1);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((a, b) => {
            Text.create('立刻联系');
            Text.fontSize(12);
            Text.fontColor(Colors.PRIMARY_TEXT);
            Text.textAlign(TextAlign.Center);
            Text.width(65);
            Text.height(25);
            Text.borderRadius(13);
            Text.border({ width: 1, color: Colors.PRIMARY_TEXT });
            Text.onClick(() => {
                const c = this.topic?.mobile;
                if (c !== undefined && c !== null) {
                    this.onContact(String(c));
                }
            });
        }, Text);
        Text.pop();
        Row.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
