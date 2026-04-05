# Brioi API Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Brioi API marketing homepage as a pure HTML/CSS/JS static site that matches the approved design spec, highlights price-first messaging, and sends users to a dedicated buy page.

**Architecture:** Use a no-build static site with semantic HTML, a single shared stylesheet, and a small enhancement script. Keep the homepage fully readable without JavaScript, then layer in pricing tab switching and buy-page plan selection via progressive enhancement. In local static development, `buy.html` is the implementation equivalent of the approved `/buy` route.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, Playwright, http-server

---

## File Structure

Create and maintain these files during implementation:

- `/Users/Shake/Documents/App/Brioi/index.html`
- `/Users/Shake/Documents/App/Brioi/styles.css`
- `/Users/Shake/Documents/App/Brioi/main.js`
- `/Users/Shake/Documents/App/Brioi/buy.html`
- `/Users/Shake/Documents/App/Brioi/package.json`
- `/Users/Shake/Documents/App/Brioi/playwright.config.js`
- `/Users/Shake/Documents/App/Brioi/tests/homepage.spec.js`

Keep responsibilities narrow:

- `index.html`: static homepage markup
- `styles.css`: design tokens, layout, responsiveness, motion
- `main.js`: pricing tab switching, buy-page plan selection, anchor enhancement
- `buy.html`: dedicated purchase landing page and static equivalent of the approved `/buy` route
- `tests/homepage.spec.js`: browser-level behavior checks

## Task 1: Bootstrap The Static Site And Test Harness

**Files:**
- Create: `/Users/Shake/Documents/App/Brioi/package.json`
- Create: `/Users/Shake/Documents/App/Brioi/playwright.config.js`
- Create: `/Users/Shake/Documents/App/Brioi/tests/homepage.spec.js`
- Create: `/Users/Shake/Documents/App/Brioi/index.html`
- Create: `/Users/Shake/Documents/App/Brioi/styles.css`
- Create: `/Users/Shake/Documents/App/Brioi/main.js`
- Create: `/Users/Shake/Documents/App/Brioi/buy.html`

- [ ] **Step 1: Write the failing smoke test and test runner setup**

Create `/Users/Shake/Documents/App/Brioi/package.json`:

```json
{
  "name": "brioi-homepage",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "http-server . -p 4173 -c-1",
    "test": "playwright test"
  },
  "devDependencies": {
    "@playwright/test": "^1.53.0",
    "http-server": "^14.1.1"
  }
}
```

Create `/Users/Shake/Documents/App/Brioi/playwright.config.js`:

```js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'on-first-retry'
  },
  webServer: {
    command: 'npm run dev',
    port: 4173,
    reuseExistingServer: !process.env.CI
  }
});
```

Create `/Users/Shake/Documents/App/Brioi/tests/homepage.spec.js`:

```js
import { test, expect } from '@playwright/test';

test('homepage shell loads with title and navigation', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Brioi API/);
  await expect(page.getByRole('navigation', { name: '主导航' })).toBeVisible();
  await expect(page.getByRole('main')).toBeVisible();
});
```

- [ ] **Step 2: Run the smoke test to verify it fails**

Run:

```bash
npm install
npm test -- --grep "homepage shell loads with title and navigation"
```

Expected: FAIL because the repository does not yet contain a valid homepage shell with the required title and navigation.

- [ ] **Step 3: Write the minimal implementation needed for the smoke test**

Create `/Users/Shake/Documents/App/Brioi/index.html`:

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Brioi API | 官方客户端订阅接入</title>
    <link rel="stylesheet" href="./styles.css">
    <script defer src="./main.js"></script>
  </head>
  <body data-page="home">
    <nav class="site-nav" aria-label="主导航">
      <a class="brand" href="./index.html">Brioi API</a>
      <a class="nav-cta" href="./buy.html">立即购买</a>
    </nav>
    <main>
      <section class="shell-placeholder">
        <h1>Brioi API</h1>
      </section>
    </main>
  </body>
</html>
```

Create `/Users/Shake/Documents/App/Brioi/styles.css`:

```css
:root {
  color-scheme: light;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: "Inter", "Helvetica Neue", Arial, sans-serif;
  background: #fff;
  color: #000;
}

.site-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
}
```

Create `/Users/Shake/Documents/App/Brioi/main.js`:

```js
document.documentElement.classList.add('js');
```

Create `/Users/Shake/Documents/App/Brioi/buy.html`:

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>购买 Brioi API</title>
    <link rel="stylesheet" href="./styles.css">
    <script defer src="./main.js"></script>
  </head>
  <body data-page="buy">
    <main>
      <h1>购买 Brioi API</h1>
    </main>
  </body>
</html>
```

- [ ] **Step 4: Run the smoke test to verify it passes**

Run:

```bash
npm test -- --grep "homepage shell loads with title and navigation"
```

Expected: PASS

- [ ] **Step 5: Commit**

Run:

```bash
git add package.json playwright.config.js tests/homepage.spec.js index.html styles.css main.js buy.html
git commit -m "搭建 Brioi API 静态首页的基础骨架与浏览器测试环境，补齐首页、购买页和 Playwright 冒烟校验，为后续按设计稿逐段实现页面内容和交互提供稳定起点"
```

## Task 2: Implement The Visual System And Hero Section

**Files:**
- Modify: `/Users/Shake/Documents/App/Brioi/index.html`
- Modify: `/Users/Shake/Documents/App/Brioi/styles.css`
- Modify: `/Users/Shake/Documents/App/Brioi/tests/homepage.spec.js`

- [ ] **Step 1: Write the failing hero test**

Append to `/Users/Shake/Documents/App/Brioi/tests/homepage.spec.js`:

```js
test('hero shows the approved price-first message and a single plus card', async ({ page }) => {
  await page.goto('/');

  const hero = page.locator('#hero');

  await expect(hero.getByRole('heading', { level: 1 })).toContainText('不想再为');
  await expect(hero.getByText('我想直接用 GPT / Codex。')).toBeVisible();
  await expect(hero.getByText('那就别买贵的。一个订阅，直接上。')).toBeVisible();
  await expect(hero.getByText('是官方客户端镜像接入，不是缩水版，也不是只卖 API 点数。')).toBeVisible();
  await expect(hero.getByText('Plus 月卡')).toBeVisible();
  await expect(hero.getByText('¥99')).toBeVisible();
  await expect(hero.locator('.hero-side-card')).toHaveCount(1);
});
```

- [ ] **Step 2: Run the hero test to verify it fails**

Run:

```bash
npm test -- --grep "hero shows the approved price-first message and a single plus card"
```

Expected: FAIL because `#hero`, the conversation copy, and the primary price card do not exist yet.

- [ ] **Step 3: Write the minimal hero implementation**

Replace the `<main>` content in `/Users/Shake/Documents/App/Brioi/index.html` with:

```html
<main>
  <section id="hero" class="hero">
    <div class="hero-copy">
      <p class="eyebrow">Official Client Mirror Access</p>
      <h1 class="hero-title">
        不想再为<br>
        官方客户端<br>
        <span>付更贵？</span>
      </h1>

      <div class="chat-stack" aria-label="产品介绍对话">
        <div class="chat-row">
          <div class="chat-bubble chat-bubble--muted">我想直接用 GPT / Codex。</div>
        </div>
        <div class="chat-row chat-row--reply">
          <div class="chat-bubble chat-bubble--accent">那就别买贵的。一个订阅，直接上。</div>
        </div>
        <div class="chat-row">
          <div class="chat-bubble chat-bubble--muted">是官方客户端镜像接入，不是缩水版，也不是只卖 API 点数。</div>
        </div>
      </div>

      <div class="hero-actions">
        <a class="button button--solid" href="./buy.html?plan=plus-monthly">购买 Plus 月卡</a>
        <a class="button button--ghost" href="#pricing">查看套餐</a>
      </div>
    </div>

    <aside class="hero-side-card" aria-label="主推套餐">
      <p class="card-label">Most Popular</p>
      <h2>Plus 月卡</h2>
      <p class="price">¥99</p>
      <p class="card-meta">100 刀 / 天<br>30 天有效</p>
      <a class="button button--solid-dark" href="./buy.html?plan=plus-monthly">购买 Plus 月卡</a>
    </aside>
  </section>

  <p class="hero-summary">一个订阅，直接覆盖 GPT / Codex</p>
</main>
```

Replace `/Users/Shake/Documents/App/Brioi/styles.css` with:

```css
:root {
  --bg: #ffffff;
  --text: #000000;
  --muted: #4b5563;
  --panel: #f3f4f6;
  --accent: #5be139;
  --accent-bright: #8dfc4f;
  --line: #e5e7eb;
  --radius-lg: 24px;
  --radius-xl: 30px;
  --shadow-strong: 0 24px 50px rgba(91, 225, 57, 0.14), 0 10px 20px rgba(0, 0, 0, 0.08);
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: "Inter Tight", "Inter", "Helvetica Neue", Arial, sans-serif;
}

a {
  color: inherit;
  text-decoration: none;
}

.site-nav,
main {
  width: min(1200px, calc(100% - 48px));
  margin: 0 auto;
}

.site-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 0 8px;
}

.brand {
  font-size: 1rem;
  font-weight: 800;
}

.nav-cta,
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 14px 20px;
  font-weight: 700;
}

.nav-cta,
.button--solid,
.button--solid-dark {
  background: #000;
  color: #fff;
}

.button--ghost {
  background: var(--panel);
  color: #111;
}

.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(300px, 0.9fr);
  gap: 32px;
  align-items: start;
  padding: 32px 0 24px;
}

.eyebrow,
.card-label {
  margin: 0 0 16px;
  font-family: "SFMono-Regular", Consolas, monospace;
  font-size: 0.75rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #6b7280;
}

.hero-title {
  margin: 0 0 32px;
  font-size: clamp(3.5rem, 8vw, 7rem);
  line-height: 0.92;
  letter-spacing: -0.06em;
}

.hero-title span,
.price,
.hero-summary span {
  color: var(--accent);
}

.chat-stack {
  display: grid;
  gap: 14px;
  max-width: 560px;
}

.chat-row {
  display: flex;
}

.chat-row--reply {
  justify-content: flex-end;
}

.chat-bubble {
  max-width: 420px;
  border-radius: 22px;
  padding: 16px 18px;
  font-size: 1.05rem;
  line-height: 1.6;
  font-weight: 600;
}

.chat-bubble--muted {
  background: var(--panel);
}

.chat-bubble--accent {
  background: var(--accent);
  color: #071006;
}

.hero-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  flex-wrap: wrap;
}

.hero-side-card {
  border: 1px solid var(--line);
  border-radius: var(--radius-xl);
  padding: 24px;
  background: linear-gradient(180deg, #ffffff 0%, #f7ffef 100%);
  box-shadow: var(--shadow-strong);
}

.hero-side-card h2 {
  margin: 0 0 12px;
  font-size: 2rem;
}

.price {
  margin: 0 0 12px;
  font-size: clamp(3rem, 10vw, 4.5rem);
  line-height: 0.95;
  letter-spacing: -0.06em;
  font-weight: 800;
}

.card-meta,
.hero-summary {
  color: var(--muted);
}

.hero-summary {
  margin: 0;
  padding: 16px 0 64px;
  text-align: center;
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  line-height: 1.5;
}
```

- [ ] **Step 4: Run the hero test to verify it passes**

Run:

```bash
npm test -- --grep "hero shows the approved price-first message and a single plus card"
```

Expected: PASS

- [ ] **Step 5: Commit**

Run:

```bash
git add index.html styles.css tests/homepage.spec.js
git commit -m "实现 Brioi API 首页的视觉基线与首屏内容，落地大标题、对话气泡和 Plus 月卡主推卡片，先把价格优先且接近参考风格的核心叙事稳定下来"
```

## Task 3: Implement The Introduction, FAQ, And Footer

**Files:**
- Modify: `/Users/Shake/Documents/App/Brioi/index.html`
- Modify: `/Users/Shake/Documents/App/Brioi/styles.css`
- Modify: `/Users/Shake/Documents/App/Brioi/tests/homepage.spec.js`

- [ ] **Step 1: Write the failing introduction and FAQ test**

Append to `/Users/Shake/Documents/App/Brioi/tests/homepage.spec.js`:

```js
test('homepage includes the editorial intro blocks and approved FAQ copy', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 2, name: '官方客户端。别买贵的。' })).toBeVisible();
  await expect(page.getByText('GPT / Codex 直接用。')).toBeVisible();
  await expect(page.getByText('不是缩水版，也不是纯点数站。')).toBeVisible();
  await expect(page.getByText('购买放在单独页面，首页只负责说明白和卖清楚。')).toBeVisible();

  await expect(page.getByRole('heading', { level: 2, name: '你会问的，先回答。' })).toBeVisible();
  await expect(page.getByText('支持哪些客户端？')).toBeVisible();
  await expect(page.getByText('这是官方客户端接入，还是 API 点数？')).toBeVisible();
  await expect(page.getByText('额度怎么计算？')).toBeVisible();
  await expect(page.getByText('购买后去哪里？')).toBeVisible();
  await expect(page.getByText('哪个套餐最适合大多数人？')).toBeVisible();
});
```

- [ ] **Step 2: Run the introduction and FAQ test to verify it fails**

Run:

```bash
npm test -- --grep "homepage includes the editorial intro blocks and approved FAQ copy"
```

Expected: FAIL because the introduction, FAQ, and footer sections have not been added yet.

- [ ] **Step 3: Write the minimal implementation for introduction, FAQ, and footer**

Replace the current closing portion of `/Users/Shake/Documents/App/Brioi/index.html`, starting immediately after `<p class="hero-summary">一个订阅，直接覆盖 GPT / Codex</p>`, with:

```html
<section class="editorial-blocks" aria-labelledby="intro-title">
  <div class="section-heading">
    <p class="eyebrow">Why Brioi API</p>
    <h2 id="intro-title">官方客户端。别买贵的。</h2>
  </div>

  <div class="intro-grid">
    <article class="info-card">
      <p class="card-label">Direct</p>
      <h3>GPT / Codex 直接用。</h3>
    </article>
    <article class="info-card">
      <p class="card-label">Mirror</p>
      <h3>不是缩水版，也不是纯点数站。</h3>
    </article>
    <article class="info-card">
      <p class="card-label">Checkout</p>
      <h3>购买放在单独页面，首页只负责说明白和卖清楚。</h3>
    </article>
  </div>
</section>

<section class="faq" aria-labelledby="faq-title">
  <div class="section-heading">
    <p class="eyebrow">FAQ</p>
    <h2 id="faq-title">你会问的，先回答。</h2>
  </div>

  <div class="faq-list">
    <article class="faq-item">
      <h3>支持哪些客户端？</h3>
      <p>目前只支持 GPT、Codex，其他暂不支持。</p>
    </article>
    <article class="faq-item">
      <h3>这是官方客户端接入，还是 API 点数？</h3>
      <p>这是官方客户端镜像接入与订阅通道，不是只卖 API 点数。</p>
    </article>
    <article class="faq-item">
      <h3>额度怎么计算？</h3>
      <p>周卡和月卡均按每日额度展示，月卡有效期为 30 天。</p>
    </article>
    <article class="faq-item">
      <h3>购买后去哪里？</h3>
      <p>所有首页 CTA 统一进入购买页。</p>
    </article>
    <article class="faq-item">
      <h3>哪个套餐最适合大多数人？</h3>
      <p>默认推荐 Plus 月卡 ¥99，适合大多数长期使用场景。</p>
    </article>
  </div>
</section>
</main>

<footer class="site-footer">
  <div class="footer-inner">
    <p class="brand">Brioi API</p>
    <p class="footer-copy">给官方客户端一个更划算的入口。</p>
    <a class="button button--solid" href="./buy.html">立即购买</a>
  </div>
</footer>
```

Append to `/Users/Shake/Documents/App/Brioi/styles.css`:

```css
.section-heading {
  margin-bottom: 24px;
}

.section-heading h2 {
  margin: 0;
  font-size: clamp(2.5rem, 6vw, 4rem);
  line-height: 0.98;
  letter-spacing: -0.05em;
}

.editorial-blocks,
.faq {
  padding: 48px 0 72px;
}

.intro-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.info-card,
.faq-item {
  border-radius: 26px;
  padding: 24px;
  background: var(--panel);
}

.info-card h3,
.faq-item h3 {
  margin: 0;
  font-size: 1.6rem;
  line-height: 1.2;
}

.faq-list {
  display: grid;
  gap: 16px;
}

.faq-item p,
.footer-copy {
  margin: 12px 0 0;
  font-size: 1rem;
  line-height: 1.7;
  color: var(--muted);
}

.site-footer {
  border-top: 1px solid var(--line);
  padding: 32px 24px 48px;
}

.footer-inner {
  width: min(1200px, calc(100% - 48px));
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
```

- [ ] **Step 4: Run the introduction and FAQ test to verify it passes**

Run:

```bash
npm test -- --grep "homepage includes the editorial intro blocks and approved FAQ copy"
```

Expected: PASS

- [ ] **Step 5: Commit**

Run:

```bash
git add index.html styles.css tests/homepage.spec.js
git commit -m "补齐首页中段的编辑感介绍区、FAQ 和极简页尾，把产品理解、信任补充和购买入口串成完整叙事，避免页面只剩下一个首屏而缺少后续承接"
```

## Task 4: Implement The Pricing Tabs And Uniform Card Groups

**Files:**
- Modify: `/Users/Shake/Documents/App/Brioi/index.html`
- Modify: `/Users/Shake/Documents/App/Brioi/styles.css`
- Modify: `/Users/Shake/Documents/App/Brioi/main.js`
- Modify: `/Users/Shake/Documents/App/Brioi/tests/homepage.spec.js`

- [ ] **Step 1: Write the failing pricing interaction test**

Append to `/Users/Shake/Documents/App/Brioi/tests/homepage.spec.js`:

```js
test('pricing defaults to monthly plans and switches to experience plans', async ({ page }) => {
  await page.goto('/');

  const monthlyTab = page.getByRole('tab', { name: '月卡套餐' });
  const experienceTab = page.getByRole('tab', { name: '体验套餐' });
  const monthlyPanel = page.locator('#panel-monthly');
  const experiencePanel = page.locator('#panel-experience');

  await expect(monthlyTab).toHaveAttribute('aria-selected', 'true');
  await expect(monthlyPanel).toBeVisible();
  await expect(monthlyPanel.getByText('Plus 月卡')).toBeVisible();
  await expect(monthlyPanel.getByText('Pro 月卡')).toBeVisible();
  await expect(monthlyPanel.getByText('Max 月卡')).toBeVisible();

  await experienceTab.click();

  await expect(experienceTab).toHaveAttribute('aria-selected', 'true');
  await expect(monthlyPanel).toBeHidden();
  await expect(experiencePanel).toBeVisible();
  await expect(experiencePanel.getByText('日卡')).toBeVisible();
  await expect(experiencePanel.getByText('周卡')).toBeVisible();
});
```

- [ ] **Step 2: Run the pricing test to verify it fails**

Run:

```bash
npm test -- --grep "pricing defaults to monthly plans and switches to experience plans"
```

Expected: FAIL because the pricing section, tabs, panels, and switching logic do not exist yet.

- [ ] **Step 3: Write the minimal pricing markup, styles, and tab logic**

Insert this section before `<section class="faq"` in `/Users/Shake/Documents/App/Brioi/index.html`:

```html
<section id="pricing" class="pricing" aria-labelledby="pricing-title">
  <div class="section-heading">
    <p class="eyebrow">Pricing</p>
    <h2 id="pricing-title">选一个方案。直接开用。</h2>
  </div>

  <div class="pricing-tabs" role="tablist" aria-label="订阅方案分类">
    <button class="pricing-tab" id="tab-experience" role="tab" aria-controls="panel-experience" aria-selected="false" data-target="experience">体验套餐</button>
    <button class="pricing-tab is-active" id="tab-monthly" role="tab" aria-controls="panel-monthly" aria-selected="true" data-target="monthly">月卡套餐</button>
  </div>

  <div class="pricing-panel" id="panel-experience" role="tabpanel" aria-labelledby="tab-experience" hidden>
    <article class="plan-card">
      <p class="card-label">Entry</p>
      <h3>日卡</h3>
      <p class="price-inline">免费</p>
      <p class="plan-meta">20 刀 免费使用</p>
      <a class="button button--ghost" href="./buy.html?plan=day-pass">购买日卡</a>
    </article>
    <article class="plan-card plan-card--featured">
      <p class="card-label">Fast Start</p>
      <h3>周卡</h3>
      <p class="price-inline">¥29.9</p>
      <p class="plan-meta">100 刀 / 天</p>
      <a class="button button--solid" href="./buy.html?plan=week-pass">购买周卡</a>
    </article>
  </div>

  <div class="pricing-panel pricing-panel--default" id="panel-monthly" role="tabpanel" aria-labelledby="tab-monthly">
    <article class="plan-card plan-card--featured">
      <p class="card-label">Recommended</p>
      <h3>Plus 月卡</h3>
      <p class="price-inline">¥99</p>
      <p class="plan-meta">100 刀 / 天<br>30 天</p>
      <a class="button button--solid" href="./buy.html?plan=plus-monthly">购买 Plus</a>
    </article>
    <article class="plan-card">
      <p class="card-label">Monthly</p>
      <h3>Pro 月卡</h3>
      <p class="price-inline">¥199</p>
      <p class="plan-meta">200 刀 / 天<br>30 天</p>
      <a class="button button--ghost" href="./buy.html?plan=pro-monthly">购买 Pro</a>
    </article>
    <article class="plan-card">
      <p class="card-label">Monthly</p>
      <h3>Max 月卡</h3>
      <p class="price-inline">¥499</p>
      <p class="plan-meta">600 刀 / 天<br>30 天</p>
      <a class="button button--ghost" href="./buy.html?plan=max-monthly">购买 Max</a>
    </article>
  </div>
</section>
```

Append to `/Users/Shake/Documents/App/Brioi/styles.css`:

```css
.pricing {
  padding: 32px 0 72px;
}

.pricing-tabs {
  display: inline-flex;
  gap: 6px;
  margin-bottom: 28px;
  padding: 4px;
  border-radius: 999px;
  background: var(--panel);
}

.pricing-tab {
  border: 0;
  border-radius: 999px;
  padding: 12px 18px;
  background: transparent;
  font: inherit;
  font-weight: 700;
}

.pricing-tab.is-active {
  background: #000;
  color: #fff;
}

.pricing-panel {
  display: grid;
  gap: 18px;
}

.pricing-panel--default {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.pricing-panel:not(.pricing-panel--default) {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.plan-card {
  display: flex;
  flex-direction: column;
  min-height: 320px;
  border-radius: 28px;
  padding: 24px;
  background: var(--panel);
}

.plan-card--featured {
  background: #000;
  color: #fff;
}

.plan-card--featured .price-inline {
  color: var(--accent);
}

.price-inline {
  margin: 0 0 12px;
  font-size: 3rem;
  line-height: 0.95;
  letter-spacing: -0.05em;
  font-weight: 800;
}

.plan-meta {
  margin: 0 0 20px;
  color: var(--muted);
  line-height: 1.7;
}

.plan-card--featured .plan-meta {
  color: #d1d5db;
}

.plan-card .button {
  margin-top: auto;
}
```

Replace `/Users/Shake/Documents/App/Brioi/main.js` with:

```js
document.documentElement.classList.add('js');

function initPricingTabs() {
  const tabs = [...document.querySelectorAll('.pricing-tab')];
  const panels = {
    experience: document.getElementById('panel-experience'),
    monthly: document.getElementById('panel-monthly')
  };

  if (!tabs.length || !panels.experience || !panels.monthly) {
    return;
  }

  function activate(target) {
    tabs.forEach((tab) => {
      const selected = tab.dataset.target === target;
      tab.classList.toggle('is-active', selected);
      tab.setAttribute('aria-selected', String(selected));
    });

    Object.entries(panels).forEach(([key, panel]) => {
      panel.hidden = key !== target;
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => activate(tab.dataset.target));
  });

  activate('monthly');
}

if (document.body.dataset.page === 'home') {
  initPricingTabs();
}
```

- [ ] **Step 4: Run the pricing test to verify it passes**

Run:

```bash
npm test -- --grep "pricing defaults to monthly plans and switches to experience plans"
```

Expected: PASS

- [ ] **Step 5: Commit**

Run:

```bash
git add index.html styles.css main.js tests/homepage.spec.js
git commit -m "实现参考定价逻辑的分类 tab 价格区，区分体验套餐和月卡套餐并突出 Plus 方案，让首页的价格比较更清楚且保留统一卡片结构"
```

## Task 5: Wire All Purchase Actions To The Buy Page

**Files:**
- Modify: `/Users/Shake/Documents/App/Brioi/buy.html`
- Modify: `/Users/Shake/Documents/App/Brioi/main.js`
- Modify: `/Users/Shake/Documents/App/Brioi/tests/homepage.spec.js`

- [ ] **Step 1: Write the failing buy-page selection test**

Append to `/Users/Shake/Documents/App/Brioi/tests/homepage.spec.js`:

```js
test('buy page shows the selected plan from the query string', async ({ page }) => {
  await page.goto('/buy.html?plan=plus-monthly');

  await expect(page.getByRole('heading', { level: 1, name: '购买 Brioi API' })).toBeVisible();
  await expect(page.getByText('已选择：Plus 月卡')).toBeVisible();
});
```

- [ ] **Step 2: Run the buy-page test to verify it fails**

Run:

```bash
npm test -- --grep "buy page shows the selected plan from the query string"
```

Expected: FAIL because the buy page does not yet surface the selected plan.

- [ ] **Step 3: Write the minimal buy-page implementation**

Replace `/Users/Shake/Documents/App/Brioi/buy.html` with:

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>购买 Brioi API</title>
    <link rel="stylesheet" href="./styles.css">
    <script defer src="./main.js"></script>
  </head>
  <body data-page="buy">
    <main class="buy-page">
      <p class="eyebrow">Checkout</p>
      <h1>购买 Brioi API</h1>
      <p class="buy-copy">选择好套餐后继续接入支付或客服流程。</p>
      <div class="buy-card">
        <p class="card-label">Selected Plan</p>
        <p class="buy-plan" data-selected-plan>已选择：Plus 月卡</p>
      </div>
      <a class="button button--solid" href="./index.html">返回首页</a>
    </main>
  </body>
</html>
```

Append to `/Users/Shake/Documents/App/Brioi/styles.css`:

```css
.buy-page {
  width: min(720px, calc(100% - 48px));
  margin: 0 auto;
  padding: 80px 0;
}

.buy-page h1 {
  margin: 0 0 12px;
  font-size: clamp(3rem, 7vw, 5rem);
  line-height: 0.94;
  letter-spacing: -0.05em;
}

.buy-copy {
  margin: 0 0 24px;
  color: var(--muted);
  line-height: 1.7;
}

.buy-card {
  margin-bottom: 24px;
  border-radius: 28px;
  padding: 24px;
  background: var(--panel);
}

.buy-plan {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}
```

Replace `/Users/Shake/Documents/App/Brioi/main.js` with:

```js
document.documentElement.classList.add('js');

const PLAN_LABELS = {
  'day-pass': '日卡',
  'week-pass': '周卡',
  'plus-monthly': 'Plus 月卡',
  'pro-monthly': 'Pro 月卡',
  'max-monthly': 'Max 月卡'
};

function initPricingTabs() {
  const tabs = [...document.querySelectorAll('.pricing-tab')];
  const panels = {
    experience: document.getElementById('panel-experience'),
    monthly: document.getElementById('panel-monthly')
  };

  if (!tabs.length || !panels.experience || !panels.monthly) {
    return;
  }

  function activate(target) {
    tabs.forEach((tab) => {
      const selected = tab.dataset.target === target;
      tab.classList.toggle('is-active', selected);
      tab.setAttribute('aria-selected', String(selected));
    });

    Object.entries(panels).forEach(([key, panel]) => {
      panel.hidden = key !== target;
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => activate(tab.dataset.target));
  });

  activate('monthly');
}

function initBuyPage() {
  const selectedPlan = document.querySelector('[data-selected-plan]');

  if (!selectedPlan) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const planKey = params.get('plan');
  const label = PLAN_LABELS[planKey] ?? 'Plus 月卡';

  selectedPlan.textContent = `已选择：${label}`;
}

if (document.body.dataset.page === 'home') {
  initPricingTabs();
}

if (document.body.dataset.page === 'buy') {
  initBuyPage();
}
```

- [ ] **Step 4: Run the buy-page test to verify it passes**

Run:

```bash
npm test -- --grep "buy page shows the selected plan from the query string"
```

Expected: PASS

- [ ] **Step 5: Commit**

Run:

```bash
git add buy.html styles.css main.js tests/homepage.spec.js
git commit -m "把首页所有购买动作统一接到独立购买页，并在购买页读取套餐参数展示用户当前选择，先打通从展示到下单承接的最短路径"
```

## Task 6: Make The Page Responsive And Preserve No-JS Readability

**Files:**
- Modify: `/Users/Shake/Documents/App/Brioi/styles.css`
- Modify: `/Users/Shake/Documents/App/Brioi/tests/homepage.spec.js`

- [ ] **Step 1: Write the failing mobile and no-JS tests**

Append to `/Users/Shake/Documents/App/Brioi/tests/homepage.spec.js`:

```js
test('mobile layout stacks the hero card below the hero copy', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const copyBox = await page.locator('.hero-copy').boundingBox();
  const cardBox = await page.locator('.hero-side-card').boundingBox();

  expect(copyBox).not.toBeNull();
  expect(cardBox).not.toBeNull();
  expect(cardBox.y).toBeGreaterThan(copyBox.y);
});

test.describe('homepage without javascript', () => {
  test.use({ javaScriptEnabled: false });

  test('still shows the monthly pricing group and working links', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('Plus 月卡')).toBeVisible();
    await expect(page.getByRole('link', { name: '购买 Plus' })).toHaveAttribute('href', './buy.html?plan=plus-monthly');
  });
});
```

- [ ] **Step 2: Run the mobile and no-JS tests to verify they fail**

Run:

```bash
npm test -- --grep "mobile layout stacks the hero card below the hero copy|homepage without javascript"
```

Expected: FAIL because the page does not yet include the responsive layout rules needed for mobile and may not preserve the intended reading flow cleanly.

- [ ] **Step 3: Add responsive layout rules and no-JS-safe spacing**

Append to `/Users/Shake/Documents/App/Brioi/styles.css`:

```css
@media (max-width: 960px) {
  .hero {
    grid-template-columns: 1fr;
  }

  .intro-grid,
  .pricing-panel--default,
  .pricing-panel:not(.pricing-panel--default) {
    grid-template-columns: 1fr;
  }

  .footer-inner {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 720px) {
  .site-nav,
  main,
  .footer-inner,
  .buy-page {
    width: min(100% - 32px, 680px);
  }

  .site-nav {
    padding-top: 18px;
  }

  .hero {
    gap: 24px;
    padding-top: 24px;
  }

  .hero-title,
  .section-heading h2,
  .buy-page h1 {
    text-wrap: balance;
  }

  .chat-bubble {
    max-width: 100%;
    font-size: 1rem;
  }

  .pricing-tabs {
    width: 100%;
    justify-content: space-between;
  }

  .pricing-tab {
    flex: 1;
  }
}
```

- [ ] **Step 4: Run the full test suite**

Run:

```bash
npm test
```

Expected: PASS for all homepage and buy-page checks.

- [ ] **Step 5: Manual verification and commit**

Run:

```bash
npm run dev
```

Then manually verify:

- Desktop: homepage sections order matches the spec
- Desktop: hero title remains dominant over the right-side price card
- Mobile viewport: hero stacks into a single column and tabs remain usable
- Mobile viewport: FAQ items remain readable without cramped text
- Homepage and buy page both render correctly after direct refresh

After manual verification, commit:

```bash
git add styles.css tests/homepage.spec.js
git commit -m "补齐首页与购买页的响应式规则和无脚本可读性校验，确保移动端布局不退化成普通模板页并让核心购买路径在静态场景下依然稳定可用"
```

## Spec Coverage Check

- Hero title, chat bubbles, and single Plus card: covered in Task 2
- Editorial website introduction section: covered in Task 3
- Pricing tabs with experience and monthly grouping: covered in Task 4
- Dedicated buy page and purchase routing: covered in Task 5
- FAQ block and minimal footer: covered in Task 3
- Mobile layout and no-JS readability: covered in Task 6
- Browser-level verification: introduced in Task 1 and expanded through Task 6

## Risks To Watch During Execution

- Do not let the pricing section regress into mismatched card heights or too many visual variants.
- Do not overuse the green accent; keep it concentrated on title emphasis, the active tab, and featured prices.
- Do not replace the FAQ block with tiny accordion rows unless a subsequent review explicitly asks for that change.
- Do not add framework tooling or a build step; keep the implementation static.
