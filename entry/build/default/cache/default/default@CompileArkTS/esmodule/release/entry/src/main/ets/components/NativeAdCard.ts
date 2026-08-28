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
    constructor(j1, k1, l1, m1 = -1, n1 = undefined, o1) {
        super(j1, l1, m1, o1);
        if (typeof n1 === "function") {
            this.paramsGenerator_ = n1;
        }
        this.ad = null;
        this.displayOptions = {
            mute: true
        };
        this.setInitiallyProvidedValue(k1);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(i1: NativeAdCard_Params) {
        if (i1.ad !== undefined) {
            this.ad = i1.ad;
        }
        if (i1.displayOptions !== undefined) {
            this.displayOptions = i1.displayOptions;
        }
    }
    updateStateVars(h1: NativeAdCard_Params) {
    }
    purgeVariableDependenciesOnElmtId(g1) {
    }
    aboutToBeDeleted() {
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private ad: advertising.Advertisement | null;
    private displayOptions: advertising.AdDisplayOptions;
    initialRender() {
        this.observeComponentCreation2((u, v) => {
            If.create();
            if (this.ad !== null) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((e1, f1) => {
                        Column.create();
                        Column.width('100%');
                        Column.margin({ bottom: 10 });
                        Column.backgroundColor(Color.White);
                        Column.borderRadius(8);
                        Column.clip(true);
                    }, Column);
                    this.observeComponentCreation2((c1, d1) => {
                        __Common__.create();
                        __Common__.width('100%');
                        __Common__.height(240);
                    }, __Common__);
                    {
                        this.observeComponentCreation2((w, x) => {
                            if (x) {
                                let y = new AdComponent(this, {
                                    ads: [this.ad as advertising.Advertisement],
                                    displayOptions: this.displayOptions,
                                    interactionListener: {
                                        onStatusChanged: (b1: string) => {
                                            hilog.info(0x0000, 'WorkerBeeAd', 'native ad status %{public}s', b1);
                                        }
                                    }
                                }, undefined, w, () => { }, { page: "entry/src/main/ets/components/NativeAdCard.ets", line: 18, col: 9 });
                                ViewPU.create(y);
                                let z = () => {
                                    return {
                                        ads: [this.ad as advertising.Advertisement],
                                        displayOptions: this.displayOptions,
                                        interactionListener: {
                                            onStatusChanged: (a1: string) => {
                                                hilog.info(0x0000, 'WorkerBeeAd', 'native ad status %{public}s', a1);
                                            }
                                        }
                                    };
                                };
                                y.paramsGenerator_ = z;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(w, {});
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
