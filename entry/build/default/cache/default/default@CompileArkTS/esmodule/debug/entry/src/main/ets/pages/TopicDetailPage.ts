if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface TopicDetailPage_Params {
    info?: Topic | null;
    tags?: string[];
    statusBarHeight?: number;
}
import router from "@ohos:router";
import { TopicApi } from "@bundle:com.atomicservice.6917612394359487010/entry/ets/services/TopicApi";
import type { Topic } from "@bundle:com.atomicservice.6917612394359487010/entry/ets/services/TopicApi";
import { Dialer } from "@bundle:com.atomicservice.6917612394359487010/entry/ets/utils/Dialer";
import { BannerAdView } from "@bundle:com.atomicservice.6917612394359487010/entry/ets/components/BannerAdView";
import { AdIds } from "@bundle:com.atomicservice.6917612394359487010/entry/ets/constants/AdIds";
class TopicDetailPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__info = new ObservedPropertyObjectPU(null, this, "info");
        this.__tags = new ObservedPropertyObjectPU([], this, "tags");
        this.__statusBarHeight = new ObservedPropertySimplePU(0, this, "statusBarHeight");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: TopicDetailPage_Params) {
        if (params.info !== undefined) {
            this.info = params.info;
        }
        if (params.tags !== undefined) {
            this.tags = params.tags;
        }
        if (params.statusBarHeight !== undefined) {
            this.statusBarHeight = params.statusBarHeight;
        }
    }
    updateStateVars(params: TopicDetailPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__info.purgeDependencyOnElmtId(rmElmtId);
        this.__tags.purgeDependencyOnElmtId(rmElmtId);
        this.__statusBarHeight.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__info.aboutToBeDeleted();
        this.__tags.aboutToBeDeleted();
        this.__statusBarHeight.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __info: ObservedPropertyObjectPU<Topic | null>;
    get info() {
        return this.__info.get();
    }
    set info(newValue: Topic | null) {
        this.__info.set(newValue);
    }
    private __tags: ObservedPropertyObjectPU<string[]>;
    get tags() {
        return this.__tags.get();
    }
    set tags(newValue: string[]) {
        this.__tags.set(newValue);
    }
    private __statusBarHeight: ObservedPropertySimplePU<number>;
    get statusBarHeight() {
        return this.__statusBarHeight.get();
    }
    set statusBarHeight(newValue: number) {
        this.__statusBarHeight.set(newValue);
    }
    aboutToAppear(): void {
        this.statusBarHeight = (AppStorage.get<number>('statusBarHeight') ?? 0);
        const params = router.getParams() as Record<string, number> | undefined;
        const id = params?.id ?? 0;
        if (id > 0) {
            this.loadDetail(id);
        }
    }
    private async loadDetail(id: number): Promise<void> {
        const res = await TopicApi.detail(id);
        if (res.code === 200 && res.data?.data) {
            this.info = res.data.data;
            this.tags = (this.info.category_name ?? '').split('、').filter((s: string) => s.length > 0);
        }
        else {
            this.getUIContext().getPromptAction().showToast({ message: res.msg ?? '加载失败' });
        }
    }
    labelRow(label: string, value: string, valueColor: string, bold: boolean, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.justifyContent(FlexAlign.SpaceBetween);
            Row.margin({ bottom: 10 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(label);
            Text.fontSize(14);
            Text.fontColor('#80222222');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(value);
            Text.fontSize(14);
            Text.fontColor(valueColor);
            Text.fontWeight(bold ? FontWeight.Bold : FontWeight.Regular);
        }, Text);
        Text.pop();
        Row.pop();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create({ alignContent: Alignment.Bottom });
            Stack.width('100%');
            Stack.height('100%');
            Stack.backgroundColor(Color.White);
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 内容区
            Scroll.create();
            // 内容区
            Scroll.width('100%');
            // 内容区
            Scroll.height('100%');
            // 内容区
            Scroll.padding({ top: this.statusBarHeight });
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding({ left: 16, right: 16, top: 14, bottom: 150 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 需求职业标签
            Row.create();
            // 需求职业标签
            Row.width('100%');
            // 需求职业标签
            Row.alignItems(VerticalAlign.Top);
            // 需求职业标签
            Row.margin({ bottom: 10 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('需求职业：');
            Text.fontSize(14);
            Text.fontColor('#80222222');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Flex.create({ wrap: FlexWrap.Wrap });
            Flex.layoutWeight(1);
        }, Flex);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const tag = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(tag);
                    Text.fontSize(13);
                    Text.fontColor('#FAC23C');
                    Text.height(20);
                    Text.padding({ left: 12, right: 12 });
                    Text.borderRadius(13);
                    Text.border({ width: 1, color: '#FAC23C' });
                    Text.margin({ right: 10, bottom: 10 });
                }, Text);
                Text.pop();
            };
            this.forEachUpdateFunction(elmtId, this.tags, forEachItemGenFunction);
        }, ForEach);
        ForEach.pop();
        Flex.pop();
        // 需求职业标签
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 要求 + 发布时间 + 内容 + 地址
            Column.create();
            // 要求 + 发布时间 + 内容 + 地址
            Column.width('100%');
            // 要求 + 发布时间 + 内容 + 地址
            Column.margin({ bottom: 10 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.justifyContent(FlexAlign.SpaceBetween);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('要求：');
            Text.fontSize(14);
            Text.fontColor('#80222222');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`发布时间：${this.info?.created_at ?? '暂无'}`);
            Text.fontSize(12);
            Text.fontColor('#80222222');
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.info?.content ?? '');
            Text.fontSize(14);
            Text.fontColor('#222222');
            Text.lineHeight(24);
            Text.width('100%');
            Text.margin({ top: 8, bottom: 10 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777224, "type": 20000, params: [], "bundleName": "com.atomicservice.6917612394359487010", "moduleName": "entry" });
            Image.width(12);
            Image.height(12);
            Image.margin({ right: 4 });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.info?.address ?? '');
            Text.fontSize(14);
            Text.fontColor('#80222222');
        }, Text);
        Text.pop();
        Row.pop();
        // 要求 + 发布时间 + 内容 + 地址
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // party != 2（招工）才展示薪酬/企业/收费说明
            if ((this.info?.party ?? 1) !== 2) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.labelRow.bind(this)('薪酬范围：', this.info?.salary ?? '暂无', '#FFC900', true);
                    this.labelRow.bind(this)('企业单位：', this.info?.company_name ?? '暂无', '#222222', false);
                    this.labelRow.bind(this)('岗位收费要求：', '该岗位招聘不涉及收费', '#222222', false);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Column.pop();
        // 内容区
        Scroll.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 底部固定操作区（温馨提示 + Banner 广告 + 免费联系）
            Column.create();
            // 底部固定操作区（温馨提示 + Banner 广告 + 免费联系）
            Column.width('100%');
            // 底部固定操作区（温馨提示 + Banner 广告 + 免费联系）
            Column.padding({ left: 17, right: 17, top: 10, bottom: 15 });
            // 底部固定操作区（温馨提示 + Banner 广告 + 免费联系）
            Column.backgroundColor(Color.White);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.margin({ bottom: 3 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777229, "type": 20000, params: [], "bundleName": "com.atomicservice.6917612394359487010", "moduleName": "entry" });
            Image.width(24);
            Image.height(24);
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('温馨提示');
            Text.fontSize(12);
            Text.fontColor('#FDD000');
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('联系之前请您注意辨别信息真伪，核实岗位实情及实际情况，谨防上当受骗。平台不参与招聘事宜，相关招聘及履约问题由招聘双方确认并担责。');
            Text.fontSize(10);
            Text.fontColor('#666666');
            Text.width('100%');
            Text.margin({ bottom: 10 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (AdIds.AD_ENABLED) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        __Common__.create();
                        __Common__.margin({ bottom: 8 });
                    }, __Common__);
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new BannerAdView(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/TopicDetailPage.ets", line: 145, col: 11 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {};
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                        }, { name: "BannerAdView" });
                    }
                    __Common__.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('免费联系');
            Text.fontSize(15);
            Text.fontColor('#000000');
            Text.textAlign(TextAlign.Center);
            Text.width('100%');
            Text.height(44);
            Text.backgroundColor('#FDD000');
            Text.borderRadius(8);
            Text.onClick(() => {
                const mobile = this.info?.mobile;
                if (mobile !== undefined && mobile !== null) {
                    Dialer.dial(this.getUIContext(), String(mobile));
                }
            });
        }, Text);
        Text.pop();
        // 底部固定操作区（温馨提示 + Banner 广告 + 免费联系）
        Column.pop();
        Stack.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "TopicDetailPage";
    }
}
registerNamedRoute(() => new TopicDetailPage(undefined, {}), "", { bundleName: "com.atomicservice.6917612394359487010", moduleName: "entry", pagePath: "pages/TopicDetailPage", pageFullPath: "entry/src/main/ets/pages/TopicDetailPage", integratedHsp: "false", moduleType: "followWithHap" });
