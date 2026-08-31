# 工蜂元服务 - 鸿蒙元服务（Atomic Service）

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
