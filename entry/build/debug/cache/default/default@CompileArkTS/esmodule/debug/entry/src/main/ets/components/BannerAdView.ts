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
import { AdIds } from "@bundle:com.atomicservice.6917614059205018261/entry/ets/constants/AdIds";
export class BannerAdView extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__visibilityState = new ObservedPropertySimplePU(Visibility.None, this, "visibilityState");
        this.adParam = {
            adType: 8,
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
            refreshTime: 30000 // 轮播间隔 30s（允许范围 30000~120000）
        };
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: BannerAdView_Params) {
        if (params.visibilityState !== undefined) {
            this.visibilityState = params.visibilityState;
        }
        if (params.adParam !== undefined) {
            this.adParam = params.adParam;
        }
        if (params.adOptions !== undefined) {
            this.adOptions = params.adOptions;
        }
        if (params.displayOptions !== undefined) {
            this.displayOptions = params.displayOptions;
        }
    }
    updateStateVars(params: BannerAdView_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__visibilityState.purgeDependencyOnElmtId(rmElmtId);
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
    set visibilityState(newValue: Visibility) {
        this.__visibilityState.set(newValue);
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
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (AdIds.AD_ENABLED) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                        Row.aspectRatio(360 / 57);
                        Row.visibility(this.visibilityState);
                    }, Row);
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new AutoAdComponent(this, {
                                    adParam: this.adParam,
                                    adOptions: this.adOptions,
                                    displayOptions: this.displayOptions,
                                    interactionListener: {
                                        onStatusChanged: (status: string) => {
                                            hilog.info(0x0000, 'WorkerBeeAd', 'banner status %{public}s', status);
                                            // 用户关闭或加载失败时隐藏占位，避免留下空白区域
                                            if (status === 'onAdClose' || status === 'onAdFail') {
                                                this.visibilityState = Visibility.None;
                                            }
                                        }
                                    }
                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/components/BannerAdView.ets", line: 38, col: 9 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        adParam: this.adParam,
                                        adOptions: this.adOptions,
                                        displayOptions: this.displayOptions,
                                        interactionListener: {
                                            onStatusChanged: (status: string) => {
                                                hilog.info(0x0000, 'WorkerBeeAd', 'banner status %{public}s', status);
                                                // 用户关闭或加载失败时隐藏占位，避免留下空白区域
                                                if (status === 'onAdClose' || status === 'onAdFail') {
                                                    this.visibilityState = Visibility.None;
                                                }
                                            }
                                        }
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
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
