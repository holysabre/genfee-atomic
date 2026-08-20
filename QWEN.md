# 工蜂招工找活平台 - 鸿蒙元服务

## 项目概述

本项目是「工蜂招工找活平台」的 **HarmonyOS 元服务（Atomic Service）** 客户端，使用 **ArkTS + ArkUI** 原生开发，构建工具为 **Hvigor**。

项目从原有小程序迁移而来，目标是在鸿蒙系统上以“元服务”形态提供轻量、免安装的招工/找活信息浏览体验。当前仅包含基础的信息流列表与详情页，并在列表信息流和详情页底部接入了鲸鸿动能广告。

### 主要技术与架构

| 维度 | 技术 |
|---|---|
| 编程语言 | ArkTS（TypeScript 超集） |
| UI 框架 | ArkUI（声明式 UI） |
| 运行形态 | HarmonyOS Atomic Service（元服务） |
| 构建工具 | Hvigor（`@ohos/hvigor-ohos-plugin`） |
| 兼容 API 版本 | 5.0.0(12) |
| 设备类型 | phone、tablet |
| 网络请求 | `@kit.NetworkKit`（`@ohos.net.http`） |
| 本地存储 | `@kit.ArkData`（`preferences`） |
| 广告 | `@kit.AdsKit`（鲸鸿动能原生广告 / Banner 广告） |
| 包名 | `com.atomicservice.6917612394359487010` |

### 模块结构

```
worker-bee-atomic-service/
├── AppScope/                 # 应用级配置与资源
│   ├── app.json5             # 应用元数据（bundleName、bundleType、version 等）
│   └── resources/            # 应用级图标、字符串、颜色
├── entry/                    # 入口模块（entry）
│   ├── src/main/ets/         # ArkTS 源码
│   │   ├── components/       # 可复用 UI 组件
│   │   │   ├── BannerAdView.ets
│   │   │   ├── NativeAdCard.ets
│   │   │   └── TopicCard.ets
│   │   ├── constants/        # 常量配置
│   │   │   └── AdIds.ets     # 广告位 ID 配置（测试/正式开关）
│   │   ├── entryability/     # Ability
│   │   │   └── EntryAbility.ets
│   │   ├── pages/            # 页面
│   │   │   ├── TopicDetailPage.ets
│   │   │   └── TopicListPage.ets
│   │   ├── services/         # 网络与业务服务
│   │   │   ├── AdService.ets
│   │   │   ├── HttpClient.ets
│   │   │   └── TopicApi.ets
│   │   └── utils/            # 工具类
│   │       ├── Dialer.ets
│   │       ├── Store.ets
│   │       └── TopicDataSource.ets
│   ├── src/main/resources/   # 模块级资源（字符串、颜色、媒体、页面路由配置）
│   ├── build-profile.json5
│   ├── hvigorfile.ts
│   └── oh-package.json5
├── build-profile.json5       # 工程级构建配置（签名、产品、模块）
├── hvigorfile.ts             # 工程级 Hvigor 脚本
├── oh-package.json5          # 工程级依赖
└── oh_modules/               # OHPM 依赖
```

## 构建与运行

### 环境要求

- DevEco Studio（建议与 API 12 配套版本）
- HarmonyOS SDK 5.0.0(12)
- OHPM 包管理器

### 常用命令

> 本项目依赖 Hvigor 构建体系，开发命令主要通过 DevEco Studio 的图形界面执行，也可使用 `hvigor` 相关命令行工具。

| 操作 | 命令/入口 |
|---|---|
| 同步依赖 | DevEco Studio: `File → Sync and Refresh Project` 或 OHPM 自动同步 |
| 编译 / 构建 | DevEco Studio: `Build → Build Hap(s)/App(s)` |
| 运行到真机/模拟器 | DevEco Studio: `Run → Run 'entry'` |
| 生成 Release HAP | 使用 build-profile 中配置的 `release` 签名配置进行构建 |

### 签名配置

`build-profile.json5` 中已配置名为 `release` 的 HarmonyOS 签名，引用了本地路径下的 p12、p7b、cer 文件。如在不同机器上构建，需替换为本地可用的签名材料，或重新配置自动签名。

### 广告调试说明

- 当前 `AdIds.ets` 默认使用华为官方测试广告位（`USE_TEST_IDS = true`）。
- 元服务无法获取 OAID，因此只能投放**非个性化广告**。
- 模拟器不出广告，**必须真机联调**才能验证广告展示。
- 上线前需在鲸鸿动能媒体服务平台创建展示位，并将 `PROD_NATIVE`、`PROD_BANNER` 替换为正式广告位 ID，再将 `USE_TEST_IDS` 设为 `false`。

## 业务与技术约定

### 页面与路由

入口页面为 `pages/TopicListPage`，详情页为 `pages/TopicDetailPage`。页面路由在 `entry/src/main/resources/base/profile/main_pages.json` 中注册。

### 网络层约定

- 统一通过 `services/HttpClient.ets` 发起 GET 请求。
- 后端基地址：`https://api.ggfee.cn/mini`。
- 响应体统一为 `{ code, msg, data }` 结构，与小程序端 `requestFun` 保持一致。
- 为规避 ArkTS 对对象字面量类型的限制，查询参数由调用方直接拼接在 path 中。

### 数据流约定

- 页面通过 `services/TopicApi.ets` 拉取帖子列表或详情。
- 列表数据使用 `TopicDataSource` 包装，配合 `LazyForEach` 实现懒加载与分页。
- 本地存储（如隐私协议同意状态）通过 `utils/Store.ets` 读写，封装了 `preferences`。

### UI/UX 约定

- 全局使用浅色模式：在 `EntryAbility.onCreate` 中强制设置 `COLOR_MODE_LIGHT`，避免深色模式对比度问题。
- 沉浸式状态栏：`EntryAbility.onWindowStageCreate` 中记录 `statusBarHeight` 与 `navBarHeight`（底部手势导航条避让），并设置全屏布局。
- 视觉还原：尺寸换算按小程序 rpx / 2 ≈ vp 处理（750rpx 设计稿对应 360vp）。

### 合规与隐私

- **隐私协议弹窗**：首次启动必须获得用户同意后才请求网络数据和广告；不同意则退出应用。
- **底部导航条避让**：列表与详情页均通过 `navBarHeight` 调整 padding，避免内容/操作按钮被系统导航条遮挡。
- **广告合规**：元服务不支持 `identifier`/OAID，广告服务中不传入 `oaid` 字段，按非个性化广告处理。

### 代码风格

- ArkTS 源码文件统一使用 `.ets` 扩展名。
- 类/方法使用强类型注解，接口类型集中定义在 `services/TopicApi.ets` 等位置。
- 错误日志统一使用 `hilog`，日志域标签为 `WorkerBee` 或 `WorkerBeeAd`。
- 常量使用全大写加下划线命名，并通过 `readonly` 修饰。

## 注意事项

- 当前项目**没有配置测试目录**（无 `src/ohosTest`）。如需补充单元/自动化测试，应创建 `entry/src/ohosTest/ets/test` 并使用 `@ohos/hypium` 框架。
- 当前地区选择固定为「全国」，未实现地区选择页。
- 当前帖子类型固定为 `party = 1`（招工），详情页中 `party = 2`（找活）时隐藏薪酬/企业信息。
- `AdIds.ets` 中正式广告位 ID 为空字符串，上线前必须替换。
