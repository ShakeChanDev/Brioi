# CradEO Brand Font Config Design

**Date:** 2026-04-09  
**Project:** CradEO 品牌字体本地落库与配置化切换  
**Scope:** 让 `cradeo` 站点所有品牌名节点使用本地 `Black Han Sans`，并把品牌字体收口到站点配置中  
**Supersedes:** 无

## 1. Goal

当前多站点实现里，品牌名字体仍然是共享样式：

- `Brioi`
- `CradEO`
- `Drigeo`

都复用了同一套品牌文字样式，其中站点头部品牌名默认走 `Bungee`。  
这不满足 `CradEO` 需要独立品牌字体的要求，也没有进入站点配置层。

本次目标是：

1. 把 `Black Han Sans` 字体文件落库到项目中，不依赖在线字体服务
2. 让 `cradeo` 站点所有出现 `CradEO` 品牌名的位置都切换到 `Black Han Sans`
3. 让品牌字体和品牌名、品牌图标一样进入 `site-config.js`
4. 不影响 `brioi` 与 `drigeo` 现有品牌字体

## 2. Constraints

- 继续保持纯静态 `HTML/CSS/JS`
- 不引入构建工具或字体托管服务
- 不做只对 `cradeo` 生效的硬编码 CSS 选择器分支
- 品牌字体必须通过站点配置驱动，而不是散落在模板或运行时代码里

## 3. Current State

当前品牌字体实现有两个问题：

1. `/Users/Shake/Documents/App/Brioi/.worktrees/codex-multi-domain-homepage/styles/styles.css` 里只声明了本地 `Bungee`
2. `.site-header .brand-text` 直接把品牌字体写死为 `Bungee`

这意味着：

- `CradEO` 不能只通过配置切换到专属字体
- 页脚或其他 `data-brand-name` 节点没有一套统一的品牌字体来源

## 4. Options Evaluated

### 4.1 Hardcode CradEO CSS Override

做法是新增类似 `.site-cradeo .brand-text { font-family: ... }` 的站点特定选择器。

优点：

- 改动最少

缺点：

- 品牌字体没有进入配置层
- 后续再有站点换品牌字体时，会继续堆站点专属 CSS 分支

不采用。

### 4.2 Recommended: Local Font Asset + Configured Brand Font Variable

做法是：

- 把 `Black Han Sans` 字体文件落到仓库
- 在共享样式中注册本地 `@font-face`
- 在站点配置中为品牌添加字体字段
- 运行时根据当前站点把品牌字体写入 CSS 变量
- 所有品牌名节点统一读取这个变量

优点：

- 字体能力进入配置层，符合当前多站点架构
- 后续新增品牌字体只需要加资源和配置
- 不需要在多个 HTML 页面里重复维护字体逻辑

这是本次采用的方案。

## 5. Chosen Design

### 5.1 Font Asset

新增本地字体文件：

- `/Users/Shake/Documents/App/Brioi/.worktrees/codex-multi-domain-homepage/assets/fonts/BlackHanSans-Regular.ttf`

共享样式新增一个本地 `@font-face`：

- `font-family: 'Black Han Sans'`
- `src: url('/assets/fonts/BlackHanSans-Regular.ttf') format('truetype')`
- `font-display: swap`

本次不引入在线字体链接，也不依赖第三方 CDN。

### 5.2 Site Config Shape

在 `/Users/Shake/Documents/App/Brioi/.worktrees/codex-multi-domain-homepage/scripts/site-config.js` 的 `brand` 配置中新增品牌字体字段：

```js
brand: {
  name: 'CradEO',
  logo: '/assets/brands/shared-logo.svg#brand-mark',
  buyHeading: '购买 CradEO API',
  fontFamily: "'Black Han Sans', 'Bungee', \"Avenir Next\", Avenir, \"Corbel\", sans-serif"
}
```

默认站点配置同时补齐该字段：

```js
brand: {
  fontFamily: "'Bungee', \"Avenir Next\", Avenir, \"Corbel\", sans-serif"
}
```

这样 `brioi` 和 `drigeo` 继续使用现有品牌字体，而 `cradeo` 通过覆盖配置切换到 `Black Han Sans`。

### 5.3 Runtime Application

在 `/Users/Shake/Documents/App/Brioi/.worktrees/codex-multi-domain-homepage/scripts/site-runtime.js` 中，品牌初始化除了更新品牌名和 logo，还要把配置里的字体写入根变量：

- `--brand-font-family`

写法示意：

```js
document.documentElement.style.setProperty('--brand-font-family', siteConfig.brand.fontFamily);
```

如果某站点未显式配置品牌字体，则回退到 `BASE_SITE.brand.fontFamily`。

### 5.4 Shared CSS Contract

在共享样式里，把所有品牌名文本节点统一接到 `--brand-font-family`，而不是只在头部单独写死：

- `.brand-text`
- 其他任何复用 `data-brand-name` 的品牌文本节点

实现规则：

1. 默认品牌字重和字距仍保留现有视觉参数
2. 字体来源从写死的 `Bungee` 改成 `var(--brand-font-family)`
3. `brand-outline` 和 `brand-dot` 继续沿用现有样式，不切换到 `Black Han Sans`

这保证本次变化只作用于品牌名本身，不改变 `API` 轮廓字或品牌分隔点。

## 6. Expected Result

落地后行为如下：

- `brioi`
  - 顶部和页脚品牌名继续使用当前品牌字体
- `drigeo`
  - 顶部和页脚品牌名继续使用当前品牌字体
- `cradeo`
  - 所有 `CradEO` 品牌名字样统一使用本地 `Black Han Sans`

本次只覆盖品牌名文本本身，不调整字号、间距、渐变色、图标或主题色。

## 7. Testing

需要补充或更新以下验证：

1. 自动化测试验证 `cradeo` 站点品牌名字体已切换到 `Black Han Sans`
2. 自动化测试验证 `brioi` 站点品牌名字体仍然包含 `Bungee`
3. 回归测试验证站点品牌名文本仍然正常显示，不影响已有品牌替换逻辑

视觉检查时，至少确认：

- `/sites/cradeo/index.html`
- `/sites/cradeo/buy.html`

中的品牌名均使用新字体。

## 8. Non-Goals

本次不包含以下内容：

- 为 `Brioi` 或 `Drigeo` 更换品牌字体
- 为 `brand-outline` 或 `brand-dot` 引入独立字体配置
- 引入字体子集化、按站点分包或字体懒加载
- 品牌字体之外的文案、价格、颜色调整
