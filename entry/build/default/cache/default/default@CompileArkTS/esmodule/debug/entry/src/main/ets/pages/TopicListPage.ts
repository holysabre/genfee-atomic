if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface TopicListPage_Params {
    dataSource?: TopicDataSource;
    refreshing?: boolean;
    address?: string;
    statusBarHeight?: number;
    page?: number;
    pageTotal?: number;
    loading?: boolean;
}
import type common from "@ohos:app.ability.common";
import router from "@ohos:router";
import { TopicApi } from "@bundle:com.atomicservice.6917612394359487010/entry/ets/services/TopicApi";
import type { Topic } from "@bundle:com.atomicservice.6917612394359487010/entry/ets/services/TopicApi";
import { AdService } from "@bundle:com.atomicservice.6917612394359487010/entry/ets/services/AdService";
import { AdIds } from "@bundle:com.atomicservice.6917612394359487010/entry/ets/constants/AdIds";
import { Store } from "@bundle:com.atomicservice.6917612394359487010/entry/ets/utils/Store";
import { Dialer } from "@bundle:com.atomicservice.6917612394359487010/entry/ets/utils/Dialer";
import { ListRow, TopicDataSource } from "@bundle:com.atomicservice.6917612394359487010/entry/ets/utils/TopicDataSource";
import { TopicCard } from "@bundle:com.atomicservice.6917612394359487010/entry/ets/components/TopicCard";
import { NativeAdCard } from "@bundle:com.atomicservice.6917612394359487010/entry/ets/components/NativeAdCard";
const PAGE_SIZE: number = 10;
const AD_INSERT_POS: number = 8; // 每批帖子第 8 条后插入 1 条原生广告
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
    }
    aboutToBeDeleted() {
        this.__dataSource.aboutToBeDeleted();
        this.__refreshing.aboutToBeDeleted();
        this.__address.aboutToBeDeleted();
        this.__statusBarHeight.aboutToBeDeleted();
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
    private page: number;
    private pageTotal: number;
    private loading: boolean;
    aboutToAppear(): void {
        this.statusBarHeight = (AppStorage.get<number>('statusBarHeight') ?? 0);
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
                { text: '同意', color: '#FFC900' },
                { text: '不同意', color: '#888888' }
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
    headerBar(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding({ top: this.statusBarHeight });
            Column.backgroundColor('#B0CBEB');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // logo + 标题（还原小程序自定义导航栏）
            Row.create();
            // logo + 标题（还原小程序自定义导航栏）
            Row.width('100%');
            // logo + 标题（还原小程序自定义导航栏）
            Row.height(38);
            // logo + 标题（还原小程序自定义导航栏）
            Row.padding({ left: 10, right: 10 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777225, "type": 20000, params: [], "bundleName": "com.atomicservice.6917612394359487010", "moduleName": "entry" });
            Image.width(30);
            Image.height(30);
            Image.borderRadius(15);
            Image.margin({ right: 8 });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('工蜂招工找活平台');
            Text.fontSize(14);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#222222');
        }, Text);
        Text.pop();
        // logo + 标题（还原小程序自定义导航栏）
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 地区（静态"全国"）+ 中部 tabs 图
            Stack.create();
            // 地区（静态"全国"）+ 中部 tabs 图
            Stack.alignContent(Alignment.Center);
            // 地区（静态"全国"）+ 中部 tabs 图
            Stack.width('100%');
            // 地区（静态"全国"）+ 中部 tabs 图
            Stack.height(36);
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
            Image.create({ "id": 16777230, "type": 20000, params: [], "bundleName": "com.atomicservice.6917612394359487010", "moduleName": "entry" });
            Image.width('100%');
            Image.height('100%');
        }, Image);
        Row.pop();
        // 地区（静态"全国"）+ 中部 tabs 图
        Stack.pop();
        Column.pop();
    }
    emptyView(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height(400);
            Column.justifyContent(FlexAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777226, "type": 20000, params: [], "bundleName": "com.atomicservice.6917612394359487010", "moduleName": "entry" });
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
        this.headerBar.bind(this)();
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
                        List.padding({ left: 20, right: 20 });
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
                                                            }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/TopicListPage.ets", line: 197, col: 19 });
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
                                                            let componentCall = new NativeAdCard(this, { ad: item.ad }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/TopicListPage.ets", line: 210, col: 19 });
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
registerNamedRoute(() => new TopicListPage(undefined, {}), "", { bundleName: "com.atomicservice.6917612394359487010", moduleName: "entry", pagePath: "pages/TopicListPage", pageFullPath: "entry/src/main/ets/pages/TopicListPage", integratedHsp: "false", moduleType: "followWithHap" });
