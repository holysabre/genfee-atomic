if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface TopicListPage_Params {
    dataSource?: TopicDataSource;
    refreshing?: boolean;
    address?: string;
    statusBarHeight?: number;
    navBarHeight?: number;
    page?: number;
    pageTotal?: number;
    loading?: boolean;
}
import type common from "@ohos:app.ability.common";
import router from "@ohos:router";
import { TopicApi } from "@bundle:com.atomicservice.6917614059205018261/entry/ets/services/TopicApi";
import type { Topic } from "@bundle:com.atomicservice.6917614059205018261/entry/ets/services/TopicApi";
import { AdService } from "@bundle:com.atomicservice.6917614059205018261/entry/ets/services/AdService";
import { AdIds } from "@bundle:com.atomicservice.6917614059205018261/entry/ets/constants/AdIds";
import { Store } from "@bundle:com.atomicservice.6917614059205018261/entry/ets/utils/Store";
import { Dialer } from "@bundle:com.atomicservice.6917614059205018261/entry/ets/utils/Dialer";
import { ListRow, TopicDataSource } from "@bundle:com.atomicservice.6917614059205018261/entry/ets/utils/TopicDataSource";
import { TopicCard } from "@bundle:com.atomicservice.6917614059205018261/entry/ets/components/TopicCard";
import { NativeAdCard } from "@bundle:com.atomicservice.6917614059205018261/entry/ets/components/NativeAdCard";
const PAGE_SIZE: number = 10;
const AD_INSERT_POS: number = 8; // 每批帖子第 8 条后插入 1 条原生广告
const CAPSULE_MARGIN_RIGHT: number = 96; // 元服务胶囊占位宽度（避免内容/标题与胶囊重叠）
class TopicListPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__dataSource = new ObservedPropertyObjectPU(new TopicDataSource(), this, "dataSource");
        this.__refreshing = new ObservedPropertySimplePU(false, this, "refreshing");
        this.__address = new ObservedPropertySimplePU('全国', this, "address");
        this.__statusBarHeight = new ObservedPropertySimplePU(0, this, "statusBarHeight");
        this.__navBarHeight = new ObservedPropertySimplePU(0, this, "navBarHeight");
        this.page = 1;
        this.pageTotal = -1;
        this.loading = false;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: TopicListPage_Params) {
        if (params.dataSource !== undefined) {
            this.dataSource = params.dataSource;
        }
        if (params.refreshing !== undefined) {
            this.refreshing = params.refreshing;
        }
        if (params.address !== undefined) {
            this.address = params.address;
        }
        if (params.statusBarHeight !== undefined) {
            this.statusBarHeight = params.statusBarHeight;
        }
        if (params.navBarHeight !== undefined) {
            this.navBarHeight = params.navBarHeight;
        }
        if (params.page !== undefined) {
            this.page = params.page;
        }
        if (params.pageTotal !== undefined) {
            this.pageTotal = params.pageTotal;
        }
        if (params.loading !== undefined) {
            this.loading = params.loading;
        }
    }
    updateStateVars(params: TopicListPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__dataSource.purgeDependencyOnElmtId(rmElmtId);
        this.__refreshing.purgeDependencyOnElmtId(rmElmtId);
        this.__address.purgeDependencyOnElmtId(rmElmtId);
        this.__statusBarHeight.purgeDependencyOnElmtId(rmElmtId);
        this.__navBarHeight.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__dataSource.aboutToBeDeleted();
        this.__refreshing.aboutToBeDeleted();
        this.__address.aboutToBeDeleted();
        this.__statusBarHeight.aboutToBeDeleted();
        this.__navBarHeight.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __dataSource: ObservedPropertyObjectPU<TopicDataSource>;
    get dataSource() {
        return this.__dataSource.get();
    }
    set dataSource(newValue: TopicDataSource) {
        this.__dataSource.set(newValue);
    }
    private __refreshing: ObservedPropertySimplePU<boolean>;
    get refreshing() {
        return this.__refreshing.get();
    }
    set refreshing(newValue: boolean) {
        this.__refreshing.set(newValue);
    }
    private __address: ObservedPropertySimplePU<string>; // 简化版固定全国（无地区选择页）
    get address() {
        return this.__address.get();
    }
    set address(newValue: string) {
        this.__address.set(newValue);
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
    private page: number;
    private pageTotal: number;
    private loading: boolean;
    aboutToAppear(): void {
        this.statusBarHeight = (AppStorage.get<number>('statusBarHeight') ?? 0);
        this.navBarHeight = (AppStorage.get<number>('navBarHeight') ?? 0);
        // 合规：首次启动必须先获得隐私协议同意，同意后才请求数据与广告
        if (Store.getBool('privacy_agreed', false)) {
            this.loadList(true, true);
        }
        else {
            this.showPrivacyDialog();
        }
    }
    /** 首启隐私协议弹窗（广告合规硬性要求：同意前不得请求广告） */
    private showPrivacyDialog(): void {
        this.getUIContext().getPromptAction().showDialog({
            title: '用户协议与隐私政策',
            message: '感谢您使用工蜂招工找活平台。我们将严格遵守法律法规，保护您的个人信息安全。' +
                '我们会基于网络状态加载招聘信息，并在您同意后展示广告内容。请您仔细阅读并同意《用户协议》和《隐私政策》后继续使用。',
            buttons: [
                { text: '同意', color: '#A67C00' },
                { text: '不同意', color: '#595959' }
            ]
        }).then((result) => {
            if (result.index === 0) {
                Store.putBool('privacy_agreed', true);
                this.initAfterConsent();
            }
            else {
                // 不同意则退出（行业通行合规做法）
                (getContext(this) as common.UIAbilityContext).terminateSelf();
            }
        });
    }
    private async initAfterConsent(): Promise<void> {
        // 注：元服务不支持 OAID（identifier 被禁用），无需广告权限初始化，仅非个性化广告
        this.loadList(true, true);
    }
    private async loadList(refresh: boolean, replace: boolean): Promise<void> {
        if (this.loading) {
            return;
        }
        this.loading = true;
        try {
            const res = await TopicApi.list(this.page, 1, 0);
            if (res.code === 200 && res.data) {
                const topics: Topic[] = res.data.data ?? [];
                this.pageTotal = res.data.last_page ?? -1;
                const rows: ListRow[] = topics.map((t: Topic) => {
                    const r = new ListRow();
                    r.kind = 0;
                    r.topic = t;
                    return r;
                });
                // 信息流广告：每批请求 1 条新广告插入（合规：不重复展示同一广告）
                if (AdIds.AD_ENABLED && rows.length > 0) {
                    const ads = await AdService.loadNativeAds(getContext(this), AdIds.nativeAdId(), 1);
                    if (ads.length > 0) {
                        const adRow = new ListRow();
                        adRow.kind = 1;
                        adRow.ad = ads[0];
                        rows.splice(Math.min(AD_INSERT_POS, rows.length), 0, adRow);
                    }
                }
                if (replace) {
                    this.dataSource.replaceAll(rows);
                }
                else {
                    this.dataSource.append(rows);
                }
            }
            else {
                this.getUIContext().getPromptAction().showToast({ message: res.msg ?? '加载失败' });
            }
        }
        finally {
            this.loading = false;
            if (refresh) {
                this.refreshing = false;
            }
        }
    }
    private onRefresh(): void {
        this.page = 1;
        this.loadList(true, true);
    }
    private onReachEnd(): void {
        if (!this.loading && this.pageTotal > 0 && this.page < this.pageTotal) {
            this.page += 1;
            this.loadList(false, false);
        }
    }
    /** 一级标题栏：仅 1 个文字元素，高度 ≥44vp，字号 ≥20fp 加粗，右侧留出胶囊占位 */
    titleBar(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.height(this.statusBarHeight + 44);
            Row.padding({ top: this.statusBarHeight });
            Row.backgroundColor('#B0CBEB');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 左侧与右侧占位等宽，使标题在视觉中心与胶囊水平中心对齐
            Blank.create();
            // 左侧与右侧占位等宽，使标题在视觉中心与胶囊水平中心对齐
            Blank.width(CAPSULE_MARGIN_RIGHT);
        }, Blank);
        // 左侧与右侧占位等宽，使标题在视觉中心与胶囊水平中心对齐
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('工蜂招工找活平台');
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
    filterBar(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 原标题栏中的"全国"+tabs 图下移到内容区，避免占用胶囊区域
            Stack.create();
            // 原标题栏中的"全国"+tabs 图下移到内容区，避免占用胶囊区域
            Stack.alignContent(Alignment.Center);
            // 原标题栏中的"全国"+tabs 图下移到内容区，避免占用胶囊区域
            Stack.width('100%');
            // 原标题栏中的"全国"+tabs 图下移到内容区，避免占用胶囊区域
            Stack.height(36);
            // 原标题栏中的"全国"+tabs 图下移到内容区，避免占用胶囊区域
            Stack.padding({ left: 20, right: 20 });
            // 原标题栏中的"全国"+tabs 图下移到内容区，避免占用胶囊区域
            Stack.backgroundColor('#B0CBEB');
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.address);
            Text.fontSize(12);
            Text.fontColor('#222222');
            Text.margin({ left: 10 });
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width(177);
            Row.height(24);
            Row.backgroundColor(Color.White);
            Row.borderRadius(12);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777231, "type": 20000, params: [], "bundleName": "com.atomicservice.6917614059205018261", "moduleName": "entry" });
            Image.width('100%');
            Image.height('100%');
        }, Image);
        Row.pop();
        // 原标题栏中的"全国"+tabs 图下移到内容区，避免占用胶囊区域
        Stack.pop();
    }
    emptyView(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height(400);
            Column.justifyContent(FlexAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777227, "type": 20000, params: [], "bundleName": "com.atomicservice.6917614059205018261", "moduleName": "entry" });
            Image.width(130);
            Image.height(130);
            Image.margin({ bottom: 10 });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('暂无数据');
            Text.fontSize(14);
            Text.fontColor('#333333');
        }, Text);
        Text.pop();
        Column.pop();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#B0CBEB');
        }, Column);
        this.titleBar.bind(this)();
        this.filterBar.bind(this)();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.dataSource.isEmpty() && !this.loading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.emptyView.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Refresh.create({ refreshing: { value: this.refreshing, changeEvent: newValue => { this.refreshing = newValue; } } });
                        Refresh.onRefreshing(() => this.onRefresh());
                        Refresh.layoutWeight(1);
                    }, Refresh);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        List.create();
                        List.width('100%');
                        List.padding({ left: 20, right: 20, bottom: this.navBarHeight });
                        List.onReachEnd(() => this.onReachEnd());
                    }, List);
                    {
                        const __lazyForEachItemGenFunction = (_item, index: number) => {
                            const item = _item;
                            {
                                const itemCreation2 = (elmtId, isInitialRender) => {
                                    ListItem.create(() => { }, false);
                                };
                                const observedDeepRender = () => {
                                    this.observeComponentCreation2(itemCreation2, ListItem);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        If.create();
                                        if (item.kind === 0) {
                                            this.ifElseBranchUpdateFunction(0, () => {
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    __Common__.create();
                                                    __Common__.onClick(() => {
                                                        const id = item.topic?.id;
                                                        if (id) {
                                                            router.pushUrl({ url: 'pages/TopicDetailPage', params: { id: id } });
                                                        }
                                                    });
                                                }, __Common__);
                                                {
                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                        if (isInitialRender) {
                                                            let componentCall = new TopicCard(this, {
                                                                topic: item.topic,
                                                                onContact: (mobile: string) => {
                                                                    Dialer.dial(this.getUIContext(), mobile);
                                                                }
                                                            }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/TopicListPage.ets", line: 204, col: 19 });
                                                            ViewPU.create(componentCall);
                                                            let paramsLambda = () => {
                                                                return {
                                                                    topic: item.topic,
                                                                    onContact: (mobile: string) => {
                                                                        Dialer.dial(this.getUIContext(), mobile);
                                                                    }
                                                                };
                                                            };
                                                            componentCall.paramsGenerator_ = paramsLambda;
                                                        }
                                                        else {
                                                            this.updateStateVarsOfChildByElmtId(elmtId, {});
                                                        }
                                                    }, { name: "TopicCard" });
                                                }
                                                __Common__.pop();
                                            });
                                        }
                                        else {
                                            this.ifElseBranchUpdateFunction(1, () => {
                                                {
                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                        if (isInitialRender) {
                                                            let componentCall = new NativeAdCard(this, { ad: item.ad }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/TopicListPage.ets", line: 217, col: 19 });
                                                            ViewPU.create(componentCall);
                                                            let paramsLambda = () => {
                                                                return {
                                                                    ad: item.ad
                                                                };
                                                            };
                                                            componentCall.paramsGenerator_ = paramsLambda;
                                                        }
                                                        else {
                                                            this.updateStateVarsOfChildByElmtId(elmtId, {});
                                                        }
                                                    }, { name: "NativeAdCard" });
                                                }
                                            });
                                        }
                                    }, If);
                                    If.pop();
                                    ListItem.pop();
                                };
                                observedDeepRender();
                            }
                        };
                        const __lazyForEachItemIdFunc = (item: ListRow, index: number) => `${item.kind}_${index}_${item.topic?.id ?? 'ad'}`;
                        LazyForEach.create("1", this, this.dataSource, __lazyForEachItemGenFunction, __lazyForEachItemIdFunc);
                        LazyForEach.pop();
                    }
                    List.pop();
                    Refresh.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "TopicListPage";
    }
}
registerNamedRoute(() => new TopicListPage(undefined, {}), "", { bundleName: "com.atomicservice.6917614059205018261", moduleName: "entry", pagePath: "pages/TopicListPage", pageFullPath: "entry/src/main/ets/pages/TopicListPage", integratedHsp: "false", moduleType: "followWithHap" });
