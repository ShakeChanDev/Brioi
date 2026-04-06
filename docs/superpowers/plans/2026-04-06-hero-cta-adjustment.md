# Hero CTA Adjustment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the duplicate hero copy CTAs and move the hero's primary actions into the right-side Plus card as two buttons that both jump to the pricing section.

**Architecture:** Update the static homepage markup in `index.html`, keep the change localized to hero CTA structure, and extend `styles.css` with a focused card CTA layout that preserves the existing visual system and responsive behavior. Lock the behavior with Playwright assertions against the hero region.

**Tech Stack:** HTML5, CSS3, Playwright

---

## File Structure

- `/Users/Shake/Documents/App/Brioi/index.html`
- `/Users/Shake/Documents/App/Brioi/styles.css`
- `/Users/Shake/Documents/App/Brioi/tests/homepage.spec.js`

Responsibilities:

- `index.html`: hero CTA markup and link targets
- `styles.css`: hero card CTA layout and responsive rules
- `tests/homepage.spec.js`: regression coverage for the approved CTA behavior

## Task 1: Lock The Approved Hero CTA Behavior In Tests

**Files:**
- Modify: `/Users/Shake/Documents/App/Brioi/tests/homepage.spec.js`

- [ ] **Step 1: Write the failing regression assertions**

Add assertions to the hero test that require:

```js
await expect(hero.getByRole('link', { name: '购买 Plus 月卡' })).toHaveCount(0);
await expect(hero.getByRole('link', { name: '查看套餐' })).toHaveCount(0);
await expect(hero.getByRole('link', { name: '去购买' })).toHaveAttribute('href', '#pricing');
await expect(hero.getByRole('link', { name: '查看更多套餐' })).toHaveAttribute('href', '#pricing');
```

- [ ] **Step 2: Run the focused test and verify it fails for the expected reason**

Run:

```bash
npm test -- --grep "hero shows the approved price-first message and a single plus card"
```

Expected: FAIL because the homepage still renders the old left-side CTA pair and the right-side card still contains only the old single button.

## Task 2: Implement The Approved Hero CTA Layout

**Files:**
- Modify: `/Users/Shake/Documents/App/Brioi/index.html`
- Modify: `/Users/Shake/Documents/App/Brioi/styles.css`

- [ ] **Step 1: Remove the left-side CTA group and replace the side-card single CTA with two links**

Update the hero markup so that:

```html
<div class="hero-side-card__actions">
  <a class="button button--dark" href="#pricing">去购买</a>
  <a class="button button--outline" href="#pricing">查看更多套餐</a>
</div>
```

and remove the old left-side hero CTA block entirely.

- [ ] **Step 2: Add minimal styling for the card action group**

Extend `styles.css` so the new action group:

```css
.hero-side-card__actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
```

and make sure the outline button remains readable inside the dark card while preserving the current accent treatment for the dark primary button.

## Task 3: Verify The Change

**Files:**
- Modify: `/Users/Shake/Documents/App/Brioi/tests/homepage.spec.js`
- Modify: `/Users/Shake/Documents/App/Brioi/index.html`
- Modify: `/Users/Shake/Documents/App/Brioi/styles.css`

- [ ] **Step 1: Re-run the focused hero regression**

Run:

```bash
npm test -- --grep "hero shows the approved price-first message and a single plus card"
```

Expected: PASS

- [ ] **Step 2: Run the broader homepage suite**

Run:

```bash
npm test -- tests/homepage.spec.js
```

Expected: PASS with the updated hero CTA behavior and no regressions in pricing or layout tests.
