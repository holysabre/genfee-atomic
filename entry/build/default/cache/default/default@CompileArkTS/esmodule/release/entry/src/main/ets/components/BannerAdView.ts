if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface BannerAdView_Params {
    visibilityState?: Visibility;
    adParam?: advertising.AdRequestParams;
    adOptions?: advertising.AdOptions;
    displayOptions?: advertising.AdDisplayOptions;
}
import type advertising from "@ohos:advertising";
import { AutoAdComponent } from "@ohos:advertising.AutoAdComponent";
import hilog from "@ohos:hilog";
import { AdIds } from "@bundle:com.atomicservice.6917612394359487010/entry/ets/constants/AdIds";
export class BannerAdView extends ViewPU {
    constructor(o, p, q, r = -1, s = undefined, t) {
        super(o, q, r, t);
        if (typeof s === "function") {
            this.paramsGenerator_ = s;
        }
        this.__visibilityState = new ObservedPropertySimplePU(Visibility.None, this, "visibilityState");
        this.adParam = {
            adType: 0,
            adId: AdIds.bannerAdId(),
            adWidth: 360,
            adHeight: 57
        };
        this.adOptions = {
            allowMobileTraffic: 0,
            tagForChildProtection: -1,
            tagForUnderAgeOfPromise: -1,
            adContentClassification: 'A'
        };
        this.displayOptions = {
            refreshTime: 30000
        };
        this.setInitiallyProvidedValue(p);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(n: BannerAdView_Params) {
        if (n.visibilityState !== undefined) {
            this.visibilityState = n.visibilityState;
        }
        if (n.adParam !== undefined) {
            this.adParam = n.adParam;
        }
        if (n.adOptions !== undefined) {
            this.adOptions = n.adOptions;
        }
        if (n.displayOptions !== undefined) {
            this.displayOptions = n.displayOptions;
        }
    }
    updateStateVars(m: BannerAdView_Params) {
    }
    purgeVariableDependenciesOnElmtId(l) {
        this.__visibilityState.purgeDependencyOnElmtId(l);
    }
    aboutToBeDeleted() {
        this.__visibilityState.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __visibilityState: ObservedPropertySimplePU<Visibility>;
    get visibilityState() {
        return this.__visibilityState.get();
    }
    set visibilityState(k: Visibility) {
        this.__visibilityState.set(k);
    }
    private adParam: advertising.AdRequestParams;
    private adOptions: advertising.AdOptions;
    private displayOptions: advertising.AdDisplayOptions;
    aboutToAppear(): void {
        if (AdIds.AD_ENABLED) {
            this.visibilityState = Visibility.Visible;
        }
    }
    initialRender() {
        this.observeComponentCreation2((a, b) => {
            If.create();
            if (AdIds.AD_ENABLED) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((i, j) => {
                        Row.create();
                        Row.width('100%');
                        Row.aspectRatio(360 / 57);
                        Row.visibility(this.visibilityState);
                    }, Row);
                    {
                        this.observeComponentCreation2((c, d) => {
                            if (d) {
                                let e = new AutoAdComponent(this, {
                                    adParam: this.adParam,
                                    adOptions: this.adOptions,
                                    displayOptions: this.displayOptions,
                                    interactionListener: {
                                        onStatusChanged: (h: string) => {
                                            hilog.info(0x0000, 'WorkerBeeAd', 'banner status %{public}s', h);
                                            if (h === 'onAdClose' || h === 'onAdFail') {
                                                this.visibilityState = Visibility.None;
                                            }
                                        }
                                    }
                                }, undefined, c, () => { }, { page: "entry/src/main/ets/components/BannerAdView.ets", line: 39, col: 9 });
                                ViewPU.create(e);
                                let f = () => {
                                    return {
                                        adParam: this.adParam,
                                        adOptions: this.adOptions,
                                        displayOptions: this.displayOptions,
                                        interactionListener: {
                                            onStatusChanged: (g: string) => {
                                                hilog.info(0x0000, 'WorkerBeeAd', 'banner status %{public}s', g);
                                                if (g === 'onAdClose' || g === 'onAdFail') {
                                                    this.visibilityState = Visibility.None;
                                                }
                                            }
                                        }
                                    };
                                };
                                e.paramsGenerator_ = f;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(c, {});
                            }
                        }, { name: "AutoAdComponent" });
                    }
                    Row.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
