# Multi-Domain Homepage Design

**Date:** 2026-04-08  
**Project:** Brioi API 多域名首页与购买页品牌变体  
**Scope:** 在纯静态 `HTML/CSS/JS` 前提下，为 `brioi.com`、`cradeo.com`、`drigeo.com` 提供可维护的首页与购买页结构  
**Supersedes:** 无

## 1. Goal

当前仓库只有一套单品牌首页与购买页：

- `/Users/Shake/Documents/App/Brioi/index.html`
- `/Users/Shake/Documents/App/Brioi/buy.html`
- `/Users/Shake/Documents/App/Brioi/styles.css`
- `/Users/Shake/Documents/App/Brioi/main.js`

目标是在不引入构建工具、不改成前端框架、不依赖服务端模板的前提下，让不同域名展示不同的首页与购买页品牌变体，同时保证以下结果：

1. 每个域名都有自己的静态 SEO 信息
2. 每个域名都可以有自己的品牌名、品牌图标、首页主副标题、主题色、套餐开关和套餐价格
3. 通用结构、交互逻辑和样式仍然共用，避免三套页面长期漂移
4. 页面在 JavaScript 关闭时仍然能显示正确的站点内容，而不是退回到默认 Brioi 文案

## 2. Constraints

本次设计必须遵守以下约束：

- 技术栈继续保持纯静态 `HTML/CSS/JS`
- 不新增 Vite、Webpack、Nunjucks、11ty 等构建或模板系统
- 本次只覆盖首页与购买页，不把文档页一起品牌化
- 站点变体以静态文件目录组织，而不是依赖运行时按 `window.location.host` 临时拼整个页面

这些约束意味着“完全零重复”不可达。  
在没有模板引擎的情况下，每个域名自己的 `index.html` 与 `buy.html` 会存在少量结构重复，这是可以接受的成本。设计目标不是消灭全部重复，而是把会频繁变化的品牌信息和套餐逻辑从重复 HTML 中抽出来。

## 3. Current State

当前实现的主要问题有：

1. 首页与购买页都把 `Brioi`、主标题、副标题、套餐价格直接硬编码在页面里
2. `/Users/Shake/Documents/App/Brioi/main.js` 里的 `PLAN_LABELS` 也是单品牌硬编码
3. 当前套餐是：
   - 周卡：`¥29`
   - Plus 月卡：`¥99`
   - Pro 月卡：`¥199`
   - MAX 月卡：`¥499`
4. 当前主题色直接写在 `/Users/Shake/Documents/App/Brioi/styles.css` 的根变量中：
   - `--accent: #00E676`
   - `--accent-hover: #00C853`
   - `--accent-light: #E5FFE9`
5. 左上角品牌图标还是内联 SVG，不适合后续按站点替换成独立 logo 文件

如果继续在现有文件里用 `if (host === 'cradeo.com')` 这种分支补丁，后面会同时出现：

- SEO 头信息与页面文案不一致
- 首页价格与购买页计划标签不同步
- 测试只能覆盖默认站点，其他域名容易悄悄回退

## 4. Options Evaluated

### 4.1 Single Shared HTML With Runtime Host Switching

做法是保留一套 `index.html`，页面加载后根据域名动态改品牌名、标题、价格和颜色。

优点：

- 文件最少
- 理论上只维护一份页面骨架

缺点：

- 静态 SEO 头信息和首屏正文都不可靠
- JavaScript 关闭时会显示错误站点内容
- 运行时分支会不断长进 `/Users/Shake/Documents/App/Brioi/main.js`

这个方案不适合本项目。

### 4.2 One Fully Independent Site Per Domain

做法是每个域名各维护一整套独立 `index.html`、`buy.html`、样式和脚本。

优点：

- 自由度最高
- 各站互不影响

缺点：

- 三套页面会很快漂移
- 公共结构改动需要同步改多份文件
- 测试成本线性增长

这个方案只适合页面结构差异已经非常大的场景。当前需求还没有到这个程度。

### 4.3 Recommended: Per-Site Entry Pages + Shared Assets + Shared Runtime Config

做法是：

- 每个站点保留自己的静态入口 HTML
- 所有交互逻辑与大部分样式共用
- 品牌和套餐差异集中在一份站点配置里
- 页面里的可变节点统一用 `data-*` 标记

这是本次采用的方案。

## 5. Chosen Architecture

### 5.1 Target File Structure

```txt
/Users/Shake/Documents/App/Brioi
  /sites
    /brioi
      index.html
      buy.html
      og-home.jpg
    /cradeo
      index.html
      buy.html
      og-home.jpg
    /drigeo
      index.html
      buy.html
      og-home.jpg

  /assets
    /brands
      shared-logo.svg
    /images
    /fonts

  /styles
    styles.css

  /scripts
    site-config.js
    site-runtime.js
    main.js
```

### 5.2 Responsibility Split

- `/Users/Shake/Documents/App/Brioi/sites/<site>/index.html`
  - 负责该站点自己的 `title`、`meta description`、`og:*`、`canonical`
  - 负责该站点首页的静态默认正文内容
  - 在 `<body>` 上声明 `data-site="<site>"`

- `/Users/Shake/Documents/App/Brioi/sites/<site>/buy.html`
  - 负责该站点购买页自己的 `title` 与可见标题
  - 负责该站点购买页的静态默认套餐展示
  - 同样声明 `data-site="<site>"`

- `/Users/Shake/Documents/App/Brioi/scripts/site-config.js`
  - 只负责站点差异配置
  - 不直接操作 DOM

- `/Users/Shake/Documents/App/Brioi/scripts/site-runtime.js`
  - 读取 `data-site`
  - 计算最终配置
  - 应用主题变量
  - 校正品牌名、文案、套餐和购买页选中计划

- `/Users/Shake/Documents/App/Brioi/scripts/main.js`
  - 只保留通用交互逻辑
  - 包括定价 tab、FAQ、弹窗等
  - 不再承载品牌判断和套餐映射

- `/Users/Shake/Documents/App/Brioi/styles/styles.css`
  - 保留一份共享样式
  - 把品牌相关颜色改成 CSS 变量

### 5.3 Deployment Assumption

本设计假设每个域名最终都指向自己那一组静态入口文件。  
本地开发时，可以直接访问：

- `/sites/brioi/index.html`
- `/sites/cradeo/index.html`
- `/sites/drigeo/index.html`

生产环境可以用 Web 服务器把不同域名的 `/` 与 `/buy.html` 映射到对应的 `sites/<site>/` 文件。  
实际的服务器映射规则不在本次实现范围内。

## 6. Static HTML Rules

### 6.1 Why Each Site Still Needs Its Own HTML

因为本项目不使用模板引擎，所以每个站点都必须有自己的静态 HTML 入口。  
这不仅是为了 `<head>` 里的 SEO 标签，也是为了让首屏正文在 JavaScript 关闭时仍然正确。

因此：

- `cradeo` 的首页静态 HTML 默认就必须显示 `CradEO`
- `drigeo` 的首页静态 HTML 默认就必须显示 `Drigeo`
- `drigeo` 的首页静态 HTML 默认就必须显示“让每个人，都能接入更强的 AI”

运行时脚本不是唯一内容来源，而是统一的校正层和交互层。

### 6.2 Markup Convention

所有可变节点使用统一标记，避免脚本里写选择器分支。

首页至少需要这些标记：

- `data-brand-logo`
- `data-brand-name`
- `data-hero-title`
- `data-copy="hero.subtitle"`
- `data-plan-id="week-pass"`
- `data-plan-id="plus-monthly"`
- `data-plan-id="pro-monthly"`
- `data-plan-id="max-monthly"`
- `data-plan-label`
- `data-plan-price`

购买页至少需要这些标记：

- `data-brand-name`
- `data-buy-heading`
- `data-selected-plan`

### 6.3 Brand Logo Handling

当前左上角品牌图标是内联 SVG。为了支持未来站点使用不同 logo，本次设计要求把品牌图标抽成独立静态资源文件，并统一改成可替换的图片节点，例如：

```html
<img data-brand-logo src="../../assets/brands/shared-logo.svg" alt="" />
```

当前三个站点先共用同一个 logo 文件：

- `/Users/Shake/Documents/App/Brioi/assets/brands/shared-logo.svg`

但配置层必须为每个站点都保留独立 `logo` 字段，后续更换时不需要再改 HTML 结构。

## 7. Config Model

### 7.1 Base + Override Strategy

站点配置采用一份基线配置加多份覆盖配置的方式组织：

```js
export const BASE_SITE = { ... };
export const SITE_OVERRIDES = {
  brioi: {},
  cradeo: { ... },
  drigeo: { ... }
};
```

运行时通过深合并得到最终站点配置。  
这样 `brioi` 可以作为基线，其余站点只覆盖差异字段。

### 7.2 Config Shape

本次配置结构固定为：

```js
{
  brand: {
    name: 'Brioi',
    logo: '../../assets/brands/shared-logo.svg'
  },

  hero: {
    titleLines: [
      { text: '更强的 AI，', accent: false },
      { text: '不该只有少数人在用', accent: true }
    ],
    subtitle: '顶级 GPT-5.4 全系列 AI 模型直连，稳定、高速、安全'
  },

  theme: {
    accent: '#00E676',
    accentHover: '#00C853',
    accentLight: '#E5FFE9',
    borderGreen: 'rgba(0, 230, 118, 0.3)',
    shadowGlow: '0 12px 32px rgba(0, 230, 118, 0.25)'
  },

  pricing: {
    order: ['week-pass', 'plus-monthly', 'pro-monthly', 'max-monthly'],
    plans: {
      'week-pass': { label: '周卡', enabled: true, price: 29 },
      'plus-monthly': { label: 'Plus 月卡', enabled: true, price: 99 },
      'pro-monthly': { label: 'Pro 月卡', enabled: true, price: 199 },
      'max-monthly': { label: 'MAX 月卡', enabled: true, price: 499 }
    }
  }
}
```

`pricing.plans` 是唯一套餐源。  
首页、购买页以及计划标签映射都必须从这里读取，不能再在 `/Users/Shake/Documents/App/Brioi/main.js` 里维护第二份 `PLAN_LABELS`。

### 7.3 Site Matrix

本次确认的三个站点配置如下。

#### `brioi`

- `brand.name`: `Brioi`
- `brand.logo`: 共享 `shared-logo.svg`
- `hero.titleLines`:
  - `更强的 AI，`
  - `不该只有少数人在用`，第二行保留强调样式
- `hero.subtitle`: `顶级 GPT-5.4 全系列 AI 模型直连，稳定、高速、安全`
- `theme`:
  - `accent: #00E676`
  - `accentHover: #00C853`
  - `accentLight: #E5FFE9`
  - `borderGreen: rgba(0, 230, 118, 0.3)`
  - `shadowGlow: 0 12px 32px rgba(0, 230, 118, 0.25)`
- `pricing`:
  - `week-pass: 29`
  - `plus-monthly: 99`
  - `pro-monthly: 199`
  - `max-monthly: 499`

#### `cradeo`

- `brand.name`: `CradEO`
- `brand.logo`: 共享 `shared-logo.svg`
- `hero.titleLines`: 与 `brioi` 相同
- `hero.subtitle`: 与 `brioi` 相同
- `theme`:
  - `accent: #22C55E`
  - `accentHover: #16A34A`
  - `accentLight: #ECFDF3`
  - `borderGreen: rgba(34, 197, 94, 0.3)`
  - `shadowGlow: 0 12px 32px rgba(34, 197, 94, 0.22)`
- `pricing`:
  - `week-pass.enabled = false`
  - `plus-monthly.price = 199`
  - `pro-monthly.price = 299`
  - `max-monthly.price = 699`

#### `drigeo`

- `brand.name`: `Drigeo`
- `brand.logo`: 共享 `shared-logo.svg`
- `hero.titleLines`:
  - `让每个人，都能接入更强的 AI`
- `hero.subtitle`: 与 `brioi` 相同
- `theme`:
  - `accent: #10B981`
  - `accentHover: #059669`
  - `accentLight: #ECFDF5`
  - `borderGreen: rgba(16, 185, 129, 0.3)`
  - `shadowGlow: 0 12px 32px rgba(16, 185, 129, 0.22)`
- `pricing`:
  - `week-pass.enabled = false`
  - `plus-monthly.price = 299`
  - `pro-monthly.price = 399`
  - `max-monthly.price = 799`

## 8. Runtime Responsibilities

`/Users/Shake/Documents/App/Brioi/scripts/site-runtime.js` 的职责固定为以下几项：

1. 读取当前页面的 `data-site`
2. 深合并 `BASE_SITE` 与当前站点覆盖项
3. 把主题值写回 CSS 变量
4. 按配置更新品牌名、logo、Hero 标题容器、Hero 副标题和购买页标题
5. 更新套餐名称、价格和显示状态
6. 校验购买页 `?plan=` 参数是否合法

### 8.1 Unknown Site Fallback

如果 `data-site` 缺失或站点键不存在，则回退到 `brioi`。  
这样本地调试或漏配时不会把页面直接初始化到空状态。

### 8.2 Disabled Plan Fallback

如果购买页收到一个当前站点已禁用的计划，例如：

- `cradeo` 上访问 `buy.html?plan=week-pass`
- `drigeo` 上访问 `buy.html?plan=week-pass`

则购买页必须自动回退到该站点第一个启用的周期套餐。  
按本次顺序定义，这个回退目标都是 `plus-monthly`。

### 8.3 Main Script Boundary

`/Users/Shake/Documents/App/Brioi/scripts/main.js` 中不得再出现：

- 品牌名映射
- 域名分支
- 套餐标签硬编码
- 价格硬编码

它只负责通用交互，例如：

- 定价 tab 切换
- FAQ 展开逻辑
- 联系弹窗开关

## 9. Styling Rules

### 9.1 Brand Tokens

本次只把真正属于品牌层的颜色改成站点变量，包括：

- 主强调色
- hover 强调色
- 浅色背景强调层
- 绿色边框
- 绿色辉光阴影

对应到当前 `/Users/Shake/Documents/App/Brioi/styles.css`，至少要把以下变量纳入站点切换：

- `--accent`
- `--accent-hover`
- `--accent-light`
- `--border-green`
- `--shadow-glow`

### 9.2 Non-Goals For Theming

像遥测条形图里那些演示性质的蓝色、紫色、青色，并不属于品牌主题系统。  
这些颜色在 v1 中不要求按站点切换，避免把一次结构改造变成全站重绘。

## 10. SEO Rules

每个站点的首页与购买页都必须保留自己的静态头信息。  
运行时 JavaScript 不负责生产 SEO 内容。

本次设计明确以下规则：

1. 每个站点自己的 `index.html` 都有独立 `<title>`
2. 每个站点自己的 `index.html` 都有独立 `meta description`
3. 每个站点自己的 `index.html` 都预留独立 `og-home.jpg`
4. `buy.html` 的页面标题也跟随品牌名变化

本次直接采用以下命名规则：

- `brioi` 首页标题：`Brioi API | 官方客户端订阅接入`
- `cradeo` 首页标题：`CradEO API | 官方客户端订阅接入`
- `drigeo` 首页标题：`Drigeo API | 官方客户端订阅接入`

- `brioi` 首页描述：`Brioi API — 更强的 AI，不该只有少数人会用。支持最新 GPT-5.4 模型与原生体验。`
- `cradeo` 首页描述：`CradEO API — 更强的 AI，不该只有少数人会用。支持最新 GPT-5.4 模型与原生体验。`
- `drigeo` 首页描述：`Drigeo API — 让每个人，都能接入更强的 AI。支持最新 GPT-5.4 模型与原生体验。`

## 11. Testing Expectations

现有 `/Users/Shake/Documents/App/Brioi/tests/homepage.spec.js` 目前只覆盖默认站点。  
本次结构改造后，测试必须按站点矩阵补齐。

至少需要覆盖：

1. `brioi` 首页仍保留当前标题、副标题、周卡和现有价格
2. `cradeo` 首页显示 `CradEO`，不显示周卡，月卡价格为 `199 / 299 / 699`
3. `drigeo` 首页显示 `Drigeo`，主标题为“让每个人，都能接入更强的 AI”，不显示周卡，月卡价格为 `299 / 399 / 799`
4. 三个站点的购买页都显示正确品牌标题
5. `cradeo` 与 `drigeo` 的购买页若收到 `week-pass`，会自动回退到 `plus-monthly`
6. 主题色至少验证一个关键元素实际拿到了当前站点的 CSS 变量值
7. JavaScript 关闭时，每个站点的品牌名和关键文案仍然正确

本地测试路径可以直接使用：

- `/sites/brioi/index.html`
- `/sites/cradeo/index.html`
- `/sites/drigeo/index.html`
- `/sites/brioi/buy.html`
- `/sites/cradeo/buy.html`
- `/sites/drigeo/buy.html`

## 12. Non-Goals

以下内容不在本次范围内：

- 不重写页面为 React、Vue 或任何框架
- 不引入模板引擎或打包器
- 不把 `/Users/Shake/Documents/App/Brioi/docs.html` 一起做成多品牌版本
- 不在本次开放任意模块排序系统
- 不把“更多套餐”里的按量付费和企业定制纳入按站点配置
- 不重做整个视觉风格，只做品牌层 token 替换

## 13. Success Criteria

当本设计落地后，应满足以下结果：

1. 新增一个域名品牌时，只需要复制一组静态入口 HTML，并在 `site-config.js` 里补一份配置
2. 品牌名、logo、Hero 文案、主题色、周期套餐种类和价格不再散落在多个脚本与页面里
3. 首页与购买页使用同一份套餐定义，不会再出现首页和购买页显示不一致
4. 站点内容在 JavaScript 开启和关闭两种情况下都能保持正确
5. `main.js` 回到纯交互脚本职责，不再承载品牌和套餐逻辑
