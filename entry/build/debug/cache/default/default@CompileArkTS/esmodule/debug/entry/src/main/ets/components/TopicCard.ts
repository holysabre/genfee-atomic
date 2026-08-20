if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface TopicCard_Params {
    topic?: Topic | null;
    onContact?: (mobile: string) => void;
}
import type { Topic } from '../services/TopicApi';
export class TopicCard extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.topic = null;
        this.onContact = () => { };
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: TopicCard_Params) {
        if (params.topic !== undefined) {
            this.topic = params.topic;
        }
        if (params.onContact !== undefined) {
            this.onContact = params.onContact;
        }
    }
    updateStateVars(params: TopicCard_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
    }
    aboutToBeDeleted() {
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private topic: Topic | null;
    private onContact: (mobile: string) => void;
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding(10);
            Column.margin({ bottom: 10 });
            Column.backgroundColor(Color.White);
            Column.borderRadius(8);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 顶部：图标 + 类别 + 薪资
            Row.create();
            // 顶部：图标 + 类别 + 薪资
            Row.width('100%');
            // 顶部：图标 + 类别 + 薪资
            Row.margin({ bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777229, "type": 20000, params: [], "bundleName": "com.atomicservice.6917614059205018261", "moduleName": "entry" });
            Image.width(25);
            Image.height(25);
            Image.margin({ right: 11 });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.topic?.category_name ?? '');
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#222222');
            Text.maxLines(1);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.topic?.salary ?? '');
            Text.fontSize(12);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#D62828');
        }, Text);
        Text.pop();
        // 顶部：图标 + 类别 + 薪资
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 内容
            Text.create(this.topic?.content ?? '');
            // 内容
            Text.fontSize(14);
            // 内容
            Text.fontColor('#222222');
            // 内容
            Text.lineHeight(19);
            // 内容
            Text.width('100%');
            // 内容
            Text.margin({ bottom: 10 });
        }, Text);
        // 内容
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 企业
            Text.create(this.topic?.company_name ?? '');
            // 企业
            Text.fontSize(12);
            // 企业
            Text.fontColor('#595959');
            // 企业
            Text.width('100%');
            // 企业
            Text.margin({ bottom: 8 });
        }, Text);
        // 企业
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 底部：地址 + 立刻联系
            Row.create();
            // 底部：地址 + 立刻联系
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777223, "type": 20000, params: [], "bundleName": "com.atomicservice.6917614059205018261", "moduleName": "entry" });
            Image.width(16);
            Image.height(16);
            Image.margin({ right: 2 });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.topic?.address ?? '');
            Text.fontSize(12);
            Text.fontColor('#595959');
            Text.maxLines(1);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('立刻联系');
            Text.fontSize(12);
            Text.fontColor('#A67C00');
            Text.textAlign(TextAlign.Center);
            Text.width(65);
            Text.height(25);
            Text.borderRadius(13);
            Text.border({ width: 1, color: '#A67C00' });
            Text.onClick(() => {
                const mobile = this.topic?.mobile;
                if (mobile !== undefined && mobile !== null) {
                    this.onContact(String(mobile));
                }
            });
        }, Text);
        Text.pop();
        // 底部：地址 + 立刻联系
        Row.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
