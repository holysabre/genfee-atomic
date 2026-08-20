if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface NativeAdCard_Params {
    ad?: advertising.Advertisement | null;
    displayOptions?: advertising.AdDisplayOptions;
}
import type advertising from "@ohos:advertising";
import { AdComponent } from "@ohos:advertising.AdComponent";
import hilog from "@ohos:hilog";
export class NativeAdCard extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.ad = null;
        this.displayOptions = {
            mute: true
        };
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: NativeAdCard_Params) {
        if (params.ad !== undefined) {
            this.ad = params.ad;
        }
        if (params.displayOptions !== undefined) {
            this.displayOptions = params.displayOptions;
        }
    }
    updateStateVars(params: NativeAdCard_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
    }
    aboutToBeDeleted() {
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private ad: advertising.Advertisement | null;
    private displayOptions: advertising.AdDisplayOptions;
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.ad !== null) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.margin({ bottom: 10 });
                        Column.backgroundColor(Color.White);
                        Column.borderRadius(8);
                        Column.clip(true);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        __Common__.create();
                        __Common__.width('100%');
                        __Common__.height(240);
                    }, __Common__);
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new AdComponent(this, {
                                    ads: [this.ad as advertising.Advertisement],
                                    displayOptions: this.displayOptions,
                                    interactionListener: {
                                        onStatusChanged: (status: string) => {
                                            hilog.info(0x0000, 'WorkerBeeAd', 'native ad status %{public}s', status);
                                        }
                                    }
                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/components/NativeAdCard.ets", line: 18, col: 9 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        ads: [this.ad as advertising.Advertisement],
                                        displayOptions: this.displayOptions,
                                        interactionListener: {
                                            onStatusChanged: (status: string) => {
                                                hilog.info(0x0000, 'WorkerBeeAd', 'native ad status %{public}s', status);
                                            }
                                        }
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                        }, { name: "AdComponent" });
                    }
                    __Common__.pop();
                    Column.pop();
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
