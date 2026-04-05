# Brioi Supported Software Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage intro cards with a four-up supported software showcase and a modal-based usage guide that matches the existing Brioi visual system.

**Architecture:** Keep the homepage as a static HTML/CSS/JS page. Render the four software cards directly in `index.html`, style them with the existing token system in `styles.css`, and drive a single shared modal from a small software-data map in `main.js`. Update Playwright coverage so the new section, modal interaction, and layout behavior are protected by browser tests.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, Playwright

---

## File Structure

- Modify: `/Users/Shake/Documents/App/Brioi/index.html`
  Responsibility: replace the current intro grid with the supported software section, update the conflicting FAQ client copy, and add the shared modal shell.
- Modify: `/Users/Shake/Documents/App/Brioi/styles.css`
  Responsibility: replace intro-card styling with the strong visual vertical card layout, add responsive behavior, and style the modal overlay/dialog.
- Modify: `/Users/Shake/Documents/App/Brioi/main.js`
  Responsibility: add the software usage data map and the modal open/close behavior for the four `使用方式` buttons.
- Modify: `/Users/Shake/Documents/App/Brioi/tests/homepage.spec.js`
  Responsibility: remove assertions tied to the retired intro cards, cover the new supported software section, verify the FAQ is no longer contradictory, and test the modal interaction plus desktop card layout.

## Task 1: Replace The Retired Intro Copy With Supported Software Cards

**Files:**
- Modify: `/Users/Shake/Documents/App/Brioi/tests/homepage.spec.js`
- Modify: `/Users/Shake/Documents/App/Brioi/index.html`

- [ ] **Step 1: Replace the outdated intro/FAQ test with a failing supported-software test**

Replace the existing `homepage includes the editorial intro blocks and approved FAQ copy` test in `/Users/Shake/Documents/App/Brioi/tests/homepage.spec.js` with:

```js
test('homepage lists supported software cards and updated client FAQ copy', async ({ page }) => {
  await page.goto('/');

  const softwareSection = page.locator('.editorial-blocks');
  const faq = page.locator('.faq');
  const footer = page.locator('.site-footer');

  await expect(softwareSection.getByRole('heading', { level: 2, name: '支持的软件。直接开用。' })).toBeVisible();
  await expect(softwareSection.locator('.software-card')).toHaveCount(4);

  for (const name of ['Codex', 'Claude Code', 'OpenCode', 'OpenClaw']) {
    const card = softwareSection.locator('.software-card').filter({ hasText: name });

    await expect(card.getByRole('heading', { level: 3, name })).toBeVisible();
    await expect(card.getByRole('button', { name: '使用方式' })).toBeVisible();
  }

  await expect(faq.getByRole('heading', { level: 2, name: '你会问的，先回答。' })).toBeVisible();
  await expect(faq.getByRole('heading', { level: 3, name: '支持哪些软件？' })).toBeVisible();
  await expect(faq.getByText('目前支持 Codex、Claude Code、OpenCode、OpenClaw。')).toBeVisible();
  await expect(page.locator('body')).not.toContainText('GPT / Codex 直接用。');
  await expect(page.locator('body')).not.toContainText('不是缩水版，也不是纯点数站。');
  await expect(faq.getByRole('heading', { level: 3, name: '这是官方客户端接入，还是 API 点数？' })).toBeVisible();
  await expect(faq.getByText('这是官方客户端镜像接入与订阅通道，不是只卖 API 点数。')).toBeVisible();
  await expect(faq.getByRole('heading', { level: 3, name: '额度怎么计算？' })).toBeVisible();
  await expect(faq.getByText('周卡和月卡均按每日额度展示，月卡有效期为 30 天。')).toBeVisible();
  await expect(faq.getByRole('heading', { level: 3, name: '购买后去哪里？' })).toBeVisible();
  await expect(faq.getByText('所有首页 CTA 统一进入购买页。')).toBeVisible();
  await expect(faq.getByRole('heading', { level: 3, name: '哪个套餐最适合大多数人？' })).toBeVisible();
  await expect(faq.getByText('默认推荐 Plus 月卡 ¥99，适合大多数长期使用场景。')).toBeVisible();

  await expect(footer.getByText('给官方客户端一个更划算的入口。')).toBeVisible();
  await expect(footer.getByRole('link', { name: '立即购买' })).toBeVisible();
});
```

- [ ] **Step 2: Run the new test to verify it fails**

Run:

```bash
npm test -- --grep "homepage lists supported software cards and updated client FAQ copy"
```

Expected: FAIL because the homepage still renders the retired three-card intro copy and the FAQ still says only GPT / Codex are supported.

- [ ] **Step 3: Replace the intro section markup and update the conflicting FAQ copy**

In `/Users/Shake/Documents/App/Brioi/index.html`, replace the current `editorial-blocks` section with:

```html
      <section class="editorial-blocks" aria-labelledby="software-title">
        <div class="section-heading">
          <p class="eyebrow">Supported Software</p>
          <h2 id="software-title">支持的软件。<span class="text-accent">直接开用。</span></h2>
        </div>

        <div class="software-grid" aria-label="支持的软件">
          <article class="software-card" data-software="codex">
            <div class="software-icon software-icon--codex" aria-hidden="true">CX</div>
            <h3>Codex</h3>
            <p class="software-card-meta">Agent Ready</p>
            <button class="button button--outline software-trigger" type="button" data-software="codex">使用方式</button>
          </article>

          <article class="software-card" data-software="claude-code">
            <div class="software-icon software-icon--claude-code" aria-hidden="true">CC</div>
            <h3>Claude Code</h3>
            <p class="software-card-meta">CLI Workflow</p>
            <button class="button button--outline software-trigger" type="button" data-software="claude-code">使用方式</button>
          </article>

          <article class="software-card" data-software="opencode">
            <div class="software-icon software-icon--opencode" aria-hidden="true">OC</div>
            <h3>OpenCode</h3>
            <p class="software-card-meta">Open Runtime</p>
            <button class="button button--outline software-trigger" type="button" data-software="opencode">使用方式</button>
          </article>

          <article class="software-card" data-software="openclaw">
            <div class="software-icon software-icon--openclaw" aria-hidden="true">OW</div>
            <h3>OpenClaw</h3>
            <p class="software-card-meta">Direct Access</p>
            <button class="button button--outline software-trigger" type="button" data-software="openclaw">使用方式</button>
          </article>
        </div>
      </section>
```

In the FAQ section of the same file, replace the first FAQ item with:

```html
          <article class="faq-item">
            <h3>支持哪些软件？</h3>
            <p>目前支持 Codex、Claude Code、OpenCode、OpenClaw。</p>
          </article>
```

- [ ] **Step 4: Run the new test to verify it passes**

Run:

```bash
npm test -- --grep "homepage lists supported software cards and updated client FAQ copy"
```

Expected: PASS

- [ ] **Step 5: Commit**

Run:

```bash
git add index.html tests/homepage.spec.js
git commit -m "替换首页旧的三张说明卡为支持软件展示区块，并同步修正 FAQ 中仍然只写 GPT 与 Codex 的冲突文案，确保首页静态内容先与本次专项设计稿保持一致"
```

## Task 2: Add The Strong Visual Card Styling And Responsive Grid Behavior

**Files:**
- Modify: `/Users/Shake/Documents/App/Brioi/tests/homepage.spec.js`
- Modify: `/Users/Shake/Documents/App/Brioi/styles.css`

- [ ] **Step 1: Add a failing layout test for the four-card desktop row**

Append this test to `/Users/Shake/Documents/App/Brioi/tests/homepage.spec.js`:

```js
test('supported software cards stay on one row on desktop', async ({ page }) => {
  await page.goto('/');

  const cards = page.locator('.software-card');

  await expect(cards).toHaveCount(4);

  const boxes = await Promise.all(
    [0, 1, 2, 3].map(async (index) => cards.nth(index).boundingBox())
  );

  boxes.forEach((box) => expect(box).not.toBeNull());

  const topOffsets = boxes.map((box) => Math.round(box.y));
  const leftOffsets = boxes.map((box) => Math.round(box.x));

  expect(new Set(topOffsets).size).toBe(1);
  expect(new Set(leftOffsets).size).toBe(4);
});
```

- [ ] **Step 2: Run the layout test to verify it fails**

Run:

```bash
npm test -- --grep "supported software cards stay on one row on desktop"
```

Expected: FAIL because the new section does not yet have a dedicated four-column layout or the card styling required for the strong visual presentation.

- [ ] **Step 3: Replace the old intro-card styling with the new software-card system**

In `/Users/Shake/Documents/App/Brioi/styles.css`, replace the `Editorial Blocks / Info Cards` section with:

```css
/* ============================================================
   Supported Software Section
   ============================================================ */
.editorial-blocks {
  padding: 80px 0 96px;
}

.software-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
  align-items: stretch;
}

.software-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 360px;
  padding: 32px 24px 24px;
  border-radius: var(--radius-xl);
  border: 1px solid var(--line);
  background:
    radial-gradient(circle at top, rgba(91, 225, 57, 0.14), transparent 42%),
    linear-gradient(180deg, #ffffff 0%, #f5f6f7 100%);
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.06);
  text-align: center;
  transition: transform var(--duration) var(--ease), box-shadow var(--duration) var(--ease), border-color var(--duration) var(--ease);
}

.software-card:hover {
  transform: translateY(-6px);
  border-color: #cfd6dd;
  box-shadow: 0 20px 52px rgba(0, 0, 0, 0.1);
}

.software-icon {
  width: 92px;
  height: 92px;
  display: grid;
  place-items: center;
  margin-bottom: 24px;
  border-radius: 26px;
  background: var(--bg-dark);
  color: var(--white);
  font-size: 1.35rem;
  font-weight: 900;
  letter-spacing: -0.06em;
  box-shadow: 0 20px 36px rgba(0, 0, 0, 0.16);
}

.software-icon--codex,
.software-icon--claude-code {
  background: var(--bg-dark);
}

.software-icon--opencode,
.software-icon--openclaw {
  background: linear-gradient(135deg, #111111 0%, #2c2c2c 100%);
}

.software-card h3 {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin-bottom: 10px;
}

.software-card-meta {
  margin-bottom: 24px;
  font-family: var(--font-mono);
  font-size: 0.76rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.software-trigger {
  width: 100%;
  margin-top: auto;
  justify-content: center;
  border-width: 1px;
  background: var(--white);
}

.software-trigger:hover {
  border-color: var(--bg-dark);
  background: var(--bg-dark);
  color: var(--white);
}
```

- [ ] **Step 4: Add responsive rules so the section collapses cleanly on narrower screens**

In the responsive area of `/Users/Shake/Documents/App/Brioi/styles.css`, add:

```css
@media (max-width: 1100px) {
  .software-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 680px) {
  .software-grid {
    grid-template-columns: 1fr;
  }

  .software-card {
    min-height: 320px;
  }
}
```

- [ ] **Step 5: Run the supported-software tests to verify the styling change works**

Run:

```bash
npm test -- --grep "homepage lists supported software cards and updated client FAQ copy|supported software cards stay on one row on desktop"
```

Expected: PASS

- [ ] **Step 6: Commit**

Run:

```bash
git add styles.css tests/homepage.spec.js
git commit -m "补齐支持软件展示区块的四列竖卡样式与桌面端同排布局，加入更强的卡片层次、图标展示区和响应式收拢规则，让新区块在视觉上真正替代原说明卡"
```

## Task 3: Add The Shared Usage Modal And Verify Open/Close Behavior

**Files:**
- Modify: `/Users/Shake/Documents/App/Brioi/tests/homepage.spec.js`
- Modify: `/Users/Shake/Documents/App/Brioi/index.html`
- Modify: `/Users/Shake/Documents/App/Brioi/main.js`
- Modify: `/Users/Shake/Documents/App/Brioi/styles.css`

- [ ] **Step 1: Add a failing modal interaction test**

Append this test to `/Users/Shake/Documents/App/Brioi/tests/homepage.spec.js`:

```js
test('software usage modal opens with the selected software details and closes again', async ({ page }) => {
  await page.goto('/');

  const claudeCard = page.locator('.software-card[data-software="claude-code"]');

  await claudeCard.getByRole('button', { name: '使用方式' }).click();

  const dialog = page.getByRole('dialog', { name: 'Claude Code 使用方式' });

  await expect(dialog).toBeVisible();
  await expect(dialog.getByText('适用方式')).toBeVisible();
  await expect(dialog.getByText('适合命令行驱动的代码工作流，登录后即可进入会话。')).toBeVisible();
  await expect(dialog.getByText('使用步骤')).toBeVisible();
  await expect(dialog.getByRole('listitem')).toHaveCount(3);
  await expect(dialog.getByText('补充说明')).toBeVisible();
  await expect(dialog.getByText('建议优先使用较新版本客户端，减少登录态兼容问题。')).toBeVisible();

  await dialog.getByRole('button', { name: '关闭' }).click();

  await expect(dialog).toBeHidden();
});
```

- [ ] **Step 2: Run the modal test to verify it fails**

Run:

```bash
npm test -- --grep "software usage modal opens with the selected software details and closes again"
```

Expected: FAIL because the `使用方式` buttons do not yet open any dialog and there is no modal content in the DOM.

- [ ] **Step 3: Add the shared modal shell to the homepage markup**

In `/Users/Shake/Documents/App/Brioi/index.html`, insert this block immediately after the supported software section:

```html
      <div class="software-modal-backdrop" data-software-modal hidden>
        <div class="software-modal" role="dialog" aria-modal="true" aria-labelledby="software-modal-title">
          <div class="software-modal-head">
            <div class="software-modal-icon" data-modal-icon aria-hidden="true"></div>
            <div class="software-modal-title-wrap">
              <p class="card-label">Usage Guide</p>
              <h3 id="software-modal-title">Codex 使用方式</h3>
            </div>
          </div>

          <div class="software-modal-body">
            <section class="software-modal-section">
              <p class="card-label">适用方式</p>
              <p data-modal-mode></p>
            </section>

            <section class="software-modal-section">
              <p class="card-label">使用步骤</p>
              <ol data-modal-steps></ol>
            </section>

            <section class="software-modal-section">
              <p class="card-label">补充说明</p>
              <p data-modal-note></p>
            </section>
          </div>

          <button class="button button--primary software-modal-close" type="button" data-close-software-modal>关闭</button>
        </div>
      </div>
```

- [ ] **Step 4: Add the software usage data map and modal controller**

In `/Users/Shake/Documents/App/Brioi/main.js`, add the following constants near `PLAN_LABELS` and then add the `initSoftwareModal()` function before the final init section:

```js
const SOFTWARE_DETAILS = {
  codex: {
    icon: 'CX',
    title: 'Codex 使用方式',
    mode: '适合直接在 Codex 工作流中登录后开始使用。',
    steps: [
      '打开 Codex 客户端。',
      '使用购买后的账号完成登录。',
      '进入项目后直接开始对话或编码。'
    ],
    note: '建议优先使用较新版本客户端，减少登录态兼容问题。'
  },
  'claude-code': {
    icon: 'CC',
    title: 'Claude Code 使用方式',
    mode: '适合命令行驱动的代码工作流，登录后即可进入会话。',
    steps: [
      '打开 Claude Code。',
      '使用购买后的账号完成登录。',
      '进入工作区后按默认命令流开始使用。'
    ],
    note: '建议优先使用较新版本客户端，减少登录态兼容问题。'
  },
  opencode: {
    icon: 'OC',
    title: 'OpenCode 使用方式',
    mode: '适合开放式代码工作流，登录后按默认入口直接使用。',
    steps: [
      '打开 OpenCode 客户端。',
      '使用购买后的账号完成登录。',
      '进入项目后按默认界面开始工作。'
    ],
    note: '首次使用时确认网络与账号状态正常，再进入长期会话。'
  },
  openclaw: {
    icon: 'OW',
    title: 'OpenClaw 使用方式',
    mode: '适合 Brioi 当前支持的 OpenClaw 客户端场景，登录后即可进入。',
    steps: [
      '打开 OpenClaw 客户端。',
      '使用购买后的账号完成登录。',
      '进入界面后直接按默认流程开始使用。'
    ],
    note: '如遇到登录态异常，先退出并重新进入客户端。'
  }
};

function initSoftwareModal() {
  const backdrop = document.querySelector('[data-software-modal]');
  const triggers = [...document.querySelectorAll('.software-trigger')];

  if (!backdrop || !triggers.length) {
    return;
  }

  const title = backdrop.querySelector('#software-modal-title');
  const icon = backdrop.querySelector('[data-modal-icon]');
  const mode = backdrop.querySelector('[data-modal-mode]');
  const steps = backdrop.querySelector('[data-modal-steps]');
  const note = backdrop.querySelector('[data-modal-note]');
  const closeButton = backdrop.querySelector('[data-close-software-modal]');

  function closeModal() {
    backdrop.hidden = true;
    document.body.classList.remove('modal-open');
  }

  function openModal(key) {
    const detail = SOFTWARE_DETAILS[key];

    if (!detail) {
      return;
    }

    title.textContent = detail.title;
    icon.textContent = detail.icon;
    mode.textContent = detail.mode;
    steps.innerHTML = detail.steps.map((step) => `<li>${step}</li>`).join('');
    note.textContent = detail.note;

    backdrop.hidden = false;
    document.body.classList.add('modal-open');
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => openModal(trigger.dataset.software));
  });

  closeButton.addEventListener('click', closeModal);

  backdrop.addEventListener('click', (event) => {
    if (event.target === backdrop) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !backdrop.hidden) {
      closeModal();
    }
  });
}
```

Then update the home-page init block at the bottom of the same file to:

```js
if (document.body.dataset.page === 'home') {
  initPricingTabs();
  initScrollReveal();
  initSoftwareModal();
}
```

- [ ] **Step 5: Add the modal overlay and dialog styles**

In `/Users/Shake/Documents/App/Brioi/styles.css`, add:

```css
body.modal-open {
  overflow: hidden;
}

.software-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.48);
}

.software-modal {
  width: min(680px, 100%);
  border-radius: var(--radius-xl);
  background: var(--white);
  color: var(--text);
  padding: 32px;
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.22);
}

.software-modal-head {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 28px;
}

.software-modal-icon {
  width: 72px;
  height: 72px;
  display: grid;
  place-items: center;
  border-radius: 22px;
  background: var(--bg-dark);
  color: var(--white);
  font-size: 1.1rem;
  font-weight: 900;
  letter-spacing: -0.05em;
}

.software-modal-title-wrap .card-label {
  margin-bottom: 8px;
}

.software-modal-title-wrap h3 {
  font-size: 2rem;
  line-height: 1;
  letter-spacing: -0.04em;
}

.software-modal-body {
  display: grid;
  gap: 20px;
  margin-bottom: 28px;
}

.software-modal-section {
  padding: 20px 22px;
  border-radius: var(--radius-md);
  background: var(--bg-subtle);
}

.software-modal-section ol {
  padding-left: 20px;
  color: var(--text-secondary);
}

.software-modal-section li + li {
  margin-top: 8px;
}

.software-modal-section p:last-child {
  color: var(--text-secondary);
}

.software-modal-close {
  width: 100%;
}

@media (max-width: 680px) {
  .software-modal {
    padding: 24px;
  }

  .software-modal-head {
    align-items: flex-start;
  }

  .software-modal-title-wrap h3 {
    font-size: 1.6rem;
  }
}
```

- [ ] **Step 6: Run the modal test and a homepage regression slice**

Run:

```bash
npm test -- --grep "software usage modal opens with the selected software details and closes again|homepage lists supported software cards and updated client FAQ copy|supported software cards stay on one row on desktop"
```

Expected: PASS

- [ ] **Step 7: Commit**

Run:

```bash
git add index.html main.js styles.css tests/homepage.spec.js
git commit -m "为首页支持软件展示区补齐统一弹窗交互与说明内容，接入四个软件的使用方式数据、遮罩弹窗样式以及打开关闭行为，并用浏览器测试覆盖新的核心路径"
```

## Self-Review

- **Spec coverage:** The plan covers the four-up vertical cards, icon-first hierarchy, `使用方式` buttons, modal-only interaction, modal content sections, close-only primary action, desktop single-row layout, and keeping the section visually aligned with the existing site.
- **Placeholder scan:** No `TODO` / `TBD` placeholders remain; all tests, commands, copy, and modal content are concretely specified.
- **Type consistency:** The same selectors and keys are used across files: `.software-card`, `.software-trigger`, `data-software`, `data-software-modal`, `data-modal-mode`, `data-modal-steps`, and `data-close-software-modal`.

Plan complete and saved to `/Users/Shake/Documents/App/Brioi/docs/superpowers/plans/2026-04-06-brioi-supported-software-section.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
