# Preserved Mainline WIP Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the preserved Brioi homepage and docs changes onto the current multi-site `main` branch without regressing the shipped site structure.

**Architecture:** Keep the existing multi-site runtime intact and port only user-facing copy/layout changes into the active mainline files. Drive every behavior change through Playwright first, then update `sites/brioi/index.html`, `docs.html`, and `styles/styles.css` until the targeted assertions and the full suite pass again.

**Tech Stack:** Static HTML, shared CSS, Playwright, `http-server`

---

### Task 1: Lock the migrated behavior in Playwright first

**Files:**
- Modify: `tests/homepage.spec.js`
- Test: `tests/homepage.spec.js`

- [ ] **Step 1: Write the failing test for the Brioi homepage copy changes**

```js
test('brioi homepage exposes the migrated support and pricing copy', async ({ page }) => {
  await page.goto('/sites/brioi/index.html');

  await expect(page.getByRole('heading', { level: 4, name: '专属售后随时待命' })).toBeVisible();

  const periodicPanel = page.locator('#pricing-periodic');
  await expect(periodicPanel.getByText('支持 1 线程并发')).toBeVisible();
  await expect(periodicPanel.getByText('支持 3 线程并发')).toBeVisible();
  await expect(periodicPanel.getByText('支持 10 线程并发')).toBeVisible();

  await page.getByRole('tab', { name: '更多套餐' }).click();
  const morePanel = page.locator('#pricing-more');
  await expect(morePanel.getByText('¥5')).toBeVisible();
  await expect(morePanel.getByText('充 100 送 100')).toBeVisible();
  await expect(morePanel.locator('.price-bento-card').last().getByRole('link', { name: '立即开通' })).toHaveClass(/button--secondary/);
});
```

- [ ] **Step 2: Write the failing test for the compact docs quick-start layout**

```js
test('docs page uses the compact quick start layout without the reference table', async ({ page }) => {
  await page.goto('/docs.html');

  await expect(page.locator('.docs-quickstart')).toBeVisible();
  await expect(page.locator('.docs-step-list')).toBeVisible();
  await expect(page.locator('.docs-step-item')).toHaveCount(3);
  await expect(page.getByText('配置速查表')).toHaveCount(0);
  await expect(page.locator('.docs-reference-table')).toHaveCount(0);
});
```

- [ ] **Step 3: Run the targeted tests to verify they fail for the expected reasons**

Run:

```bash
npx playwright test tests/homepage.spec.js --grep "migrated support and pricing copy|compact quick start layout"
```

Expected:

```text
FAIL tests/homepage.spec.js
- Brioi page still shows 7x24h / old pricing bullet copy
- Docs page still renders .docs-steps-grid and 配置速查表
```

- [ ] **Step 4: Commit the red-phase test changes**

```bash
git add tests/homepage.spec.js
git commit -m "补充保留改动迁移前的 Playwright 红灯断言，先锁定 Brioi 套餐文案、售后标题以及 docs 紧凑快速开始布局的目标行为，确保后续移植不是凭肉眼猜测页面结果。"
```

### Task 2: Port the Brioi homepage content changes into the live multi-site entry

**Files:**
- Modify: `sites/brioi/index.html`
- Test: `tests/homepage.spec.js`

- [ ] **Step 1: Update the Brioi support feature title and periodic plan bullets**

```html
<h4 class="feature-title">专属售后随时待命</h4>
...
<ul class="price-features">
  <li>日额度 $30 + 赠送 $30</li>
  <li>支持 1 线程并发</li>
  <li>高速优质线路通道</li>
</ul>
...
<ul class="price-features">
  <li>日额度 $100 + 赠送 $100</li>
  <li>支持 3 线程并发</li>
  <li>高速优质线路通道</li>
</ul>
...
<ul class="price-features">
  <li>日额度 $300 + 赠送 $300</li>
  <li>支持 10 线程并发</li>
  <li>面向更高负载与持续输出</li>
</ul>
```

- [ ] **Step 2: Port the “更多套餐” panel values and emphasis levels**

```html
<div class="pricing-content" id="pricing-more" role="tabpanel">
  <div class="pricing-bento-layout pricing-bento-layout--compact">
    <div class="price-bento-card">
      <p class="price-label">PAY-AS-YOU-GO</p>
      <h3 class="price-name">按量付费</h3>
      <div class="price-amount-wrap">
        <span class="price-currency">¥</span><span class="price-amount">5</span><span class="price-period">起充</span>
      </div>
      <p class="price-desc">充值 ¥10 即可获得 $10 （价值约 ¥70）专属额度，灵活无负担。</p>
    </div>
    <div class="price-bento-card price-bento-card--featured">
      <div class="price-badge">充值推荐</div>
      <p class="price-label text-emerald">BONUS RECHARGE</p>
      <h3 class="price-name">充 100 送 100</h3>
    </div>
    <div class="price-bento-card">
      <p class="price-label">ENTERPRISE</p>
      <h3 class="price-name">企业定制</h3>
      <a class="button button--secondary button--block" href="#" data-modal="contact">立即开通</a>
    </div>
  </div>
</div>
```

- [ ] **Step 3: Run the homepage-focused tests to verify they pass**

Run:

```bash
npx playwright test tests/homepage.spec.js --grep "migrated support and pricing copy|pricing defaults to periodic plans and switches to the more plans panel"
```

Expected:

```text
2 passed
```

- [ ] **Step 4: Commit the homepage migration**

```bash
git add sites/brioi/index.html tests/homepage.spec.js
git commit -m "把保留分支中的 Brioi 首页有效内容变更迁移到多站点主线入口，更新售后标题、周期套餐并发表达和更多套餐展示层级，同时保持现有多域名结构与运行时配置不回退。"
```

### Task 3: Port the docs quick-start redesign into the shared docs page and stylesheet

**Files:**
- Modify: `docs.html`
- Modify: `styles/styles.css`
- Modify: `tests/homepage.spec.js`
- Test: `tests/homepage.spec.js`

- [ ] **Step 1: Replace the docs quick-start markup and remove the reference table block**

```html
<div class="docs-quickstart">
  <p class="docs-paragraph">如果你只想尽快接入，按下面三步做即可。先创建一把新 Key，再打开后台“使用 API 密钥”弹窗，最后把对应客户端模板直接填到本地配置里。</p>
  <ol class="docs-step-list">
    <li class="docs-step-item">
      <h3>创建密钥</h3>
      <p>控制台进入 API Keys 页面。创建后的完整密钥通常只展示一次，建议按客户端分别创建，便于后续轮换。</p>
    </li>
    <li class="docs-step-item">
      <h3>选择对应模板</h3>
      <p>弹窗内置 <code>Codex CLI</code>、<code>Codex CLI (WebSocket)</code>、<code>Claude Code</code>、<code>OpenCode</code>。OpenClaw 不在弹窗内，本页单独补充。</p>
    </li>
    <li class="docs-step-item">
      <h3>原样填入配置</h3>
      <p>Codex 与 Claude Code 模板直接使用弹窗里给出的根 Base URL。OpenCode 模板会在根地址基础上补成 <code>/v1</code>。保存后重开终端或客户端再验证。</p>
    </li>
  </ol>
</div>
```

- [ ] **Step 2: Add the matching shared docs styles**

```css
.docs-quickstart,
.docs-check-card {
  background: #FFFEFC;
  border: 1px solid #E7E5E4;
  border-radius: 16px;
  box-shadow: none;
}

.docs-quickstart {
  padding: 24px 24px 8px;
}

.docs-step-list {
  list-style: none;
  margin-top: 20px;
  padding: 0;
  border-top: 1px solid #E7E5E4;
}

.docs-step-item {
  padding: 18px 0 18px 42px;
  border-bottom: 1px solid #E7E5E4;
  position: relative;
}
```

- [ ] **Step 3: Update the docs assertions to match the compact layout**

```js
await expect(page.locator('.docs-quickstart')).toBeVisible();
await expect(page.locator('.docs-step-list')).toBeVisible();
await expect(page.locator('.docs-step-item')).toHaveCount(3);
await expect(page.locator('.docs-reference-table')).toHaveCount(0);
await expect(page.getByText('配置速查表')).toHaveCount(0);
```

- [ ] **Step 4: Run the docs-focused tests to verify they pass**

Run:

```bash
npx playwright test tests/homepage.spec.js --grep "docs page matches the real sub2api api-key modal structure|compact quick start layout"
```

Expected:

```text
2 passed
```

- [ ] **Step 5: Commit the docs migration**

```bash
git add docs.html styles/styles.css tests/homepage.spec.js
git commit -m "把保留分支中的 docs 快速开始改版迁移到主线文档页，移除旧速查表表格并同步共享样式与回归断言，确保主线继续沿用当前多站点接线但呈现更紧凑的接入说明。"
```

### Task 4: Run full verification and publish the updated mainline

**Files:**
- Modify: `sites/brioi/index.html`
- Modify: `docs.html`
- Modify: `styles/styles.css`
- Modify: `tests/homepage.spec.js`
- Test: `tests/homepage.spec.js`

- [ ] **Step 1: Run the full Playwright suite**

Run:

```bash
npm test
```

Expected:

```text
17 passed
```

- [ ] **Step 2: Inspect the working tree to verify only intended files changed**

Run:

```bash
git status --short
git diff -- sites/brioi/index.html docs.html styles/styles.css tests/homepage.spec.js
```

Expected:

```text
Only the four planned mainline files appear in the final implementation diff.
```

- [ ] **Step 3: Create the final integration commit**

```bash
git add sites/brioi/index.html docs.html styles/styles.css tests/homepage.spec.js
git commit -m "整理并迁移保留分支中的有效页面改动到 main 主线，在不回退多站点架构的前提下更新 Brioi 首页套餐与售后文案、压缩 docs 快速开始布局，并以 Playwright 全量验证锁定最终行为。"
```

- [ ] **Step 4: Push the updated main branch**

```bash
git push origin main
```

- [ ] **Step 5: Report the preserved exclusions explicitly**

```text
Confirm that .tmp-home-hero-chat-restored.png, styles.css.backup, the four *-text.svg assets, and the two untracked plan files were left out of main.
```
