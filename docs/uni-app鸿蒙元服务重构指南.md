# uni-app → 鸿蒙元服务 重构指南与踩坑记录

> 沉淀自「工蜂元服务」实战（2026-07-30 ~ 08-11），用于下次把 uni-app 项目搬到鸿蒙元服务时直接对照执行。
> 版本：v1.0

---

## 0. 路线决策（先看这个，30 秒定方向）

```
你的 uni-app 项目要上鸿蒙
│
├─ 需要广告变现 / 原生能力(ArkTS Kit) / 支付以外的高级能力？
│   ├─ 是 → 【路线 B：原生 ArkTS 元服务】（uni-app ASCF 没有任何广告 API，无绕行通道）
│   └─ 否 → 【路线 A：uni-app 直接编译元服务】（复用 90%+ 代码）
│
└─ 目标是鸿蒙"应用"(App) 而不是元服务？
    └─ 注意：鸿蒙 App 线仅支持 Vue 3（Vue 2 直接报"尚不支持鸿蒙平台"）
```

**关键事实**：元服务（mp-harmony）≠ 鸿蒙应用（app-harmony）。前者是免安装轻量形态（对标小程序），支持 Vue2（alpha 编译器）/Vue3；后者仅支持 Vue3。

---

## 1. 路线 A：uni-app 直接编译元服务（ASCF）

### 1.1 适用与硬限制

- 适用：纯展示/表单/接口类业务，无广告、无 UTS 插件、无 `plus.*` 调用
- 硬限制：单包 ≤2MB / 总包 ≤10MB（可申请放宽到 20MB）；单 Ability；**禁 so 文件**；无胶囊位置 API；`uni.createAnimation`、激励视频等广告 API 未实现；平板/折叠屏有黑边（平台行为）
- 编译期出现 `xxx is not defined` = 该 API 未实现，用 `#ifdef MP-HARMONY` 隔离规避

### 1.2 操作步骤

1. **工具链**：HBuilderX 4.51+ + DevEco Studio 5.1.1+（HBuilderX 要调它的鸿蒙工具链）；模拟器镜像 API 19+
2. **AGC**：注册元服务拿包名 `com.atomicservice.[APPID]` → **当天启动 ICP 备案**（1~3 周，关键路径）
3. **manifest.json** 加 `mp-harmony.distribute.bundleName`（可视化视图"鸿蒙元服务配置"填写等价）
4. **页面裁剪**（如需简化首版）：`pages.json` 支持条件编译——把不要的页面注册包进 `// #ifndef MP-HARMONY`，源文件保留；页面内入口用 `<!-- #ifndef MP-HARMONY -->` 隐藏，并逐个 grep 确认无残留 `navigateTo` 可达路径
5. **平台差异适配**：导航栏用 `statusBarHeight` + 固定高度（无胶囊）；`uni.uploadFile` 参数必须全字符串；`uni.makePhoneCall` 包 try/catch + fail 降级为"弹窗展示号码 + `setClipboardData` 复制"
6. **登录**（如需要）：`uni.login({ provider: 'huawei' })` 拿 code；`<button open-type="getPhoneNumber">` 回调给的是 **`e.detail.code`**（不是微信的 encrypted_data/iv），后端用 code 去华为服务端换手机号。**禁止自建登录页；必须提供注销账号入口**
7. **元服务专属配置目录是 `harmony-mp-configs/`（不是 harmony-configs）**：权限在 `entry/src/main/module.json5`，图标在 `AppScope/resources/base/media/app_icon.png`
8. **发行**：HBuilderX → 发行 → 鸿蒙元服务

### 1.3 升级 Vue 3 要点（Vue2 项目必做）

1. `manifest.json`：`vueVersion: "2"` → `"3"`
2. `main.js`：`Vue.prototype.$xxx` 包进 `#ifndef VUE3`；VUE3 分支用 `app.config.globalProperties.$xxx`（注意函数若是 const 声明，注册代码要在调用闭包内，避免 TDZ）
3. 清理 Vue2 专属写法：`value + $emit('input')` 的 v-model 组件、filters、`.sync`、`$listeners`、`$set/$delete`、`slot-scope`——全量 grep 一遍
4. 升完**微信端必须冒烟**（列表/登录/上传/拨号）

---

## 2. 路线 B：原生 ArkTS 元服务（可接广告）

### 2.1 工程骨架（DevEco Studio 创建 Atomic Service 工程）

```
AppScope/app.json5          # bundleType: "atomicService" + 包名 + 512 图标
build-profile.json5         # signingConfigs（复用已有发布证书）
entry/src/main/module.json5 # requestPermissions: 只声明真实用到的（隐私协议严格一致）
entry/src/main/ets/         # pages/ services/ components/ utils/
```

### 2.2 uni-app → ArkTS API 映射表

| uni-app | ArkTS | 备注 |
|---|---|---|
| `uni.request` | `@kit.NetworkKit` `http.createHttp()` | 需 `ohos.permission.INTERNET`；**查询参数拼进路径字符串，别用对象字面量**（见踩坑 3.4） |
| `uni.getStorageSync` 系列 | `@kit.ArkData` `preferences` | getSync/putSync + flush |
| `uni.makePhoneCall` | `@kit.TelephonyKit` `call.makeCall()` | 三方元服务可能受限 → try/catch + 降级：`pasteboard` 复制号码弹窗 |
| `uni.getSystemInfoSync().statusBarHeight` | `window.getWindowAvoidArea(TYPE_SYSTEM).topRect.height` + `px2vp` | EntryAbility 里存 AppStorage，页面 padding top |
| `uni.navigateTo` | `@kit.ArkUI` `router.pushUrl({ url, params })` | 页面注册在 `resources/base/profile/main_pages.json` |
| `uni.showToast/showModal/showDialog` | `uiContext.getPromptAction().showToast/showDialog` | |
| 下拉刷新 / 上拉加载 | `Refresh({refreshing: $$this.x})` / `List.onReachEnd` | |
| rpx 换算 | rpx / 2 ≈ vp（750 设计稿 ↔ 360vp） | 字号用 fp |

### 2.3 鲸鸿动能广告接入（Ads Kit）

```ts
import { advertising, AdComponent, AutoAdComponent } from '@kit.AdsKit'; // 组件必须显式 import！

// 请求：元服务 SDK 只有三参回调形式，无 Promise 重载
const loader = new advertising.AdLoader(context);
loader.loadAd(params, options, listener); // listener: AdLoadListener{ onAdLoadSuccess, onAdLoadFailure }
```

- **广告形式**：原生（`AdComponent`，adType=3）混信息流；Banner（`AutoAdComponent`，自动请求/轮播/上报）；激励视频（adType=7）需服务器回调发奖
- **测试广告位 ID**：原生大图 `testu7m3hc4gvm`、原生视频 `testy63txaom86`、Banner `testw6vs28auh3`、激励 `testx9dtjwj8hp`
- **工程里留 `AD_ENABLED` 总开关 + 测试/正式 ID 切换常量**，验收/审核出问题一键关

**业务侧流程（与代码并行办）**：企业实名认证 → 开通商户服务 → 签《鲸鸿动能媒体服务协议》→ 鲸鸿动能媒体服务平台创建媒体（AGC 有 APPID 即可，不用等上架）→ 创建展示位拿正式 ID → 测试 ID 调测 → 华为验收 → 换正式 ID 上线。

---

## 3. 踩坑记录（按阶段）

### 3.1 证书与签名

| 坑 | 解法 |
|---|---|
| `11014001 Key alias not found: {releaseKey}` | 别凭习惯填别名！`keytool -list -keystore xxx.p12 -storetype pkcs12` 查真实别名（本次真实别名是 `genfee`） |
| DevEco 自动申请/生成的密码是 76 位 HEX 加密串 | 可直接填进配置，但 **p12 旁边的 `material/` 目录必须跟着走**，否则解密失败 |
| 调试证书 vs 发布证书 | 两套不混用；自动签名仅供调试**不能上架**；联调用调试证书（HBuilderX/DevEco 可自动申请），提审用发布证书 |
| 登录/手机号调不通 | 排查顺序：非自动签名 → AGC 配了公钥指纹（应用级）→ module.json5 的 client_id 是**应用级**（非项目级）→ 手机号敏感权限已获批 → 真机「设置-应用与元服务」移除应用重试 |

### 3.2 元服务平台限制（编译器/文档双重确认）

- **`identifier`/`getOAID` 元服务禁用** → 广告只能非个性化投放（eCPM 低些）；**不要声明 `APP_TRACKING_CONSENT` 权限**（权限与隐私协议必须严格一致，声明用不了的权限会被打回）
- **模拟器不出广告**（不是代码问题），广告联调必须真机；模拟器上广告位空白/隐藏属预期
- 元服务图标必须 512×512，且上架要用华为标准图标底板生成（DevEco Image Asset），位置 `AppScope/resources/base/media/app_icon.png`
- 元服务上架仅中国大陆；需 ICP 备案

### 3.3 uni-app ASCF 特有

- "vue 2 项目尚不支持鸿蒙平台" = 你走了鸿蒙 App 线；元服务线 Vue2 也行（alpha 编译器），但**建议直接升 Vue3**，两条产物线全通
- 条件编译标识：`MP-HARMONY`；`pages.json` 也支持条件编译
- 元服务登录回调字段与微信不同（见 1.2-6）

### 3.4 ArkTS 严格模式

| 坑 | 解法 |
|---|---|
| `arkts-no-untyped-obj-literals` | 对象字面量必须对应显式声明的 interface/class；`Record<string, string\|number>` 标注在部分 SDK 版本也不认 → **接口查询参数一律拼字符串**，最稳 |
| `AdLoader.loadAd Expected 3 arguments, but got 2` | 元服务 SDK 无 Promise 重载，自己用 `new Promise` 包三参回调 |
| `Cannot find name 'AdComponent'` | `import { AdComponent, AutoAdComponent } from '@kit.AdsKit'` 显式导入 |
| 接口返回 `void` 类型连锁报错 | 都是 loadAd 签名错的连锁反应，改回调形式后全消 |

### 3.5 广告合规（驳回高发区）

- **隐私协议弹窗先行**：首启弹窗，用户同意前不得请求数据/广告；不同意则退出（`terminateSelf()`）
- 每次广告请求只能展示一次；信息流广告每批数据重新请求 1 条新的，**不要复用同一个广告对象多处展示**
- 禁止定时器循环请求；`onError` 后除激励视频（可重试 1 次）外不要重试
- 广告必须有关闭按钮；素材等比展示；背景不可点
- 上架注意"功能过于简单"驳回风险：保留一个完整业务闭环（浏览→详情→联系），必要时先恢复一个辅助页面（如地区筛选）

---

## 4. 上线检查清单

**AGC / 业务侧**
- [ ] 元服务已注册，包名 `com.atomicservice.[APPID]`
- [ ] ICP 备案已启动/完成
- [ ] httpRequest 合法域名已配置（API 域名）
- [ ] 发布证书三件套（p12/cer/p7b）+ keytool 核对别名 + material 目录在位
- [ ] （接广告）商户服务开通 + 媒体服务协议签署 + 展示位创建
- [ ] 隐私政策含鸿蒙平台描述，声明权限 = 代码实际申请权限
- [ ] 512×512 标准底板图标

**代码侧**
- [ ] 无 `plus.*` / `wx.*` 直接引用（grep 一遍）
- [ ] 条件编译 `#ifdef/#ifndef` 与 `#endif` 数量配对（grep -c 核对）
- [ ] 被下线页面无任何运行时入口可达
- [ ] 注销账号入口（有登录体系时）
- [ ] 广告 `AD_ENABLED` 开关存在，测试/正式 ID 已切换

**真机验证**
- [ ] 列表 → 详情 → 核心动作（拨号/提交）
- [ ] 下拉刷新 / 上拉加载
- [ ] 广告展示、关闭按钮、点击跳转
- [ ] 隐私弹窗"不同意"路径

---

## 5. 参考

- uni-app 元服务文档：`https://uniapp.dcloud.io/tutorial/mp-harmony/intro`
- 华为元服务分包/约束：`https://developer.huawei.com/consumer/cn/doc/atomic-guides/atomic-subcontract-V14`
- AGC 发布元服务准备：`https://developer.huawei.com/consumer/cn/doc/App/agc-help-release-atomic-prepare-0000002327610825`
- 鲸鸿动能流量变现：`https://developer.huawei.com/consumer/cn/monetize`
- 本项目完整过程文档：`docs/华为元服务改造开发文档.md`、`docs/鸿蒙元服务原生重构方案.md`
