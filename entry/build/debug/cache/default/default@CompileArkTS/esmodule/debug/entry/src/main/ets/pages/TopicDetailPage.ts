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
const CAPSULE_MARGIN_RIGHT: number = 96; // 元服务胶囊占位宽度
const INTERSTITIAL_SHOWN_KEY: string = 'interstitial_shown_in_session';
class TopicDetailPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
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
        if (params.navBarHeight !== undefined) {
            this.navBarHeight = params.navBarHeight;
        }
        if (params.rewardGranted !== undefined) {
            this.rewardGranted = params.rewardGranted;
        }
        if (params.adLoading !== undefined) {
            this.adLoading = params.adLoading;
        }
        if (params.rewardCountdown !== undefined) {
            this.rewardCountdown = params.rewardCountdown;
        }
        if (params.rewardAd !== undefined) {
            this.rewardAd = params.rewardAd;
        }
        if (params.countdownTimer !== undefined) {
            this.countdownTimer = params.countdownTimer;
        }
    }
    updateStateVars(params: TopicDetailPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__info.purgeDependencyOnElmtId(rmElmtId);
        this.__tags.purgeDependencyOnElmtId(rmElmtId);
        this.__statusBarHeight.purgeDependencyOnElmtId(rmElmtId);
        this.__navBarHeight.purgeDependencyOnElmtId(rmElmtId);
        this.__rewardGranted.purgeDependencyOnElmtId(rmElmtId);
        this.__adLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__rewardCountdown.purgeDependencyOnElmtId(rmElmtId);
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
    private __navBarHeight: ObservedPropertySimplePU<number>; // 底部导航条避让高度（审核整改）
    get navBarHeight() {
        return this.__navBarHeight.get();
    }
    set navBarHeight(newValue: number) {
        this.__navBarHeight.set(newValue);
    }
    private __rewardGranted: ObservedPropertySimplePU<boolean>; // 激励视频是否已看完
    get rewardGranted() {
        return this.__rewardGranted.get();
    }
    set rewardGranted(newValue: boolean) {
        this.__rewardGranted.set(newValue);
    }
    private __adLoading: ObservedPropertySimplePU<boolean>; // 广告加载中状态
    get adLoading() {
        return this.__adLoading.get();
    }
    set adLoading(newValue: boolean) {
        this.__adLoading.set(newValue);
    }
    private __rewardCountdown: ObservedPropertySimplePU<number>; // 激励视频倒计时（秒）
    get rewardCountdown() {
        return this.__rewardCountdown.get();
    }
    set rewardCountdown(newValue: number) {
        this.__rewardCountdown.set(newValue);
    }
    private rewardAd: advertising.Advertisement | null;
    private countdownTimer: number;
    aboutToAppear(): void {
        this.statusBarHeight = (AppStorage.get<number>('statusBarHeight') ?? 0);
        this.navBarHeight = (AppStorage.get<number>('navBarHeight') ?? 0);
        const params = router.getParams() as Record<string, number> | undefined;
        const id = params?.id ?? 0;
        if (id > 0) {
            this.loadDetail(id);
        }
        // 合规：请求/展示广告前必须已获得隐私协议同意（页面层已控制，aboutToAppear 时同意态已确定）
        this.tryShowInterstitial();
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
    /** 应用生命周期内最多展示 1 次插屏广告 */
    private async tryShowInterstitial(): Promise<void> {
        if (!AdIds.AD_ENABLED) {
            return;
        }
        const alreadyShown = AppStorage.get<boolean>(INTERSTITIAL_SHOWN_KEY) ?? false;
        if (alreadyShown) {
            return;
        }
        const ad = await AdService.loadInterstitialAd(getContext(this), AdIds.interstitialVideoAdId(), AdIds.interstitialImageAdId());
        if (ad !== null) {
            AppStorage.setOrCreate(INTERSTITIAL_SHOWN_KEY, true);
            AdService.showInterstitialAd(getContext(this) as common.UIAbilityContext, ad);
        }
    }
    /** 点击免费联系：未看激励视频则先加载并播放，看完才能拨号 */
    private async onContactClick(): Promise<void> {
        if (this.rewardGranted) {
            this.doDial();
            return;
        }
        if (this.adLoading) {
            return;
        }
        if (!AdIds.AD_ENABLED) {
            // 广告总开关关闭时直接允许联系
            this.doDial();
            return;
        }
        this.adLoading = true;
        try {
            const ad = await AdService.loadRewardAd(getContext(this), AdIds.rewardAdId());
            if (ad === null) {
                this.getUIContext().getPromptAction().showToast({ message: '广告加载失败，请稍后重试' });
                return;
            }
            this.rewardAd = ad;
            AdService.showRewardAd(getContext(this) as common.UIAbilityContext, ad, {
                onReward: () => {
                    hilog.info(0x0000, 'WorkerBeeAd', 'reward granted callback');
                },
                onClose: () => {
                    // SDK 未暴露广告关闭回调，倒计时已在 showAd 调用时启动。
                    hilog.info(0x0000, 'WorkerBeeAd', 'reward ad closed, countdown=%{public}d', this.rewardCountdown);
                },
                onError: (code: number, msg: string) => {
                    hilog.error(0x0000, 'WorkerBeeAd', 'reward show error code=%{public}d msg=%{public}s', code, msg);
                    this.stopCountdown();
                    this.getUIContext().getPromptAction().showToast({ message: '广告播放失败，请稍后重试' });
                }
            });
            // 激励视频播放后启动倒计时，防止用户直接关闭广告就跳过观看
            this.startCountdown(10);
        }
        finally {
            this.adLoading = false;
        }
    }
    private doDial(): void {
        const mobile = this.info?.mobile;
        if (mobile !== undefined && mobile !== null) {
            Dialer.dial(this.getUIContext(), String(mobile));
        }
    }
    private startCountdown(seconds: number): void {
        this.stopCountdown();
        this.rewardCountdown = seconds;
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
    /** 二级标题栏：返回图片 + 标题，共 2 个元素；右侧留出胶囊占位 */
    titleBar(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.height(this.statusBarHeight + 44);
            Row.padding({ top: this.statusBarHeight });
            Row.backgroundColor(Color.White);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width(CAPSULE_MARGIN_RIGHT);
            Row.justifyContent(FlexAlign.Start);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777226, "type": 20000, params: [], "bundleName": "com.atomicservice.6917614059205018261", "moduleName": "entry" });
            Image.width(24);
            Image.height(24);
            Image.onClick(() => {
                router.back();
            });
        }, Image);
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('内容详情');
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#222222');
            Text.textAlign(TextAlign.Center);
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.width(CAPSULE_MARGIN_RIGHT);
        }, Blank);
        Blank.pop();
        Row.pop();
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
            Text.fontColor('#595959');
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
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor(Color.White);
        }, Column);
        this.titleBar.bind(this)();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create({ alignContent: Alignment.Bottom });
            Stack.width('100%');
            Stack.layoutWeight(1);
            Stack.backgroundColor(Color.White);
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 内容区
            Scroll.create();
            // 内容区
            Scroll.width('100%');
            // 内容区
            Scroll.height('100%');
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding({ left: 16, right: 16, top: 14, bottom: 150 + this.navBarHeight });
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
            Text.fontColor('#595959');
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
                    Text.fontColor('#A67C00');
                    Text.height(20);
                    Text.padding({ left: 12, right: 12 });
                    Text.borderRadius(13);
                    Text.border({ width: 1, color: '#A67C00' });
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
            Text.fontColor('#595959');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`发布时间：${this.info?.created_at ?? '暂无'}`);
            Text.fontSize(12);
            Text.fontColor('#595959');
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
            Image.create({ "id": 16777224, "type": 20000, params: [], "bundleName": "com.atomicservice.6917614059205018261", "moduleName": "entry" });
            Image.width(12);
            Image.height(12);
            Image.margin({ right: 4 });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.info?.address ?? '');
            Text.fontSize(14);
            Text.fontColor('#595959');
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
                    this.labelRow.bind(this)('薪酬范围：', this.info?.salary ?? '暂无', '#A67C00', true);
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
            Column.padding({ left: 17, right: 17, top: 10, bottom: 15 + this.navBarHeight });
            // 底部固定操作区（温馨提示 + Banner 广告 + 免费联系）
            Column.backgroundColor(Color.White);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.margin({ bottom: 3 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777230, "type": 20000, params: [], "bundleName": "com.atomicservice.6917614059205018261", "moduleName": "entry" });
            Image.width(24);
            Image.height(24);
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('温馨提示');
            Text.fontSize(12);
            Text.fontColor('#A67C00');
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
                                let componentCall = new BannerAdView(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/TopicDetailPage.ets", line: 305, col: 13 });
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
            Text.create(this.getContactButtonText());
            Text.fontSize(15);
            Text.fontColor('#000000');
            Text.textAlign(TextAlign.Center);
            Text.width('100%');
            Text.height(44);
            Text.backgroundColor('#FDD000');
            Text.borderRadius(8);
            Text.onClick(() => this.onContactClick());
        }, Text);
        Text.pop();
        // 底部固定操作区（温馨提示 + Banner 广告 + 免费联系）
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
