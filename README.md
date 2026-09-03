# 工蜂 - 鸿蒙元服务（Atomic Service）

HarmonyOS 元服务客户端，ArkTS + ArkUI 原生开发，构建工具 Hvigor。

- **bundleName**: `com.atomicservice.6917614059205018261`
- **bundleType**: `atomicService`
- **兼容 API**: 5.0.0(12)，target API 24
- **设备类型**: phone / tablet
- **网络**: `https://api.ggfee.cn/mini`（`@kit.NetworkKit`）
- **存储**: `@kit.ArkData`（preferences）
- **广告**: `@kit.AdsKit`（鲸鸿动能原生广告 / Banner）

## 模块结构

```
worker-bee-atomic-service/
├── AppScope/                 # 应用级配置与资源
│   ├── app.json5             # bundleName、bundleType、version 等
│   └── resources/
├── entry/
│   └── src/main/
│       ├── ets/
│       │   ├── entryability/EntryAbility.ets
│       │   ├── pages/        # TopicListPage / TopicDetailPage
│       │   ├── components/   # TopicCard / NativeAdCard / BannerAdView
│       │   ├── services/     # HttpClient / TopicApi / AdService
│       │   ├── constants/    # AdIds / Colors
│       │   └── utils/        # Store / Dialer / TopicDataSource
│       └── resources/
├── build-profile.json5       # 工程级构建配置（签名、产品）
├── hvigorfile.ts
└── oh-package.json5
```

---

# 踩坑记录（FAQ）

> 真机调试、打包、上架审核过程中遇到的问题与解决方案，持续更新。

## 1. macOS 上 hdc 命令找不到（command not found）

**现象**：终端执行 `hdc` 报 `zsh: command not found: hdc`。

**原因**：hdc（HarmonyOS Device Connector）随 DevEco Studio 安装，**不需要用 brew 安装**（brew tap 里的 hdc 非官方且版本旧）。只是 SDK 里的 toolchains 目录没加进 PATH。

**解决**：编辑 `~/.zshrc`，追加：

```bash
export HDC_SDK_PATH="/Applications/DevEco-Studio.app/Contents/sdk/default/openharmony/toolchains"
export PATH="$HDC_SDK_PATH:$PATH"
```

然后 `source ~/.zshrc`，验证：`hdc -v`（本机 Ver: 3.2.0d）。

## 2. 多设备在线时 hdc install 报 "need connect-key"

**现象**：

```
[Fail]ExecuteCommand need connect-key? please confirm a device by help info
```

**原因**：电脑同时连着模拟器 + 真机（TCP + USB），hdc 不知道装到哪台。

**解决**：用 `-t <connectkey>` 指定设备，先用 `hdc list targets -v` 看设备：

```bash
hdc list targets -v
# FMR0224109025576   USB   Connected   ← 真机 connect key
hdc -t FMR0224109025576 app install -r xxx.app
```

**注意**：USB 设备显示 `Offline` 时，先解锁手机、确认弹窗「允许 USB 调试」、勾选「始终允许」，必要时 `hdc kill` 后重插线。

## 3. release 包 hdc 安装报 "verify app signature failed"（code:9568448）

**现象**：`hdc app install` release 签名的 `.app` 包失败，`msg:error: failed to install bundle. code:9568448 error: verify app signature failed`。

**原因**：release profile（`.p7b`）的 `app-distribution-type` 是 **`app_gallery`**——这种包**只能通过应用市场/AGC 测试分发安装，禁止 hdc 直装真机**。debug 签名的包（无 app_gallery 限制）才能 hdc 安装。

**验证方法**：解析 p7b 看分发类型：

```bash
openssl cms -inform DER -in <profile>.p7b -cmsout -print | head
# release 类型会看到 "app-distribution-type":"app_gallery"
# debug 类型没有该字段
```

**结论**：
- 真机功能调试 → 用 **debug 签名**（DevEco Signing Configs 自动签名，Run ▶ 部署）
- release 包真机验证 → 走 **AGC 测试分发**（AppGallery Connect → 测试服务 → 添加设备 UDID → 发布测试版）
- 模拟器不校验签名，可直接装 release 包

## 4. 上架审核驳回「无法打开」——根因：EntryAbility 缺 skills

**现象**：元服务软件包自检通过，但应用市场审核驳回，理由为「无法打开」。

**根因**：`entry/src/main/module.json5` 中 `EntryAbility` **缺少 `skills` 配置**。没有声明 `entity.system.home` / `action.system.home`，系统无法识别应用入口，点击桌面图标无法拉起 → 审核机表现为「打不开」。

**修复**（已在源码中修复）：

```json5
"abilities": [
  {
    "name": "EntryAbility",
    // ...
    "exported": true,
    "skills": [
      {
        "entities": ["entity.system.home"],
        "actions": ["action.system.home"]
      }
    ]
  }
]
```

**修复后必须重新构建 release 包再提交**，旧包仍是缺 skills 的版本。

### 排查时已验证、可排除的项

| 检查项 | 结果 |
|---|---|
| 包体积 | 103KB，远小于元服务 10MB 上限 |
| INTERNET 权限 | 已声明 |
| 首页/详情路由 | `main_pages.json` 路径存在 |
| 资源引用（icon/startWindow） | 全部存在 |
| 混淆配置 | 未开启，无混淆崩溃风险 |
| 启动页 loadContent 路径 | 正确 |

### 其他风险点（建议整改）

- ~~首页隐私弹窗点「不同意」会直接 `terminateSelf()` 退出，审核机可能记录为「打不开」。~~ **已整改**：接入平台隐私托管服务后，自建隐私弹窗已删除（见下节 §4.1）。

## 4.1 审核驳回「出现两个隐私弹窗」——删除自建隐私声明弹窗

**现象**：接入 AGC 平台隐私托管服务后，审核反馈「元服务出现两个隐私弹窗，影响用户体验」，要求删除自行构建的隐私声明弹窗。

**原因**：平台隐私托管服务已在系统层弹出隐私声明，代码里 `TopicListPage` 又自建了一个 `showDialog` 隐私弹窗（`aboutToAppear` 里检查 `privacy_agreed`，未同意则弹窗），导致首次打开连弹两次。

**修复**（已在源码中修复）：
1. 删除 `TopicListPage.ets` 中的 `showPrivacyDialog()`、`initAfterConsent()` 及 `privacy_agreed` 读写逻辑，`aboutToAppear` 直接 `loadList`
2. 移除不再使用的 `common`、`Store` import
3. 同步更新 `AdService.ets` / `TopicDetailPage.ets` 中「须先获得隐私协议同意」的过时注释
4. `Store.ets` 保留（`EntryAbility` 仍在 `Store.init` 使用）

**参考**：华为《标准化隐私声明托管服务FAQ》https://developer.huawei.com/consumer/cn/doc/app/50128-FAQ

## 5. 命令行 hvigor 构建注意事项

- 命令行构建需设置 `DEVECO_SDK_HOME`：`export DEVECO_SDK_HOME="/Applications/DevEco-Studio.app/Contents/sdk"`
- 直接 CLI 调用 `assembleApp` 可能报 "Task was not found"（缺少 IDE 生成的工程配置），**推荐在 DevEco Studio 内构建**（Build > Build App(s)）。
- 构建产物位置：
  - 工程级：`build/outputs/<product>/worker-bee-atomic-service-<product>-signed.app`
  - 模块级：`entry/build/<product>/outputs/default/entry-default-signed.hap`

---

## 常用命令速查

```bash
hdc list targets -v                            # 查看设备
hdc -t <connectkey> app install -r xxx.app     # 安装到指定设备（-r 覆盖）
hdc -t <connectkey> app install xxx.app        # 全新安装
hdc -t <connectkey> uninstall <bundleName>     # 卸载
hdc -t <connectkey> shell hilog -x             # 实时日志
hdc -t <connectkey> shell bm dump -a | grep <bundleName>  # 确认已安装
```

---

# 鸿蒙 4.0 适配方案

> 当前主分支基于 **HarmonyOS 5.0 / API 12**（纯血鸿蒙 / HarmonyOS NEXT），已上架。
> 用户要求兼容 **鸿蒙 4.0**，即 **HarmonyOS 4.0 / API 9~10**（兼容安卓内核阶段）。
> 这两个是不同系统分支，需要做 API 降级适配。

## 一、核心结论：必须拆出独立分支

**不建议在同一分支里同时兼容 API 12 和 API 10**，原因：

- **系统能力集不同**：API 12 的 ArkTS 严格模式、`@kit.*` 命名空间、纯血鸿蒙特有能力在 API 10 上不存在。
- **元服务模型不同**：HarmonyOS NEXT 元服务就是 `.app`（多 HAP 免安装）；鸿蒙 4.0 元服务是 `.hap` 单包、能力更受限。
- **广告 Kit 差异大**：API 10 用 `@ohos.advertising`（`ohos.advertising`），API 12 用 `@kit.AdsKit`。
- **签名/上架通道不同**：鸿蒙 4.0 走 AGC「HarmonyOS 应用/元服务（API 9~10）」，NEXT 走「HarmonyOS NEXT 应用/元服务」。

**建议做法**：从当前 `master` 切出 `feature/harmonyos4` 分支，在该分支上做 API 10 适配；主分支继续维护 NEXT 版本。

## 二、需要修改的文件清单

| 文件 | 当前（API 12） | 鸿蒙 4.0（API 10）修改 |
|---|---|---|
| `build-profile.json5` | `compatibleSdkVersion: "5.0.0(12)"` | 改为 `"4.0.0(10)"` 或 `"3.2.0(9)"` |
| `entry/src/main/module.json5` | `installationFree: true`（元服务） | 保留；`deviceTypes` 可只保留 `phone` |
| `AppScope/app.json5` | `bundleType: "atomicService"` | 保留；鸿蒙 4.0 同样支持 atomicService |
| `oh-package.json5` | `modelVersion: "5.1.1"` | 改为 `"3.1.0"` |
| 所有 `.ets` 文件 | `import { xxx } from '@kit.xxx'` | 改为 `import xxx from '@ohos.xxx'` |
| `EntryAbility.ets` | `extends UIAbility` | 保持；但 `setColorMode`、`setWindowLayoutFullScreen` API 需用兼容写法 |
| `TopicListPage.ets` | `LazyForEach` + `DataPanel` | API 10 支持，但状态变量写法可能需调整 |
| `AdService.ets` / `NativeAdCard.ets` / `BannerAdView.ets` | `@kit.AdsKit` | 改为 `@ohos.advertising`，类名/参数可能有差异 |
| `Dialer.ets` | `@kit.TelephonyKit` | 改为 `@ohos.telephony.call` |
| `Store.ets` | `@kit.ArkData` | 改为 `@ohos.data.preferences` |
| `HttpClient.ets` | `@kit.NetworkKit` | 改为 `@ohos.net.http` |

## 三、关键 API 替换示例

### 3.1 Kit 命名空间 → ohos 旧模块

```ts
// API 12（当前）
import { http } from '@kit.NetworkKit';
import { preferences } from '@kit.ArkData';
import { call } from '@kit.TelephonyKit';
import { advertising } from '@kit.AdsKit';
import { hilog } from '@kit.PerformanceAnalysisKit';

// API 10（鸿蒙 4.0）
import http from '@ohos.net.http';
import preferences from '@ohos.data.preferences';
import call from '@ohos.telephony.call';
import advertising from '@ohos.advertising';
import hilog from '@ohos.hilog';
```

### 3.2 广告 API 差异

API 10 的 `@ohos.advertising` 与 API 12 的 `@kit.AdsKit` 在类型命名、回调参数上不完全一致。

重点检查：

- `advertising.AdLoader` → API 10 可能为 `advertising.AdLoader` 或类似名称，但方法签名不同。
- `advertising.Advertisement` → API 10 可能叫 `advertising.Advertisement`。
- `AutoAdComponent` / `AdComponent`（Banner/Native 模板组件）→ API 10 可能**没有这些组件**，需要手写 `Image` + `Text` 布局。
- API 10 广告字段名可能不同（如 `adSource` / `desc` / `title` / `imgUrl`），需对照官方文档调整 `NativeAdCard.ets`。

### 3.3 窗口与沉浸式

```ts
// API 12（当前）
const win = windowStage.getMainWindowSync();
win.setWindowLayoutFullScreen(true);
const systemArea = win.getWindowAvoidArea(window.AvoidAreaType.TYPE_SYSTEM);

// API 10（鸿蒙 4.0）
const win = await windowStage.getMainWindow();
await win.setWindowLayoutFullScreen(true);
const systemArea = win.getWindowAvoidArea(window.AvoidAreaType.TYPE_SYSTEM);
```

注意 API 10 中 `getMainWindow()` 是异步的，要 `await`。

### 3.4 状态栏颜色模式

```ts
// API 12（当前）
this.context.getApplicationContext().setColorMode(ConfigurationConstant.ColorMode.COLOR_MODE_LIGHT);

// API 10（鸿蒙 4.0）
// 可能没有 setColorMode，或能力较弱；建议直接不写，或在 window 上设置 systemBar 颜色
// 若报错，尝试删除该调用
```

## 四、语法兼容性检查

API 10 的 ArkTS 编译器比 API 12 宽松，但以下写法仍需注意：

| 语法 | API 12 | API 10 |
|---|---|---|
| `??` 空值合并 | ✅ 支持 | ✅ 支持 |
| `?.` 可选链 | ✅ 支持 | ✅ 支持（部分场景有限制） |
| `readonly` 类属性 | ✅ 支持 | ⚠️ 可能不支持，需改为普通 `private` |
| `static readonly` | ✅ 支持 | ⚠️ 可能不支持 |
| `async/await` | ✅ 支持 | ✅ 支持 |
| 泛型接口/类 | ✅ 支持 | ⚠️ 部分泛型受限 |
| 函数类型参数 `() => void` | ✅ 支持 | ✅ 支持 |

建议适配时先全局替换 import，再逐文件编译排错。

## 五、推荐迁移步骤

1. **切分支**
   ```bash
   cd /Users/pange/Codes/genfee/worker-bee-atomic-service
   git checkout -b feature/harmonyos4
   ```

2. **改版本配置**
   - `build-profile.json5`：`compatibleSdkVersion` 改为 `"4.0.0(10)"`
   - `oh-package.json5`：`modelVersion` 改为 `"3.1.0"`

3. **全局替换 import 路径**
   - 把 `@kit.` 全部替换为 `@ohos.` 对应模块
   - 注意 AdsKit 在 API 10 对应 `@ohos.advertising`

4. **逐模块编译修复**
   - 在 DevEco Studio 里切 SDK 到 API 10
   - 重新 Sync / Build，按报错逐行改

5. **广告模块重点验证**
   - 原生广告字段、Banner 组件是否存在
   - 激励视频/插屏回调签名

6. **真机验证**
   - 找一台鸿蒙 4.0 真机（API 10）
   - debug 签名运行 → AGC 测试分发 → 上架

## 六、风险与建议

- **元服务能力受限**：鸿蒙 4.0 元服务的入口、卡片、后台等能力比 NEXT 弱，需确认功能是否都能保留。
- **广告收益可能降低**：API 10 广告类型和填充率与 NEXT 不同，建议评估 ROI。
- **维护两份代码**：两个分支都要维护更新，后续新功能需要双端同步。
- **优先建议**：如果目标用户大部分是 NEXT 设备，可以考虑**不上鸿蒙 4.0**，而是等待用户换机；如果必须覆盖，再按本方案拆分支。

---

**参考文档**

- HarmonyOS 4.0 / API 10 元服务开发指南：https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V2/atomic-service-development-0000001428061408-V2
- API 10 广告 Kit（Advertiser Kit）文档：https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V2/advertising-0000001449690277-V2
- NEXT 与 API 10 差异说明：https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V2/api-migration-0000001501555905-V2
