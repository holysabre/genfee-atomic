if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface TopicCard_Params {
    topic?: Topic | null;
    onContact?: (mobile: string) => void;
}
import type { Topic } from '../services/TopicApi';
export class TopicCard extends ViewPU {
    constructor(p2, q2, r2, s2 = -1, t2 = undefined, u2) {
        super(p2, r2, s2, u2);
        if (typeof t2 === "function") {
            this.paramsGenerator_ = t2;
        }
        this.topic = null;
        this.onContact = () => { };
        this.setInitiallyProvidedValue(q2);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(o2: TopicCard_Params) {
        if (o2.topic !== undefined) {
            this.topic = o2.topic;
        }
        if (o2.onContact !== undefined) {
            this.onContact = o2.onContact;
        }
    }
    updateStateVars(n2: TopicCard_Params) {
    }
    purgeVariableDependenciesOnElmtId(m2) {
    }
    aboutToBeDeleted() {
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private topic: Topic | null;
    private onContact: (mobile: string) => void;
    initialRender() {
        this.observeComponentCreation2((k2, l2) => {
            Column.create();
            Column.width('100%');
            Column.padding(10);
            Column.margin({ bottom: 10 });
            Column.backgroundColor(Color.White);
            Column.borderRadius(8);
        }, Column);
        this.observeComponentCreation2((i2, j2) => {
            Row.create();
            Row.width('100%');
            Row.margin({ bottom: 8 });
        }, Row);
        this.observeComponentCreation2((g2, h2) => {
            Image.create({ "id": 16777228, "type": 20000, params: [], "bundleName": "com.atomicservice.6917612394359487010", "moduleName": "entry" });
            Image.width(25);
            Image.height(25);
            Image.margin({ right: 11 });
        }, Image);
        this.observeComponentCreation2((e2, f2) => {
            Text.create(this.topic?.category_name ?? '');
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#222222');
            Text.maxLines(1);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((c2, d2) => {
            Text.create(this.topic?.salary ?? '');
            Text.fontSize(12);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#FD7272');
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((a2, b2) => {
            Text.create(this.topic?.content ?? '');
            Text.fontSize(14);
            Text.fontColor('#222222');
            Text.lineHeight(19);
            Text.width('100%');
            Text.margin({ bottom: 10 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((y1, z1) => {
            Text.create(this.topic?.company_name ?? '');
            Text.fontSize(12);
            Text.fontColor('#4D222222');
            Text.width('100%');
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((w1, x1) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((u1, v1) => {
            Image.create({ "id": 16777223, "type": 20000, params: [], "bundleName": "com.atomicservice.6917612394359487010", "moduleName": "entry" });
            Image.width(16);
            Image.height(16);
            Image.margin({ right: 2 });
        }, Image);
        this.observeComponentCreation2((s1, t1) => {
            Text.create(this.topic?.address ?? '');
            Text.fontSize(12);
            Text.fontColor('#4D222222');
            Text.maxLines(1);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((p1, q1) => {
            Text.create('立刻联系');
            Text.fontSize(12);
            Text.fontColor('#FFC900');
            Text.textAlign(TextAlign.Center);
            Text.width(65);
            Text.height(25);
            Text.borderRadius(13);
            Text.border({ width: 1, color: '#FFE37B' });
            Text.onClick(() => {
                const r1 = this.topic?.mobile;
                if (r1 !== undefined && r1 !== null) {
                    this.onContact(String(r1));
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
