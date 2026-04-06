# Brioi Supported Software Official Icons Design

**Date:** 2026-04-06  
**Project:** Brioi API 首页支持软件区块图标升级  
**Scope:** 将首页“支持的软件”区块、对应 `noscript` 区块和使用方式弹窗中的软件图标，从字母占位替换为官方公开素材  
**Supersedes:** 补充并部分覆盖 `/Users/Shake/Documents/App/Brioi/docs/superpowers/specs/2026-04-06-brioi-supported-software-section-design.md` 中关于“软件图标”的实现说明

## 1. Goal

当前首页支持软件区块已经有 4 张软件卡和配套弹窗，但图标仍然是 `CX / CC / OC / OW` 这类字母占位。

本次改动的目标不是重做区块结构，而是把“支持的软件”从示意状态升级为真实可识别状态，让用户一眼看到当前支持的软件就是：

1. `Codex`
2. `Claude Code`
3. `OpenCode`
4. `OpenClaw`

本次必须实现以下结果：

- 首页卡片不再显示字母占位图标
- 弹窗头部不再显示字母占位图标
- `noscript` 备用内容也不再显示字母占位图标
- 所有图标都优先使用官方公开素材，而不是站内临时绘制图形

## 2. Asset Sourcing Policy

### 2.1 Primary Rule

本次采用用户已确认的 `B` 方案：**官方公开素材优先**。

具体规则如下：

- 如果某软件存在可直接验证的官方公开图标文件，则直接使用该文件
- 如果没有独立品牌包，但存在官方页面公开的站点 icon / app icon，则允许使用该官方公开素材
- 不允许再使用自绘字母、抽象几何重画、品牌色模拟图
- 不允许使用第三方素材站、非官方镜像仓库、社区二创 logo

### 2.2 Local Copy Rule

正式实现时，不直接热链官方 URL。

所有确认可用的素材都应复制到项目本地资源目录，由当前页面静态引用。本地化的原因包括：

- 避免第三方缓存或外链失效
- 避免跨域和加载波动影响首页
- 让 Playwright 测试能够稳定验证资源存在
- 保证首页、弹窗和 `noscript` 区块使用同一份资源

## 3. Approved Asset Matrix

### 3.1 Codex

`Codex` 的素材要求最严格：**优先使用 OpenAI 官方 macOS app 图标**。

已确认的产品背景依据：

- OpenAI 于 **2026-02-02** 发布文章 *Introducing the Codex app*，明确说明 `Codex app for macOS`
- 同一文章在 **2026-03-04** 标注 Windows 更新，但最初首发平台是 macOS
- 官方 `Get started with Codex` 页面展示了 Codex app 引导界面，界面顶部可见 Codex app 图标

因此，`Codex` 的允许来源顺序固定为：

1. OpenAI 官方 macOS app 独立图标文件
2. 若官方公开面未提供单独导出的图标文件，则允许从同一官方 macOS app 引导素材中提取该 app 图标

明确禁止：

- 不允许使用 `openai/codex` 仓库中的 `codex-cli-splash.png` 作为最终首页图标
- 不允许退回字母占位
- 不允许手工重画一个近似 Codex 图标

### 3.2 Claude Code

`Claude Code` 当前允许使用 Anthropic 官方公开页面中的官方 icon 资源。

本次设计接受以下来源：

- `https://www.anthropic.com/images/icons/apple-touch-icon.png`
- `https://www.anthropic.com/images/icons/safari-pinned-tab.svg`

优先选择更适合卡片展示、清晰度更高的那一个作为本地化资源。

本次不要求必须拿到“单独命名为 Claude Code 的品牌包”才可落地，因为当前公开面未验证到这一层级的专属图标文件。

### 3.3 OpenCode

`OpenCode` 使用其官方站公开 icon 资源。

当前可接受来源：

- `https://opencode.ai/apple-touch-icon-v3.png`
- `https://opencode.ai/favicon-96x96-v3.png`

优先使用在卡片中识别度更好的版本。

### 3.4 OpenClaw

`OpenClaw` 使用其官方仓库中公开的品牌资源。

当前可接受来源：

- `https://raw.githubusercontent.com/openclaw/openclaw/main/ui/public/favicon.svg`
- `https://raw.githubusercontent.com/openclaw/openclaw/main/docs/assets/openclaw-logo-text.svg`
- `https://raw.githubusercontent.com/openclaw/openclaw/main/docs/assets/openclaw-logo-text-dark.svg`

如果卡片只需要图标，则优先使用 `favicon.svg` 这类更聚焦的单图标资源；如果弹窗头部需要文字版组合标识，可在不破坏结构的前提下评估是否使用文字 logo，但本次默认仍以单图标为主。

## 4. Presentation Rules

### 4.1 Shared Visual Rule

四张卡继续保留当前首页已经确定的卡片结构、文案层级和按钮位置，不借这次改动重做区块布局。

本次只替换“图标呈现方式”。

统一规则：

- 图标区域保持固定展示尺寸
- 使用真实 `img` 或等价静态图片元素渲染
- 资源按 `contain` 逻辑完整显示，不做破坏识别的强裁切
- 透明背景或白底图标放入中性承载容器中，避免在白底页面里失焦
- 如果官方素材本身已经带品牌底色或完整底板，不再叠加第二层彩色壳

### 4.2 Neutral Carrier Rule

虽然图标必须使用官方原始品牌图形和配色，但页面整体仍要保持 Brioi 当前的白底、黑字、绿色小面积强调的视觉节奏。

因此图标的落地方式固定为：

- **官方图标本体保持原样**
- **外层可使用统一的中性承载容器**

这里的“中性承载容器”仅用于统一尺寸、圆角、阴影和留白，不得改变图标本体颜色，不得把图标重新做成品牌色底卡。

### 4.3 Codex Special Rule

`Codex` 按用户确认必须走 **mac app 图标** 路线。

因此：

- 卡片中不使用 repo splash 宽图替代 icon
- 弹窗头部也不使用 repo splash
- 如果拿到的是从官方 app 引导图中提取出的图标，也必须整理成本地单图标资源后再使用

## 5. Scope Of Change

本次影响的展示位置固定为：

1. 首页支持软件卡片
2. `noscript` 支持软件使用方式区块
3. 使用方式弹窗头部

本次**不**包含：

- 修改软件列表数量
- 修改支持软件文案
- 修改按钮文案
- 重做弹窗信息结构
- 重做 section heading
- 扩展成应用市场式的软件墙

## 6. Implementation Notes

### 6.1 Data Model

当前软件数据已经集中在 `main.js` 的软件映射中，但图标仍是字符串字母。

本次应把“图标资源路径”提升为统一字段，让三个位置共用：

- 首页卡片
- `noscript` 区块
- 弹窗头部

实现目标是避免：

- HTML 一处写图片
- JS 一处写字母
- `noscript` 再单独一套

三处必须共用同一种资源定义。

### 6.2 Asset Storage

实现时应新增本地资源目录，用于存放官方素材拷贝。

目录名不在本次设计中强制规定，但必须满足：

- 含义清晰，能看出是首页支持软件 icon 资源
- 不与临时设计稿或测试产物混放
- 可以被静态 HTML 直接引用

### 6.3 Accessibility

图标图片必须提供有意义的 `alt` 策略：

- 如果图标旁边紧跟可见软件名，图标可使用空 `alt` 并标记为装饰性
- 如果图标在某些上下文中承担独立识别作用，则应提供准确软件名作为替代文本

最终实现应保持现有卡片与弹窗的可访问名称不被破坏。

## 7. Testing Requirements

现有 Playwright 测试中存在针对字母占位图标的断言，本次必须改为真实图片断言。

至少需要覆盖：

1. 首页四张软件卡均渲染真实图片资源，而不是 `CX / CC / OC / OW`
2. `noscript` 备用区块中的四个软件条目也使用真实图片资源
3. 弹窗打开后头部渲染真实图片资源，而不是字母占位
4. `Codex` 使用的是单独的官方 mac app 图标本地资源，而不是 repo splash

测试不要求校验像素内容本身，但要能防止实现回退到：

- 文本字母占位
- 远程热链
- 把宽图 splash 误当图标

## 8. Success Criteria

当本次改动完成后，用户进入首页支持软件区块时，应立即感知到：

1. 这四个软件不是示意名称，而是被正式支持的软件
2. 图标是真实品牌素材，而不是站内拼出来的占位 UI
3. 整体视觉仍然属于 Brioi 首页，而不是突然变成应用商店页面

同时，从实现层面必须满足：

- 三处展示位置共用同一套本地图标资源策略
- `Codex` 使用 mac app 图标路线，不退回 splash
- 后续测试能拦住任何回退到字母占位的改动

## 9. Source Notes

以下来源用于确认素材策略和产品背景，正式实现时应以当次可访问的官方资源文件为准：

- OpenAI, *Introducing the Codex app*, published **2026-02-02**, updated **2026-03-04**
- ChatGPT official feature page, *Get started with Codex*
- Anthropic official Claude Code product page
- OpenCode official site `opencode.ai`
- OpenClaw official GitHub repository `openclaw/openclaw`
