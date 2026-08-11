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
    constructor(e6, f6, g6, h6 = -1, i6 = undefined, j6) {
        super(e6, g6, h6, j6);
        if (typeof i6 === "function") {
            this.paramsGenerator_ = i6;
        }
        this.__info = new ObservedPropertyObjectPU(null, this, "info");
        this.__tags = new ObservedPropertyObjectPU([], this, "tags");
        this.__statusBarHeight = new ObservedPropertySimplePU(0, this, "statusBarHeight");
        this.setInitiallyProvidedValue(f6);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(d6: TopicDetailPage_Params) {
        if (d6.info !== undefined) {
            this.info = d6.info;
        }
        if (d6.tags !== undefined) {
            this.tags = d6.tags;
        }
        if (d6.statusBarHeight !== undefined) {
            this.statusBarHeight = d6.statusBarHeight;
        }
    }
    updateStateVars(c6: TopicDetailPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(b6) {
        this.__info.purgeDependencyOnElmtId(b6);
        this.__tags.purgeDependencyOnElmtId(b6);
        this.__statusBarHeight.purgeDependencyOnElmtId(b6);
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
    set info(a6: Topic | null) {
        this.__info.set(a6);
    }
    private __tags: ObservedPropertyObjectPU<string[]>;
    get tags() {
        return this.__tags.get();
    }
    set tags(z5: string[]) {
        this.__tags.set(z5);
    }
    private __statusBarHeight: ObservedPropertySimplePU<number>;
    get statusBarHeight() {
        return this.__statusBarHeight.get();
    }
    set statusBarHeight(y5: number) {
        this.__statusBarHeight.set(y5);
    }
    aboutToAppear(): void {
        this.statusBarHeight = (AppStorage.get<number>('statusBarHeight') ?? 0);
        const w5 = router.getParams() as Record<string, number> | undefined;
        const x5 = w5?.id ?? 0;
        if (x5 > 0) {
            this.loadDetail(x5);
        }
    }
    private async loadDetail(t5: number): Promise<void> {
        const u5 = await TopicApi.detail(t5);
        if (u5.code === 200 && u5.data?.data) {
            this.info = u5.data.data;
            this.tags = (this.info.category_name ?? '').split('、').filter((v5: string) => v5.length > 0);
        }
        else {
            this.getUIContext().getPromptAction().showToast({ message: u5.msg ?? '加载失败' });
        }
    }
    labelRow(i5: string, j5: string, k5: string, l5: boolean, m5 = null) {
        this.observeComponentCreation2((r5, s5) => {
            Row.create();
            Row.width('100%');
            Row.justifyContent(FlexAlign.SpaceBetween);
            Row.margin({ bottom: 10 });
        }, Row);
        this.observeComponentCreation2((p5, q5) => {
            Text.create(i5);
            Text.fontSize(14);
            Text.fontColor('#80222222');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((n5, o5) => {
            Text.create(j5);
            Text.fontSize(14);
            Text.fontColor(k5);
            Text.fontWeight(l5 ? FontWeight.Bold : FontWeight.Regular);
        }, Text);
        Text.pop();
        Row.pop();
    }
    initialRender() {
        this.observeComponentCreation2((g5, h5) => {
            Stack.create({ alignContent: Alignment.Bottom });
            Stack.width('100%');
            Stack.height('100%');
            Stack.backgroundColor(Color.White);
        }, Stack);
        this.observeComponentCreation2((e5, f5) => {
            Scroll.create();
            Scroll.width('100%');
            Scroll.height('100%');
            Scroll.padding({ top: this.statusBarHeight });
        }, Scroll);
        this.observeComponentCreation2((c5, d5) => {
            Column.create();
            Column.width('100%');
            Column.padding({ left: 16, right: 16, top: 14, bottom: 150 });
        }, Column);
        this.observeComponentCreation2((a5, b5) => {
            Row.create();
            Row.width('100%');
            Row.alignItems(VerticalAlign.Top);
            Row.margin({ bottom: 10 });
        }, Row);
        this.observeComponentCreation2((y4, z4) => {
            Text.create('需求职业：');
            Text.fontSize(14);
            Text.fontColor('#80222222');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((w4, x4) => {
            Flex.create({ wrap: FlexWrap.Wrap });
            Flex.layoutWeight(1);
        }, Flex);
        this.observeComponentCreation2((p4, q4) => {
            ForEach.create();
            const r4 = s4 => {
                const t4 = s4;
                this.observeComponentCreation2((u4, v4) => {
                    Text.create(t4);
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
            this.forEachUpdateFunction(p4, this.tags, r4);
        }, ForEach);
        ForEach.pop();
        Flex.pop();
        Row.pop();
        this.observeComponentCreation2((n4, o4) => {
            Column.create();
            Column.width('100%');
            Column.margin({ bottom: 10 });
        }, Column);
        this.observeComponentCreation2((l4, m4) => {
            Row.create();
            Row.width('100%');
            Row.justifyContent(FlexAlign.SpaceBetween);
        }, Row);
        this.observeComponentCreation2((j4, k4) => {
            Text.create('要求：');
            Text.fontSize(14);
            Text.fontColor('#80222222');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((h4, i4) => {
            Text.create(`发布时间：${this.info?.created_at ?? '暂无'}`);
            Text.fontSize(12);
            Text.fontColor('#80222222');
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((f4, g4) => {
            Text.create(this.info?.content ?? '');
            Text.fontSize(14);
            Text.fontColor('#222222');
            Text.lineHeight(24);
            Text.width('100%');
            Text.margin({ top: 8, bottom: 10 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((d4, e4) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((b4, c4) => {
            Image.create({ "id": 16777224, "type": 20000, params: [], "bundleName": "com.atomicservice.6917612394359487010", "moduleName": "entry" });
            Image.width(12);
            Image.height(12);
            Image.margin({ right: 4 });
        }, Image);
        this.observeComponentCreation2((z3, a4) => {
            Text.create(this.info?.address ?? '');
            Text.fontSize(14);
            Text.fontColor('#80222222');
        }, Text);
        Text.pop();
        Row.pop();
        Column.pop();
        this.observeComponentCreation2((x3, y3) => {
            If.create();
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
        Scroll.pop();
        this.observeComponentCreation2((v3, w3) => {
            Column.create();
            Column.width('100%');
            Column.padding({ left: 17, right: 17, top: 10, bottom: 15 });
            Column.backgroundColor(Color.White);
        }, Column);
        this.observeComponentCreation2((t3, u3) => {
            Row.create();
            Row.margin({ bottom: 3 });
        }, Row);
        this.observeComponentCreation2((r3, s3) => {
            Image.create({ "id": 16777229, "type": 20000, params: [], "bundleName": "com.atomicservice.6917612394359487010", "moduleName": "entry" });
            Image.width(24);
            Image.height(24);
        }, Image);
        this.observeComponentCreation2((p3, q3) => {
            Text.create('温馨提示');
            Text.fontSize(12);
            Text.fontColor('#FDD000');
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((n3, o3) => {
            Text.create('联系之前请您注意辨别信息真伪，核实岗位实情及实际情况，谨防上当受骗。平台不参与招聘事宜，相关招聘及履约问题由招聘双方确认并担责。');
            Text.fontSize(10);
            Text.fontColor('#666666');
            Text.width('100%');
            Text.margin({ bottom: 10 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((f3, g3) => {
            If.create();
            if (AdIds.AD_ENABLED) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((l3, m3) => {
                        __Common__.create();
                        __Common__.margin({ bottom: 8 });
                    }, __Common__);
                    {
                        this.observeComponentCreation2((h3, i3) => {
                            if (i3) {
                                let j3 = new BannerAdView(this, {}, undefined, h3, () => { }, { page: "entry/src/main/ets/pages/TopicDetailPage.ets", line: 145, col: 11 });
                                ViewPU.create(j3);
                                let k3 = () => {
                                    return {};
                                };
                                j3.paramsGenerator_ = k3;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(h3, {});
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
        this.observeComponentCreation2((c3, d3) => {
            Text.create('免费联系');
            Text.fontSize(15);
            Text.fontColor('#000000');
            Text.textAlign(TextAlign.Center);
            Text.width('100%');
            Text.height(44);
            Text.backgroundColor('#FDD000');
            Text.borderRadius(8);
            Text.onClick(() => {
                const e3 = this.info?.mobile;
                if (e3 !== undefined && e3 !== null) {
                    Dialer.dial(this.getUIContext(), String(e3));
                }
            });
        }, Text);
        Text.pop();
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
