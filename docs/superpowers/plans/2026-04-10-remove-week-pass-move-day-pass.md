# Remove Week Pass And Move Day Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove week-pass offerings from all branded pricing surfaces and move Drigeo's day-pass card from common plans into the more-plans panel.

**Architecture:** Keep the pricing tabs and shared runtime intact, but update the single source of truth in site pricing config, the static shell markup for the root and branded pages, and the Playwright assertions that define where each card should appear. Avoid new logic or layout variants.

**Tech Stack:** Static HTML, shared runtime config, Playwright

---

### Task 1: Update the regression expectations first

**Files:**
- Modify: `tests/homepage.spec.js`
- Test: `tests/homepage.spec.js`

- [ ] **Step 1: Change static and interaction expectations**

```js
    plans: [
      ['plus-monthly', 'Plus 月卡', '¥199/月'],
      ['pro-monthly', 'Pro 月卡', '¥299/月'],
      ['max-monthly', 'Max 月卡', '¥699/月'],
    ],
    hiddenPlans: ['week-pass', 'day-pass'],
```

```js
  await expect(morePanel.getByText('周卡')).toHaveCount(0);
  await expect(morePanel.getByText('日卡')).toBeVisible();
  await expect(morePanel.locator('[data-plan-id="day-pass"] .price-amount')).toHaveText('9');
```

- [ ] **Step 2: Run the focused pricing tests to verify they fail**

Run: `npx playwright test tests/homepage.spec.js --grep "migrated support and pricing copy|pricing defaults to common plans|site home shells expose approved static branding and pricing without javascript"`
Expected: FAIL because Brioi still exposes a week-pass card and Drigeo still renders day-pass in common plans.

### Task 2: Remove week-pass and move day-pass in config and markup

**Files:**
- Modify: `scripts/site-config.js`
- Modify: `main.js`
- Modify: `index.html`
- Modify: `sites/brioi/index.html`
- Modify: `sites/drigeo/index.html`

- [ ] **Step 1: Remove week-pass from base pricing config**

```js
  pricing: {
    buyOrder: ['plus-monthly', 'pro-monthly', 'max-monthly'],
    plans: {
      'plus-monthly': { label: 'Plus 月卡', priceText: '¥199/月' },
      'pro-monthly': { label: 'Pro 月卡', priceText: '¥299/月' },
      'max-monthly': { label: 'Max 月卡', priceText: '¥699/月' },
    },
  },
```

- [ ] **Step 2: Remove the obsolete label mapping**

```js
const PLAN_LABELS = {
  'day-pass': '日卡',
  'plus-monthly': 'Plus 月卡',
  'pro-monthly': 'Pro 月卡',
  'max-monthly': 'Max 月卡'
};
```

- [ ] **Step 3: Delete the week-pass cards and move the Drigeo day-pass card**

```html
        <div class="pricing-content" id="pricing-more" role="tabpanel">
          <div class="pricing-bento-layout pricing-bento-layout--compact">

            <div class="price-bento-card" data-plan-id="day-pass">
              <p class="price-label">STARTER</p>
              <h3 class="price-name" data-plan-label>日卡</h3>
              <div class="price-amount-wrap" data-plan-price>
                <span class="price-currency">¥</span><span class="price-amount">9</span>
              </div>
              <p class="price-desc">适合首次体验、短期需求与临时项目。</p>
              <ul class="price-features">
                <li>日限额 $20</li>
                <li>1 天有效</li>
                <li>适合轻量体验与临时任务</li>
              </ul>
              <a class="button button--secondary button--block" href="#" data-modal="contact">立即开通</a>
            </div>
```

- [ ] **Step 4: Run the focused pricing tests to verify they pass**

Run: `npx playwright test tests/homepage.spec.js --grep "migrated support and pricing copy|pricing defaults to common plans|site home shells expose approved static branding and pricing without javascript"`
Expected: PASS with no week-pass cards left and Drigeo day-pass visible only in more plans.

### Task 3: Run the full suite

**Files:**
- Test: `tests/homepage.spec.js`

- [ ] **Step 1: Run the complete regression suite**

Run: `npm test`
Expected: PASS with all 21 tests green.
