# Contact Modal Scale Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Increase the contact modal and QR image size so the support QR is easier to scan without breaking mobile layout.

**Architecture:** Keep the existing modal markup and interaction unchanged. Update the shared modal CSS in both stylesheet entrypoints, then prove the new desktop size and responsive bounds with Playwright assertions against the existing contact-modal flow.

**Tech Stack:** Static HTML, shared CSS, Playwright

---

### Task 1: Add a failing regression test for the larger contact modal

**Files:**
- Modify: `tests/homepage.spec.js`
- Test: `tests/homepage.spec.js`

- [ ] **Step 1: Add size assertions to the contact modal test**

```js
  const modalDialog = page.locator('.modal-dialog');
  const qrImage = page.locator('.modal-qr');

  const { modalWidth, qrWidth } = await page.evaluate(() => {
    const modal = document.querySelector('.modal-dialog');
    const qr = document.querySelector('.modal-qr');
    return {
      modalWidth: modal?.getBoundingClientRect().width ?? 0,
      qrWidth: qr?.getBoundingClientRect().width ?? 0,
    };
  });

  expect(modalWidth).toBeGreaterThanOrEqual(520);
  expect(qrWidth).toBeGreaterThanOrEqual(300);
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npx playwright test tests/homepage.spec.js --grep "pricing contact modal opens"`
Expected: FAIL because the current modal width is around 400px and the QR image width is around 220px.

### Task 2: Increase the shared modal size and QR display area

**Files:**
- Modify: `styles/styles.css`
- Modify: `styles.css`
- Test: `tests/homepage.spec.js`

- [ ] **Step 1: Update the shared modal sizing rules**

```css
.modal-dialog {
  padding: 48px;
  max-width: 580px;
  width: min(92vw, 580px);
}

.modal-title {
  font-size: 1.75rem;
}

.modal-desc {
  font-size: 1.05rem;
  margin-bottom: 28px;
}

.modal-qr-wrap {
  padding: 28px;
}

.modal-qr {
  width: min(320px, 100%);
  height: auto;
}
```

- [ ] **Step 2: Add a mobile guardrail**

```css
@media (max-width: 640px) {
  .modal-dialog {
    padding: 24px;
    width: min(92vw, 420px);
  }

  .modal-qr-wrap {
    padding: 16px;
  }

  .modal-qr {
    width: min(100%, 280px);
  }
}
```

- [ ] **Step 3: Run the focused test to verify it passes**

Run: `npx playwright test tests/homepage.spec.js --grep "pricing contact modal opens"`
Expected: PASS with the larger modal and QR still opening/closing correctly.

### Task 3: Run the full regression suite

**Files:**
- Test: `tests/homepage.spec.js`

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: PASS with all homepage and docs regressions still green.
