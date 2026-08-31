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
import router from "@ohos:router";
import { TopicApi } from "@bundle:com.atomicservice.6917614059205018261/entry/ets/services/TopicApi";
import type { Topic } from "@bundle:com.atomicservice.6917614059205018261/entry/ets/services/TopicApi";
import { AdService } from "@bundle:com.atomicservice.6917614059205018261/entry/ets/services/AdService";
import { AdIds } from "@bundle:com.atomicservice.6917614059205018261/entry/ets/constants/AdIds";
import { Dialer } from "@bundle:com.atomicservice.6917614059205018261/entry/ets/utils/Dialer";
import { ListRow, TopicDataSource } from "@bundle:com.atomicservice.6917614059205018261/entry/ets/utils/TopicDataSource";
import { TopicCard } from "@bundle:com.atomicservice.6917614059205018261/entry/ets/components/TopicCard";
import { NativeAdCard } from "@bundle:com.atomicservice.6917614059205018261/entry/ets/components/NativeAdCard";
import { Colors } from "@bundle:com.atomicservice.6917614059205018261/entry/ets/constants/Colors";
const PAGE_SIZE: number = 10;
const AD_INSERT_POS: number = 8;
const CAPSULE_MARGIN_RIGHT: number = 96;
class TopicListPage extends ViewPU {
    constructor(m8, n8, o8, p8 = -1, q8 = undefined, r8) {
        super(m8, o8, p8, r8);
        if (typeof q8 === "function") {
            this.paramsGenerator_ = q8;
        }
        this.__dataSource = new ObservedPropertyObjectPU(new TopicDataSource(), this, "dataSource");
        this.__refreshing = new ObservedPropertySimplePU(false, this, "refreshing");
        this.__address = new ObservedPropertySimplePU('全国', this, "address");
        this.__statusBarHeight = new ObservedPropertySimplePU(0, this, "statusBarHeight");
        this.__navBarHeight = new ObservedPropertySimplePU(0, this, "navBarHeight");
        this.page = 1;
        this.pageTotal = -1;
        this.loading = false;
        this.setInitiallyProvidedValue(n8);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(l8: TopicListPage_Params) {
        if (l8.dataSource !== undefined) {
            this.dataSource = l8.dataSource;
        }
        if (l8.refreshing !== undefined) {
            this.refreshing = l8.refreshing;
        }
        if (l8.address !== undefined) {
            this.address = l8.address;
        }
        if (l8.statusBarHeight !== undefined) {
            this.statusBarHeight = l8.statusBarHeight;
        }
        if (l8.navBarHeight !== undefined) {
            this.navBarHeight = l8.navBarHeight;
        }
        if (l8.page !== undefined) {
            this.page = l8.page;
        }
        if (l8.pageTotal !== undefined) {
            this.pageTotal = l8.pageTotal;
        }
        if (l8.loading !== undefined) {
            this.loading = l8.loading;
        }
    }
    updateStateVars(k8: TopicListPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(j8) {
        this.__dataSource.purgeDependencyOnElmtId(j8);
        this.__refreshing.purgeDependencyOnElmtId(j8);
        this.__address.purgeDependencyOnElmtId(j8);
        this.__statusBarHeight.purgeDependencyOnElmtId(j8);
        this.__navBarHeight.purgeDependencyOnElmtId(j8);
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
    set dataSource(i8: TopicDataSource) {
        this.__dataSource.set(i8);
    }
    private __refreshing: ObservedPropertySimplePU<boolean>;
    get refreshing() {
        return this.__refreshing.get();
    }
    set refreshing(h8: boolean) {
        this.__refreshing.set(h8);
    }
    private __address: ObservedPropertySimplePU<string>;
    get address() {
        return this.__address.get();
    }
    set address(g8: string) {
        this.__address.set(g8);
    }
    private __statusBarHeight: ObservedPropertySimplePU<number>;
    get statusBarHeight() {
        return this.__statusBarHeight.get();
    }
    set statusBarHeight(f8: number) {
        this.__statusBarHeight.set(f8);
    }
    private __navBarHeight: ObservedPropertySimplePU<number>;
    get navBarHeight() {
        return this.__navBarHeight.get();
    }
    set navBarHeight(e8: number) {
        this.__navBarHeight.set(e8);
    }
    private page: number;
    private pageTotal: number;
    private loading: boolean;
    aboutToAppear(): void {
        this.statusBarHeight = (AppStorage.get<number>('statusBarHeight') ?? 0);
        this.navBarHeight = (AppStorage.get<number>('navBarHeight') ?? 0);
        this.loadList(true, true);
    }
    private async loadList(v7: boolean, w7: boolean): Promise<void> {
        if (this.loading) {
            return;
        }
        this.loading = true;
        try {
            const x7 = await TopicApi.list(this.page, 1, 0);
            if (x7.code === 200 && x7.data) {
                const y7: Topic[] = x7.data.data ?? [];
                this.pageTotal = x7.data.last_page ?? -1;
                const z7: ListRow[] = y7.map((c8: Topic) => {
                    const d8 = new ListRow();
                    d8.kind = 0;
                    d8.topic = c8;
                    return d8;
                });
                if (AdIds.AD_ENABLED && z7.length > 0) {
                    const a8 = await AdService.loadNativeAds(getContext(this), AdIds.nativeAdId(), 1);
                    if (a8.length > 0) {
                        const b8 = new ListRow();
                        b8.kind = 1;
                        b8.ad = a8[0];
                        z7.splice(Math.min(AD_INSERT_POS, z7.length), 0, b8);
                    }
                }
                if (w7) {
                    this.dataSource.replaceAll(z7);
                }
                else {
                    this.dataSource.append(z7);
                }
            }
            else {
                this.getUIContext().getPromptAction().showToast({ message: x7.msg ?? '加载失败' });
            }
        }
        finally {
            this.loading = false;
            if (v7) {
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
    titleBar(m7 = null) {
        this.observeComponentCreation2((t7, u7) => {
            Row.create();
            Row.width('100%');
            Row.height(this.statusBarHeight + 44);
            Row.padding({ top: this.statusBarHeight });
            Row.backgroundColor(Colors.TITLE_BAR_BG);
        }, Row);
        this.observeComponentCreation2((r7, s7) => {
            Blank.create();
            Blank.width(CAPSULE_MARGIN_RIGHT);
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((p7, q7) => {
            Text.create('工蜂元服务');
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Colors.BODY_TEXT);
            Text.textAlign(TextAlign.Center);
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((n7, o7) => {
            Blank.create();
            Blank.width(CAPSULE_MARGIN_RIGHT);
        }, Blank);
        Blank.pop();
        Row.pop();
    }
    filterBar(b7 = null) {
        this.observeComponentCreation2((k7, l7) => {
            Stack.create();
            Stack.alignContent(Alignment.Center);
            Stack.width('100%');
            Stack.height(36);
            Stack.padding({ left: 20, right: 20 });
            Stack.backgroundColor(Colors.TITLE_BAR_BG);
        }, Stack);
        this.observeComponentCreation2((i7, j7) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((g7, h7) => {
            Text.create(this.address);
            Text.fontSize(12);
            Text.fontColor(Colors.BODY_TEXT);
            Text.margin({ left: 10 });
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((e7, f7) => {
            Row.create();
            Row.width(177);
            Row.height(24);
            Row.backgroundColor(Color.White);
            Row.borderRadius(12);
        }, Row);
        this.observeComponentCreation2((c7, d7) => {
            Image.create({ "id": 16777231, "type": 20000, params: [], "bundleName": "com.atomicservice.6917614059205018261", "moduleName": "entry" });
            Image.width('100%');
            Image.height('100%');
        }, Image);
        Row.pop();
        Stack.pop();
    }
    emptyView(u6 = null) {
        this.observeComponentCreation2((z6, a7) => {
            Column.create();
            Column.width('100%');
            Column.height(400);
            Column.justifyContent(FlexAlign.Center);
        }, Column);
        this.observeComponentCreation2((x6, y6) => {
            Image.create({ "id": 16777227, "type": 20000, params: [], "bundleName": "com.atomicservice.6917614059205018261", "moduleName": "entry" });
            Image.width(130);
            Image.height(130);
            Image.margin({ bottom: 10 });
        }, Image);
        this.observeComponentCreation2((v6, w6) => {
            Text.create('暂无数据');
            Text.fontSize(14);
            Text.fontColor(Colors.BODY_TEXT);
        }, Text);
        Text.pop();
        Column.pop();
    }
    initialRender() {
        this.observeComponentCreation2((s6, t6) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor(Colors.PAGE_BG);
        }, Column);
        this.titleBar.bind(this)();
        this.filterBar.bind(this)();
        this.observeComponentCreation2((l5, m5) => {
            If.create();
            if (this.dataSource.isEmpty() && !this.loading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.emptyView.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((p6, q6) => {
                        Refresh.create({ refreshing: { value: this.refreshing, changeEvent: r6 => { this.refreshing = r6; } } });
                        Refresh.onRefreshing(() => this.onRefresh());
                        Refresh.layoutWeight(1);
                    }, Refresh);
                    this.observeComponentCreation2((n6, o6) => {
                        List.create();
                        List.width('100%');
                        List.padding({ left: 20, right: 20, bottom: this.navBarHeight });
                        List.onReachEnd(() => this.onReachEnd());
                    }, List);
                    {
                        const n5 = (r5, s5: number) => {
                            const t5 = r5;
                            {
                                const u5 = (l6, m6) => {
                                    ListItem.create(() => { }, false);
                                };
                                const v5 = () => {
                                    this.observeComponentCreation2(u5, ListItem);
                                    this.observeComponentCreation2((w5, x5) => {
                                        If.create();
                                        if (t5.kind === 0) {
                                            this.ifElseBranchUpdateFunction(0, () => {
                                                this.observeComponentCreation2((i6, j6) => {
                                                    __Common__.create();
                                                    __Common__.onClick(() => {
                                                        const k6 = t5.topic?.id;
                                                        if (k6) {
                                                            router.pushUrl({ url: 'pages/TopicDetailPage', params: { id: k6 } });
                                                        }
                                                    });
                                                }, __Common__);
                                                {
                                                    this.observeComponentCreation2((c6, d6) => {
                                                        if (d6) {
                                                            let e6 = new TopicCard(this, {
                                                                topic: t5.topic,
                                                                onContact: (h6: string) => {
                                                                    Dialer.dial(this.getUIContext(), h6);
                                                                }
                                                            }, undefined, c6, () => { }, { page: "entry/src/main/ets/pages/TopicListPage.ets", line: 173, col: 19 });
                                                            ViewPU.create(e6);
                                                            let f6 = () => {
                                                                return {
                                                                    topic: t5.topic,
                                                                    onContact: (g6: string) => {
                                                                        Dialer.dial(this.getUIContext(), g6);
                                                                    }
                                                                };
                                                            };
                                                            e6.paramsGenerator_ = f6;
                                                        }
                                                        else {
                                                            this.updateStateVarsOfChildByElmtId(c6, {});
                                                        }
                                                    }, { name: "TopicCard" });
                                                }
                                                __Common__.pop();
                                            });
                                        }
                                        else {
                                            this.ifElseBranchUpdateFunction(1, () => {
                                                {
                                                    this.observeComponentCreation2((y5, z5) => {
                                                        if (z5) {
                                                            let a6 = new NativeAdCard(this, { ad: t5.ad }, undefined, y5, () => { }, { page: "entry/src/main/ets/pages/TopicListPage.ets", line: 186, col: 19 });
                                                            ViewPU.create(a6);
                                                            let b6 = () => {
                                                                return {
                                                                    ad: t5.ad
                                                                };
                                                            };
                                                            a6.paramsGenerator_ = b6;
                                                        }
                                                        else {
                                                            this.updateStateVarsOfChildByElmtId(y5, {});
                                                        }
                                                    }, { name: "NativeAdCard" });
                                                }
                                            });
                                        }
                                    }, If);
                                    If.pop();
                                    ListItem.pop();
                                };
                                v5();
                            }
                        };
                        const o5 = (p5: ListRow, q5: number) => `${p5.kind}_${q5}_${p5.topic?.id ?? 'ad'}`;
                        LazyForEach.create("1", this, this.dataSource, n5, o5);
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
