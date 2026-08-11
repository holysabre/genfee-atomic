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
const AD_INSERT_POS: number = 8;
class TopicListPage extends ViewPU {
    constructor(k9, l9, m9, n9 = -1, o9 = undefined, p9) {
        super(k9, m9, n9, p9);
        if (typeof o9 === "function") {
            this.paramsGenerator_ = o9;
        }
        this.__dataSource = new ObservedPropertyObjectPU(new TopicDataSource(), this, "dataSource");
        this.__refreshing = new ObservedPropertySimplePU(false, this, "refreshing");
        this.__address = new ObservedPropertySimplePU('全国', this, "address");
        this.__statusBarHeight = new ObservedPropertySimplePU(0, this, "statusBarHeight");
        this.page = 1;
        this.pageTotal = -1;
        this.loading = false;
        this.setInitiallyProvidedValue(l9);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(j9: TopicListPage_Params) {
        if (j9.dataSource !== undefined) {
            this.dataSource = j9.dataSource;
        }
        if (j9.refreshing !== undefined) {
            this.refreshing = j9.refreshing;
        }
        if (j9.address !== undefined) {
            this.address = j9.address;
        }
        if (j9.statusBarHeight !== undefined) {
            this.statusBarHeight = j9.statusBarHeight;
        }
        if (j9.page !== undefined) {
            this.page = j9.page;
        }
        if (j9.pageTotal !== undefined) {
            this.pageTotal = j9.pageTotal;
        }
        if (j9.loading !== undefined) {
            this.loading = j9.loading;
        }
    }
    updateStateVars(i9: TopicListPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(h9) {
        this.__dataSource.purgeDependencyOnElmtId(h9);
        this.__refreshing.purgeDependencyOnElmtId(h9);
        this.__address.purgeDependencyOnElmtId(h9);
        this.__statusBarHeight.purgeDependencyOnElmtId(h9);
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
    set dataSource(g9: TopicDataSource) {
        this.__dataSource.set(g9);
    }
    private __refreshing: ObservedPropertySimplePU<boolean>;
    get refreshing() {
        return this.__refreshing.get();
    }
    set refreshing(f9: boolean) {
        this.__refreshing.set(f9);
    }
    private __address: ObservedPropertySimplePU<string>;
    get address() {
        return this.__address.get();
    }
    set address(e9: string) {
        this.__address.set(e9);
    }
    private __statusBarHeight: ObservedPropertySimplePU<number>;
    get statusBarHeight() {
        return this.__statusBarHeight.get();
    }
    set statusBarHeight(d9: number) {
        this.__statusBarHeight.set(d9);
    }
    private page: number;
    private pageTotal: number;
    private loading: boolean;
    aboutToAppear(): void {
        this.statusBarHeight = (AppStorage.get<number>('statusBarHeight') ?? 0);
        if (Store.getBool('privacy_agreed', false)) {
            this.loadList(true, true);
        }
        else {
            this.showPrivacyDialog();
        }
    }
    private showPrivacyDialog(): void {
        this.getUIContext().getPromptAction().showDialog({
            title: '用户协议与隐私政策',
            message: '感谢您使用工蜂招工找活平台。我们将严格遵守法律法规，保护您的个人信息安全。' +
                '我们会基于网络状态加载招聘信息，并在您同意后展示广告内容。请您仔细阅读并同意《用户协议》和《隐私政策》后继续使用。',
            buttons: [
                { text: '同意', color: '#FFC900' },
                { text: '不同意', color: '#888888' }
            ]
        }).then((c9) => {
            if (c9.index === 0) {
                Store.putBool('privacy_agreed', true);
                this.initAfterConsent();
            }
            else {
                (getContext(this) as common.UIAbilityContext).terminateSelf();
            }
        });
    }
    private async initAfterConsent(): Promise<void> {
        this.loadList(true, true);
    }
    private async loadList(t8: boolean, u8: boolean): Promise<void> {
        if (this.loading) {
            return;
        }
        this.loading = true;
        try {
            const v8 = await TopicApi.list(this.page, 1, 0);
            if (v8.code === 200 && v8.data) {
                const w8: Topic[] = v8.data.data ?? [];
                this.pageTotal = v8.data.last_page ?? -1;
                const x8: ListRow[] = w8.map((a9: Topic) => {
                    const b9 = new ListRow();
                    b9.kind = 0;
                    b9.topic = a9;
                    return b9;
                });
                if (AdIds.AD_ENABLED && x8.length > 0) {
                    const y8 = await AdService.loadNativeAds(getContext(this), AdIds.nativeAdId(), 1);
                    if (y8.length > 0) {
                        const z8 = new ListRow();
                        z8.kind = 1;
                        z8.ad = y8[0];
                        x8.splice(Math.min(AD_INSERT_POS, x8.length), 0, z8);
                    }
                }
                if (u8) {
                    this.dataSource.replaceAll(x8);
                }
                else {
                    this.dataSource.append(x8);
                }
            }
            else {
                this.getUIContext().getPromptAction().showToast({ message: v8.msg ?? '加载失败' });
            }
        }
        finally {
            this.loading = false;
            if (t8) {
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
    headerBar(a8 = null) {
        this.observeComponentCreation2((r8, s8) => {
            Column.create();
            Column.width('100%');
            Column.padding({ top: this.statusBarHeight });
            Column.backgroundColor('#B0CBEB');
        }, Column);
        this.observeComponentCreation2((p8, q8) => {
            Row.create();
            Row.width('100%');
            Row.height(38);
            Row.padding({ left: 10, right: 10 });
        }, Row);
        this.observeComponentCreation2((n8, o8) => {
            Image.create({ "id": 16777225, "type": 20000, params: [], "bundleName": "com.atomicservice.6917612394359487010", "moduleName": "entry" });
            Image.width(30);
            Image.height(30);
            Image.borderRadius(15);
            Image.margin({ right: 8 });
        }, Image);
        this.observeComponentCreation2((l8, m8) => {
            Text.create('工蜂招工找活平台');
            Text.fontSize(14);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#222222');
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((j8, k8) => {
            Stack.create();
            Stack.alignContent(Alignment.Center);
            Stack.width('100%');
            Stack.height(36);
        }, Stack);
        this.observeComponentCreation2((h8, i8) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((f8, g8) => {
            Text.create(this.address);
            Text.fontSize(12);
            Text.fontColor('#222222');
            Text.margin({ left: 10 });
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((d8, e8) => {
            Row.create();
            Row.width(177);
            Row.height(24);
            Row.backgroundColor(Color.White);
            Row.borderRadius(12);
        }, Row);
        this.observeComponentCreation2((b8, c8) => {
            Image.create({ "id": 16777230, "type": 20000, params: [], "bundleName": "com.atomicservice.6917612394359487010", "moduleName": "entry" });
            Image.width('100%');
            Image.height('100%');
        }, Image);
        Row.pop();
        Stack.pop();
        Column.pop();
    }
    emptyView(t7 = null) {
        this.observeComponentCreation2((y7, z7) => {
            Column.create();
            Column.width('100%');
            Column.height(400);
            Column.justifyContent(FlexAlign.Center);
        }, Column);
        this.observeComponentCreation2((w7, x7) => {
            Image.create({ "id": 16777226, "type": 20000, params: [], "bundleName": "com.atomicservice.6917612394359487010", "moduleName": "entry" });
            Image.width(130);
            Image.height(130);
            Image.margin({ bottom: 10 });
        }, Image);
        this.observeComponentCreation2((u7, v7) => {
            Text.create('暂无数据');
            Text.fontSize(14);
            Text.fontColor('#333333');
        }, Text);
        Text.pop();
        Column.pop();
    }
    initialRender() {
        this.observeComponentCreation2((r7, s7) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#B0CBEB');
        }, Column);
        this.headerBar.bind(this)();
        this.observeComponentCreation2((k6, l6) => {
            If.create();
            if (this.dataSource.isEmpty() && !this.loading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.emptyView.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((o7, p7) => {
                        Refresh.create({ refreshing: { value: this.refreshing, changeEvent: q7 => { this.refreshing = q7; } } });
                        Refresh.onRefreshing(() => this.onRefresh());
                        Refresh.layoutWeight(1);
                    }, Refresh);
                    this.observeComponentCreation2((m7, n7) => {
                        List.create();
                        List.width('100%');
                        List.padding({ left: 20, right: 20 });
                        List.onReachEnd(() => this.onReachEnd());
                    }, List);
                    {
                        const m6 = (q6, r6: number) => {
                            const s6 = q6;
                            {
                                const t6 = (k7, l7) => {
                                    ListItem.create(() => { }, false);
                                };
                                const u6 = () => {
                                    this.observeComponentCreation2(t6, ListItem);
                                    this.observeComponentCreation2((v6, w6) => {
                                        If.create();
                                        if (s6.kind === 0) {
                                            this.ifElseBranchUpdateFunction(0, () => {
                                                this.observeComponentCreation2((h7, i7) => {
                                                    __Common__.create();
                                                    __Common__.onClick(() => {
                                                        const j7 = s6.topic?.id;
                                                        if (j7) {
                                                            router.pushUrl({ url: 'pages/TopicDetailPage', params: { id: j7 } });
                                                        }
                                                    });
                                                }, __Common__);
                                                {
                                                    this.observeComponentCreation2((b7, c7) => {
                                                        if (c7) {
                                                            let d7 = new TopicCard(this, {
                                                                topic: s6.topic,
                                                                onContact: (g7: string) => {
                                                                    Dialer.dial(this.getUIContext(), g7);
                                                                }
                                                            }, undefined, b7, () => { }, { page: "entry/src/main/ets/pages/TopicListPage.ets", line: 197, col: 19 });
                                                            ViewPU.create(d7);
                                                            let e7 = () => {
                                                                return {
                                                                    topic: s6.topic,
                                                                    onContact: (f7: string) => {
                                                                        Dialer.dial(this.getUIContext(), f7);
                                                                    }
                                                                };
                                                            };
                                                            d7.paramsGenerator_ = e7;
                                                        }
                                                        else {
                                                            this.updateStateVarsOfChildByElmtId(b7, {});
                                                        }
                                                    }, { name: "TopicCard" });
                                                }
                                                __Common__.pop();
                                            });
                                        }
                                        else {
                                            this.ifElseBranchUpdateFunction(1, () => {
                                                {
                                                    this.observeComponentCreation2((x6, y6) => {
                                                        if (y6) {
                                                            let z6 = new NativeAdCard(this, { ad: s6.ad }, undefined, x6, () => { }, { page: "entry/src/main/ets/pages/TopicListPage.ets", line: 210, col: 19 });
                                                            ViewPU.create(z6);
                                                            let a7 = () => {
                                                                return {
                                                                    ad: s6.ad
                                                                };
                                                            };
                                                            z6.paramsGenerator_ = a7;
                                                        }
                                                        else {
                                                            this.updateStateVarsOfChildByElmtId(x6, {});
                                                        }
                                                    }, { name: "NativeAdCard" });
                                                }
                                            });
                                        }
                                    }, If);
                                    If.pop();
                                    ListItem.pop();
                                };
                                u6();
                            }
                        };
                        const n6 = (o6: ListRow, p6: number) => `${o6.kind}_${p6}_${o6.topic?.id ?? 'ad'}`;
                        LazyForEach.create("1", this, this.dataSource, m6, n6);
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
