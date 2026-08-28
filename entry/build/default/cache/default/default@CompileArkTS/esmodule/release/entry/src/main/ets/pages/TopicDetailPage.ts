if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface TopicDetailPage_Params {
    info?: Topic | null;
    tags?: string[];
    statusBarHeight?: number;
    navBarHeight?: number;
    rewardGranted?: boolean;
    adLoading?: boolean;
    rewardCountdown?: number;
    rewardAd?: advertising.Advertisement | null;
    countdownTimer?: number;
}
import router from "@ohos:router";
import type common from "@ohos:app.ability.common";
import { TopicApi } from "@bundle:com.atomicservice.6917614059205018261/entry/ets/services/TopicApi";
import type { Topic } from "@bundle:com.atomicservice.6917614059205018261/entry/ets/services/TopicApi";
import { Dialer } from "@bundle:com.atomicservice.6917614059205018261/entry/ets/utils/Dialer";
import { BannerAdView } from "@bundle:com.atomicservice.6917614059205018261/entry/ets/components/BannerAdView";
import { AdIds } from "@bundle:com.atomicservice.6917614059205018261/entry/ets/constants/AdIds";
import { AdService } from "@bundle:com.atomicservice.6917614059205018261/entry/ets/services/AdService";
import hilog from "@ohos:hilog";
import type advertising from "@ohos:advertising";
import { Colors } from "@bundle:com.atomicservice.6917614059205018261/entry/ets/constants/Colors";
const CAPSULE_MARGIN_RIGHT: number = 96;
const INTERSTITIAL_SHOWN_KEY: string = 'interstitial_shown_in_session';
class TopicDetailPage extends ViewPU {
    constructor(f5, g5, h5, i5 = -1, j5 = undefined, k5) {
        super(f5, h5, i5, k5);
        if (typeof j5 === "function") {
            this.paramsGenerator_ = j5;
        }
        this.__info = new ObservedPropertyObjectPU(null, this, "info");
        this.__tags = new ObservedPropertyObjectPU([], this, "tags");
        this.__statusBarHeight = new ObservedPropertySimplePU(0, this, "statusBarHeight");
        this.__navBarHeight = new ObservedPropertySimplePU(0, this, "navBarHeight");
        this.__rewardGranted = new ObservedPropertySimplePU(false, this, "rewardGranted");
        this.__adLoading = new ObservedPropertySimplePU(false, this, "adLoading");
        this.__rewardCountdown = new ObservedPropertySimplePU(0, this, "rewardCountdown");
        this.rewardAd = null;
        this.countdownTimer = -1;
        this.setInitiallyProvidedValue(g5);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(e5: TopicDetailPage_Params) {
        if (e5.info !== undefined) {
            this.info = e5.info;
        }
        if (e5.tags !== undefined) {
            this.tags = e5.tags;
        }
        if (e5.statusBarHeight !== undefined) {
            this.statusBarHeight = e5.statusBarHeight;
        }
        if (e5.navBarHeight !== undefined) {
            this.navBarHeight = e5.navBarHeight;
        }
        if (e5.rewardGranted !== undefined) {
            this.rewardGranted = e5.rewardGranted;
        }
        if (e5.adLoading !== undefined) {
            this.adLoading = e5.adLoading;
        }
        if (e5.rewardCountdown !== undefined) {
            this.rewardCountdown = e5.rewardCountdown;
        }
        if (e5.rewardAd !== undefined) {
            this.rewardAd = e5.rewardAd;
        }
        if (e5.countdownTimer !== undefined) {
            this.countdownTimer = e5.countdownTimer;
        }
    }
    updateStateVars(d5: TopicDetailPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(c5) {
        this.__info.purgeDependencyOnElmtId(c5);
        this.__tags.purgeDependencyOnElmtId(c5);
        this.__statusBarHeight.purgeDependencyOnElmtId(c5);
        this.__navBarHeight.purgeDependencyOnElmtId(c5);
        this.__rewardGranted.purgeDependencyOnElmtId(c5);
        this.__adLoading.purgeDependencyOnElmtId(c5);
        this.__rewardCountdown.purgeDependencyOnElmtId(c5);
    }
    aboutToBeDeleted() {
        this.__info.aboutToBeDeleted();
        this.__tags.aboutToBeDeleted();
        this.__statusBarHeight.aboutToBeDeleted();
        this.__navBarHeight.aboutToBeDeleted();
        this.__rewardGranted.aboutToBeDeleted();
        this.__adLoading.aboutToBeDeleted();
        this.__rewardCountdown.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __info: ObservedPropertyObjectPU<Topic | null>;
    get info() {
        return this.__info.get();
    }
    set info(b5: Topic | null) {
        this.__info.set(b5);
    }
    private __tags: ObservedPropertyObjectPU<string[]>;
    get tags() {
        return this.__tags.get();
    }
    set tags(a5: string[]) {
        this.__tags.set(a5);
    }
    private __statusBarHeight: ObservedPropertySimplePU<number>;
    get statusBarHeight() {
        return this.__statusBarHeight.get();
    }
    set statusBarHeight(z4: number) {
        this.__statusBarHeight.set(z4);
    }
    private __navBarHeight: ObservedPropertySimplePU<number>;
    get navBarHeight() {
        return this.__navBarHeight.get();
    }
    set navBarHeight(y4: number) {
        this.__navBarHeight.set(y4);
    }
    private __rewardGranted: ObservedPropertySimplePU<boolean>;
    get rewardGranted() {
        return this.__rewardGranted.get();
    }
    set rewardGranted(x4: boolean) {
        this.__rewardGranted.set(x4);
    }
    private __adLoading: ObservedPropertySimplePU<boolean>;
    get adLoading() {
        return this.__adLoading.get();
    }
    set adLoading(w4: boolean) {
        this.__adLoading.set(w4);
    }
    private __rewardCountdown: ObservedPropertySimplePU<number>;
    get rewardCountdown() {
        return this.__rewardCountdown.get();
    }
    set rewardCountdown(v4: number) {
        this.__rewardCountdown.set(v4);
    }
    private rewardAd: advertising.Advertisement | null;
    private countdownTimer: number;
    aboutToAppear(): void {
        this.statusBarHeight = (AppStorage.get<number>('statusBarHeight') ?? 0);
        this.navBarHeight = (AppStorage.get<number>('navBarHeight') ?? 0);
        const t4 = router.getParams() as Record<string, number> | undefined;
        const u4 = t4?.id ?? 0;
        if (u4 > 0) {
            this.loadDetail(u4);
        }
        this.tryShowInterstitial();
    }
    private async loadDetail(q4: number): Promise<void> {
        const r4 = await TopicApi.detail(q4);
        if (r4.code === 200 && r4.data?.data) {
            this.info = r4.data.data;
            this.tags = (this.info.category_name ?? '').split('、').filter((s4: string) => s4.length > 0);
        }
        else {
            this.getUIContext().getPromptAction().showToast({ message: r4.msg ?? '加载失败' });
        }
    }
    private async tryShowInterstitial(): Promise<void> {
        if (!AdIds.AD_ENABLED) {
            return;
        }
        const o4 = AppStorage.get<boolean>(INTERSTITIAL_SHOWN_KEY) ?? false;
        if (o4) {
            return;
        }
        const p4 = await AdService.loadInterstitialAd(getContext(this), AdIds.interstitialVideoAdId(), AdIds.interstitialImageAdId());
        if (p4 !== null) {
            AppStorage.setOrCreate(INTERSTITIAL_SHOWN_KEY, true);
            AdService.showInterstitialAd(getContext(this) as common.UIAbilityContext, p4);
        }
    }
    private async onContactClick(): Promise<void> {
        if (this.rewardGranted) {
            this.doDial();
            return;
        }
        if (this.adLoading) {
            return;
        }
        if (!AdIds.AD_ENABLED) {
            this.doDial();
            return;
        }
        this.adLoading = true;
        try {
            const l4 = await AdService.loadRewardAd(getContext(this), AdIds.rewardAdId());
            if (l4 === null) {
                this.getUIContext().getPromptAction().showToast({ message: '广告加载失败，请稍后重试' });
                return;
            }
            this.rewardAd = l4;
            AdService.showRewardAd(getContext(this) as common.UIAbilityContext, l4, {
                onReward: () => {
                    hilog.info(0x0000, 'WorkerBeeAd', 'reward granted callback');
                },
                onClose: () => {
                    hilog.info(0x0000, 'WorkerBeeAd', 'reward ad closed, countdown=%{public}d', this.rewardCountdown);
                },
                onError: (m4: number, n4: string) => {
                    hilog.error(0x0000, 'WorkerBeeAd', 'reward show error code=%{public}d msg=%{public}s', m4, n4);
                    this.stopCountdown();
                    this.getUIContext().getPromptAction().showToast({ message: '广告播放失败，请稍后重试' });
                }
            });
            this.startCountdown(10);
        }
        finally {
            this.adLoading = false;
        }
    }
    private doDial(): void {
        const k4 = this.info?.mobile;
        if (k4 !== undefined && k4 !== null) {
            Dialer.dial(this.getUIContext(), String(k4));
        }
    }
    private startCountdown(j4: number): void {
        this.stopCountdown();
        this.rewardCountdown = j4;
        this.countdownTimer = setInterval(() => {
            if (this.rewardCountdown > 0) {
                this.rewardCountdown -= 1;
            }
            if (this.rewardCountdown <= 0) {
                this.rewardGranted = true;
                this.stopCountdown();
                this.getUIContext().getPromptAction().showToast({ message: '已获得免费联系权限' });
            }
        }, 1000);
    }
    private stopCountdown(): void {
        if (this.countdownTimer !== -1) {
            clearInterval(this.countdownTimer);
            this.countdownTimer = -1;
        }
        if (!this.rewardGranted) {
            this.rewardCountdown = 0;
        }
    }
    private getContactButtonText(): string {
        if (this.rewardGranted) {
            return '免费联系';
        }
        if (this.rewardCountdown > 0) {
            return `观看中 (${this.rewardCountdown}s)`;
        }
        if (this.adLoading) {
            return '广告加载中...';
        }
        return '观看视频后免费联系';
    }
    titleBar(y3 = null) {
        this.observeComponentCreation2((h4, i4) => {
            Row.create();
            Row.width('100%');
            Row.height(this.statusBarHeight + 44);
            Row.padding({ top: this.statusBarHeight });
            Row.backgroundColor(Color.White);
        }, Row);
        this.observeComponentCreation2((f4, g4) => {
            Row.create();
            Row.width(CAPSULE_MARGIN_RIGHT);
            Row.justifyContent(FlexAlign.Start);
        }, Row);
        this.observeComponentCreation2((d4, e4) => {
            Image.create({ "id": 16777226, "type": 20000, params: [], "bundleName": "com.atomicservice.6917614059205018261", "moduleName": "entry" });
            Image.width(24);
            Image.height(24);
            Image.onClick(() => {
                router.back();
            });
        }, Image);
        Row.pop();
        this.observeComponentCreation2((b4, c4) => {
            Text.create('内容详情');
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Colors.BODY_TEXT);
            Text.textAlign(TextAlign.Center);
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((z3, a4) => {
            Blank.create();
            Blank.width(CAPSULE_MARGIN_RIGHT);
        }, Blank);
        Blank.pop();
        Row.pop();
    }
    labelRow(n3: string, o3: string, p3: string, q3: boolean, r3 = null) {
        this.observeComponentCreation2((w3, x3) => {
            Row.create();
            Row.width('100%');
            Row.justifyContent(FlexAlign.SpaceBetween);
            Row.margin({ bottom: 10 });
        }, Row);
        this.observeComponentCreation2((u3, v3) => {
            Text.create(n3);
            Text.fontSize(14);
            Text.fontColor(Colors.SECONDARY_TEXT);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((s3, t3) => {
            Text.create(o3);
            Text.fontSize(14);
            Text.fontColor(p3);
            Text.fontWeight(q3 ? FontWeight.Bold : FontWeight.Regular);
        }, Text);
        Text.pop();
        Row.pop();
    }
    initialRender() {
        this.observeComponentCreation2((l3, m3) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor(Color.White);
        }, Column);
        this.titleBar.bind(this)();
        this.observeComponentCreation2((j3, k3) => {
            Stack.create({ alignContent: Alignment.Bottom });
            Stack.width('100%');
            Stack.layoutWeight(1);
            Stack.backgroundColor(Color.White);
        }, Stack);
        this.observeComponentCreation2((h3, i3) => {
            Scroll.create();
            Scroll.width('100%');
            Scroll.height('100%');
        }, Scroll);
        this.observeComponentCreation2((f3, g3) => {
            Column.create();
            Column.width('100%');
            Column.padding({ left: 16, right: 16, top: 14, bottom: 150 + this.navBarHeight });
        }, Column);
        this.observeComponentCreation2((d3, e3) => {
            Row.create();
            Row.width('100%');
            Row.alignItems(VerticalAlign.Top);
            Row.margin({ bottom: 10 });
        }, Row);
        this.observeComponentCreation2((b3, c3) => {
            Text.create('需求职业：');
            Text.fontSize(14);
            Text.fontColor(Colors.SECONDARY_TEXT);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((z2, a3) => {
            Flex.create({ wrap: FlexWrap.Wrap });
            Flex.layoutWeight(1);
        }, Flex);
        this.observeComponentCreation2((s2, t2) => {
            ForEach.create();
            const u2 = v2 => {
                const w2 = v2;
                this.observeComponentCreation2((x2, y2) => {
                    Text.create(w2);
                    Text.fontSize(13);
                    Text.fontColor(Colors.PRIMARY_TEXT);
                    Text.height(20);
                    Text.padding({ left: 12, right: 12 });
                    Text.borderRadius(13);
                    Text.border({ width: 1, color: Colors.PRIMARY_TEXT });
                    Text.margin({ right: 10, bottom: 10 });
                }, Text);
                Text.pop();
            };
            this.forEachUpdateFunction(s2, this.tags, u2);
        }, ForEach);
        ForEach.pop();
        Flex.pop();
        Row.pop();
        this.observeComponentCreation2((q2, r2) => {
            Column.create();
            Column.width('100%');
            Column.margin({ bottom: 10 });
        }, Column);
        this.observeComponentCreation2((o2, p2) => {
            Row.create();
            Row.width('100%');
            Row.justifyContent(FlexAlign.SpaceBetween);
        }, Row);
        this.observeComponentCreation2((m2, n2) => {
            Text.create('要求：');
            Text.fontSize(14);
            Text.fontColor(Colors.SECONDARY_TEXT);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((k2, l2) => {
            Text.create(`发布时间：${this.info?.created_at ?? '暂无'}`);
            Text.fontSize(12);
            Text.fontColor(Colors.SECONDARY_TEXT);
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((i2, j2) => {
            Text.create(this.info?.content ?? '');
            Text.fontSize(14);
            Text.fontColor(Colors.BODY_TEXT);
            Text.lineHeight(24);
            Text.width('100%');
            Text.margin({ top: 8, bottom: 10 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((g2, h2) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((e2, f2) => {
            Image.create({ "id": 16777224, "type": 20000, params: [], "bundleName": "com.atomicservice.6917614059205018261", "moduleName": "entry" });
            Image.width(12);
            Image.height(12);
            Image.margin({ right: 4 });
        }, Image);
        this.observeComponentCreation2((c2, d2) => {
            Text.create(this.info?.address ?? '');
            Text.fontSize(14);
            Text.fontColor(Colors.SECONDARY_TEXT);
        }, Text);
        Text.pop();
        Row.pop();
        Column.pop();
        this.observeComponentCreation2((a2, b2) => {
            If.create();
            if ((this.info?.party ?? 1) !== 2) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.labelRow.bind(this)('薪酬范围：', this.info?.salary ?? '暂无', Colors.SALARY_TEXT, true);
                    this.labelRow.bind(this)('企业单位：', this.info?.company_name ?? '暂无', Colors.BODY_TEXT, false);
                    this.labelRow.bind(this)('岗位收费要求：', '该岗位招聘不涉及收费', Colors.BODY_TEXT, false);
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
        this.observeComponentCreation2((y1, z1) => {
            Column.create();
            Column.width('100%');
            Column.padding({ left: 17, right: 17, top: 10, bottom: 15 + this.navBarHeight });
            Column.backgroundColor(Color.White);
        }, Column);
        this.observeComponentCreation2((w1, x1) => {
            Row.create();
            Row.margin({ bottom: 3 });
        }, Row);
        this.observeComponentCreation2((u1, v1) => {
            Image.create({ "id": 16777230, "type": 20000, params: [], "bundleName": "com.atomicservice.6917614059205018261", "moduleName": "entry" });
            Image.width(24);
            Image.height(24);
        }, Image);
        this.observeComponentCreation2((s1, t1) => {
            Text.create('温馨提示');
            Text.fontSize(12);
            Text.fontColor(Colors.PRIMARY_TEXT);
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((q1, r1) => {
            Text.create('联系之前请您注意辨别信息真伪，核实岗位实情及实际情况，谨防上当受骗。平台不参与招聘事宜，相关招聘及履约问题由招聘双方确认并担责。');
            Text.fontSize(10);
            Text.fontColor(Colors.CAPTION_TEXT);
            Text.width('100%');
            Text.margin({ bottom: 10 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((i1, j1) => {
            If.create();
            if (AdIds.AD_ENABLED) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((o1, p1) => {
                        __Common__.create();
                        __Common__.margin({ bottom: 8 });
                    }, __Common__);
                    {
                        this.observeComponentCreation2((k1, l1) => {
                            if (l1) {
                                let m1 = new BannerAdView(this, {}, undefined, k1, () => { }, { page: "entry/src/main/ets/pages/TopicDetailPage.ets", line: 306, col: 13 });
                                ViewPU.create(m1);
                                let n1 = () => {
                                    return {};
                                };
                                m1.paramsGenerator_ = n1;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(k1, {});
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
        this.observeComponentCreation2((g1, h1) => {
            Text.create(this.getContactButtonText());
            Text.fontSize(15);
            Text.fontColor(Colors.BODY_TEXT);
            Text.textAlign(TextAlign.Center);
            Text.width('100%');
            Text.height(44);
            Text.backgroundColor(Colors.PRIMARY_BUTTON_BG);
            Text.borderRadius(8);
            Text.onClick(() => this.onContactClick());
        }, Text);
        Text.pop();
        Column.pop();
        Stack.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "TopicDetailPage";
    }
}
registerNamedRoute(() => new TopicDetailPage(undefined, {}), "", { bundleName: "com.atomicservice.6917614059205018261", moduleName: "entry", pagePath: "pages/TopicDetailPage", pageFullPath: "entry/src/main/ets/pages/TopicDetailPage", integratedHsp: "false", moduleType: "followWithHap" });
