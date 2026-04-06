import { test, expect } from '@playwright/test';

test('homepage shell loads with title and navigation', async ({ page }) => {
  await page.goto('/');

  const nav = page.getByRole('navigation', { name: '主导航' });

  await expect(page).toHaveTitle(/Brioi API/);
  await expect(nav).toBeVisible();
  await expect(nav.getByRole('link', { name: '立即购买' })).toHaveAttribute('href', './buy.html?plan=plus-monthly');
  await expect(page.getByRole('main')).toBeVisible();
});

test('homepage hero uses the final editorial two-line headline and GPT-5.4 subtitle', async ({ page }) => {
  await page.goto('/');

  const hero = page.locator('#hero');

  await expect(page.locator('head meta[name="description"]')).toHaveAttribute(
    'content',
    'Brioi API — 让每个人都能轻松用上更强的 AI 大模型。支持最新 GPT-5.4 模型。'
  );
  await expect(hero.locator('[data-hero-title-line]')).toHaveText([
    '让每个人都能轻松用上',
    '更强的 AI 大模型'
  ]);
  await expect(hero.locator('[data-hero-title-line]')).toHaveCount(2);
  await expect(hero.locator('[data-hero-title-line]').first()).toHaveCSS('font-weight', '800');
  await expect(hero.locator('[data-hero-subtitle]')).toHaveText('支持最新 GPT-5.4 模型');
  await expect(hero.locator('[data-hero-subtitle]')).toHaveCSS('font-weight', '700');
  await expect(hero.locator('.chat-stack')).toHaveCount(0);
  await expect(page.locator('.hero-summary')).toHaveCount(0);
  await expect(hero).not.toContainText('不想再为');
  await expect(hero.getByRole('heading', { name: 'Plus 月卡' })).toBeVisible();
  await expect(hero.getByText('¥99')).toBeVisible();
  await expect(hero.locator('.hero-side-card')).toHaveCount(1);
  await expect(hero.getByRole('link', { name: '购买 Plus 月卡' })).toHaveCount(0);
  await expect(hero.getByRole('link', { name: '查看套餐' })).toHaveCount(0);
  await expect(hero.getByRole('link', { name: '去购买' })).toHaveAttribute('href', '#pricing');
  await expect(hero.getByRole('link', { name: '查看更多套餐' })).toHaveAttribute('href', '#pricing');
});

test('homepage lists supported software cards and updated client FAQ copy', async ({ page }) => {
  await page.goto('/');

  const intro = page.locator('.editorial-blocks');
  const faq = page.locator('.faq');
  const footer = page.locator('.site-footer');

  await expect(intro.getByRole('heading', { level: 2, name: '支持的软件。直接开用。' })).toBeVisible();
  await expect(intro.locator('.software-card')).toHaveCount(4);
  for (const [softwareSlug, softwareName, iconPath] of [
    ['codex', 'Codex', './assets/software-icons/codex-mac-app.png'],
    ['claude-code', 'Claude Code', './assets/software-icons/claude-code.png'],
    ['opencode', 'OpenCode', './assets/software-icons/opencode.png'],
    ['openclaw', 'OpenClaw', './assets/software-icons/openclaw.svg'],
  ]) {
    const softwareCard = intro.locator(`.software-card[data-software="${softwareSlug}"]`);
    const iconImage = softwareCard.locator('.software-icon-image');

    await expect(softwareCard).toHaveAttribute('data-software-icon-src', iconPath);
    await expect(iconImage).toHaveAttribute('src', iconPath);
    await expect(iconImage).toHaveAttribute('alt', '');
    await expect(softwareCard.locator('.software-icon')).not.toContainText(/CX|CC|OC|OW/);
    await expect(softwareCard.getByRole('heading', { level: 3, name: softwareName })).toBeVisible();
    await expect(softwareCard.getByRole('button', { name: '使用方式' })).toHaveAttribute('data-software', softwareSlug);
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
  await expect(footer.getByRole('link', { name: '立即购买' })).toHaveAttribute('href', './buy.html?plan=plus-monthly');
});

test('supported software cards stay on one row on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');

  const cards = page.locator('.editorial-blocks .software-card');

  await expect(cards).toHaveCount(4);

  const boxes = [];

  for (let index = 0; index < 4; index += 1) {
    const box = await cards.nth(index).boundingBox();

    expect(box).not.toBeNull();
    boxes.push(box);
  }

  const roundedTopOffsets = new Set(boxes.map((box) => Math.round(box.y)));
  const roundedLeftOffsets = new Set(boxes.map((box) => Math.round(box.x)));

  expect(roundedTopOffsets.size).toBe(1);
  expect(roundedLeftOffsets.size).toBe(4);
});

test('supported software cards use two columns on tablet', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.goto('/');

  const cards = page.locator('.editorial-blocks .software-card');

  await expect(cards).toHaveCount(4);

  const boxes = [];

  for (let index = 0; index < 4; index += 1) {
    const box = await cards.nth(index).boundingBox();

    expect(box).not.toBeNull();
    boxes.push(box);
  }

  const roundedTopOffsets = new Set(boxes.map((box) => Math.round(box.y)));
  const roundedLeftOffsets = new Set(boxes.map((box) => Math.round(box.x)));

  expect(roundedTopOffsets.size).toBe(2);
  expect(roundedLeftOffsets.size).toBe(2);
});

test('supported software cards stack into one column on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 680, height: 900 });
  await page.goto('/');

  const cards = page.locator('.editorial-blocks .software-card');

  await expect(cards).toHaveCount(4);

  const boxes = [];

  for (let index = 0; index < 4; index += 1) {
    const box = await cards.nth(index).boundingBox();

    expect(box).not.toBeNull();
    boxes.push(box);
  }

  const roundedTopOffsets = new Set(boxes.map((box) => Math.round(box.y)));
  const roundedLeftOffsets = new Set(boxes.map((box) => Math.round(box.x)));

  expect(roundedTopOffsets.size).toBe(4);
  expect(roundedLeftOffsets.size).toBe(1);
});

test('software usage modal renders the selected local icon asset and never falls back to the Codex repo splash', async ({ page }) => {
  await page.goto('/');

  const card = page.locator('.software-card[data-software="codex"]');
  const trigger = card.getByRole('button', { name: '使用方式' });
  const expectedSrc = await card.getAttribute('data-software-icon-src');

  await trigger.click();

  const dialog = page.getByRole('dialog', { name: 'Codex 使用方式' });
  const modalImage = dialog.locator('.software-modal-icon-image');

  await expect(dialog).toBeVisible();
  await expect(modalImage).toHaveAttribute('src', expectedSrc);
  await expect(modalImage).not.toHaveAttribute('src', /codex-cli-splash/);
  await expect(dialog.locator('.software-modal-icon')).not.toContainText('CX');
});

test('supported software icon images stay contained inside shared neutral wrappers', async ({ page }) => {
  await page.goto('/');

  const cardImage = page.locator('.software-card[data-software="openclaw"] .software-icon-image');
  const cardWrapper = page.locator('.software-card[data-software="openclaw"] .software-icon');

  await expect(cardImage).toHaveCSS('object-fit', 'contain');
  await expect(cardWrapper).toHaveCSS('border-radius', '26px');

  await page.locator('.software-card[data-software="openclaw"]').getByRole('button', { name: '使用方式' }).click();

  const modalImage = page.getByRole('dialog', { name: 'OpenClaw 使用方式' }).locator('.software-modal-icon-image');

  await expect(modalImage).toHaveCSS('object-fit', 'contain');
});

test('software usage modal opens with the selected software details and closes again', async ({ page }) => {
  await page.goto('/');

  const card = page.locator('.software-card[data-software="claude-code"]');
  const trigger = card.getByRole('button', { name: '使用方式' });
  const expectedSrc = await card.getAttribute('data-software-icon-src');

  await trigger.click();

  const dialog = page.getByRole('dialog', { name: 'Claude Code 使用方式' });
  const modalImage = dialog.locator('.software-modal-icon-image');

  await expect(dialog).toBeVisible();
  await expect(modalImage).toHaveAttribute('src', expectedSrc);
  await expect(dialog.getByText('适用方式')).toBeVisible();
  await expect(dialog.getByText('适合命令行驱动的代码工作流，登录后即可进入会话。')).toBeVisible();
  await expect(dialog.getByText('使用步骤')).toBeVisible();
  await expect(dialog.getByText('补充说明')).toBeVisible();
  await expect(dialog.getByText('建议优先使用较新版本客户端，减少登录态兼容问题。')).toBeVisible();
  await expect(dialog.locator('ol li')).toHaveCount(3);

  await dialog.getByRole('button', { name: '关闭' }).click();

  await expect(dialog).toBeHidden();
});

test('software usage modal moves focus into the modal and makes background sections inert while open', async ({ page }) => {
  await page.goto('/');

  const trigger = page.locator('.software-card[data-software="claude-code"]').getByRole('button', { name: '使用方式' });
  const pricingSection = page.locator('#pricing');
  const header = page.locator('.site-header');
  const footer = page.locator('.site-footer');

  await trigger.focus();
  await expect(trigger).toBeFocused();

  await trigger.click();

  const dialog = page.getByRole('dialog', { name: 'Claude Code 使用方式' });

  await expect(dialog).toBeVisible();
  await expect(dialog).toBeFocused();
  await expect(trigger).not.toBeFocused();
  await expect(pricingSection).toHaveJSProperty('inert', true);
  await expect(header).toHaveJSProperty('inert', true);
  await expect(footer).toHaveJSProperty('inert', true);
});

test('software usage modal keeps focus inside when Shift+Tab is pressed from the dialog container', async ({ page }) => {
  await page.goto('/');

  const trigger = page.locator('.software-card[data-software="claude-code"]').getByRole('button', { name: '使用方式' });

  await trigger.click();

  const dialog = page.getByRole('dialog', { name: 'Claude Code 使用方式' });
  const closeButton = dialog.getByRole('button', { name: '关闭' });

  await expect(dialog).toBeVisible();
  await expect(dialog).toBeFocused();

  await page.keyboard.press('Shift+Tab');

  await expect(closeButton).toBeFocused();
});

test('software usage modal closes with Escape and restores focus to its trigger', async ({ page }) => {
  await page.goto('/');

  const trigger = page.locator('.software-card[data-software="opencode"]').getByRole('button', { name: '使用方式' });

  await trigger.focus();
  await trigger.click();

  const dialog = page.getByRole('dialog', { name: 'OpenCode 使用方式' });

  await expect(dialog).toBeVisible();

  await page.keyboard.press('Escape');

  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('software usage modal closes when the backdrop is clicked and restores focus to its trigger', async ({ page }) => {
  await page.goto('/');

  const trigger = page.locator('.software-card[data-software="codex"]').getByRole('button', { name: '使用方式' });

  await trigger.focus();
  await trigger.click();

  const dialog = page.getByRole('dialog', { name: 'Codex 使用方式' });
  const backdrop = page.locator('[data-software-modal]');

  await expect(dialog).toBeVisible();

  await backdrop.click({ position: { x: 8, y: 8 } });

  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('software usage modal resets its scroll position when reopened', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 420 });
  await page.goto('/');

  const trigger = page.locator('.software-card[data-software="claude-code"]').getByRole('button', { name: '使用方式' });

  await trigger.click();

  const dialog = page.getByRole('dialog', { name: 'Claude Code 使用方式' });

  await expect(dialog).toBeVisible();

  const firstScrollTop = await dialog.evaluate((element) => {
    element.scrollTop = 160;
    return element.scrollTop;
  });

  expect(firstScrollTop).toBeGreaterThan(0);

  await dialog.getByRole('button', { name: '关闭' }).click();
  await expect(dialog).toBeHidden();

  await trigger.click();
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveJSProperty('scrollTop', 0);
});

test('pricing defaults to monthly plans and switches to experience plans', async ({ page }) => {
  await page.goto('/');

  const monthlyTab = page.getByRole('tab', { name: '月卡套餐' });
  const experienceTab = page.getByRole('tab', { name: '体验套餐' });
  const monthlyPanel = page.locator('#panel-monthly');
  const experiencePanel = page.locator('#panel-experience');

  await expect(monthlyTab).toHaveAttribute('aria-selected', 'true');
  await expect(monthlyPanel).toBeVisible();
  await expect(monthlyPanel.getByText('Plus 月卡')).toBeVisible();
  await expect(monthlyPanel.getByText('¥99')).toBeVisible();
  await expect(monthlyPanel.getByText('Pro 月卡')).toBeVisible();
  await expect(monthlyPanel.getByText('¥199')).toBeVisible();
  await expect(monthlyPanel.getByText('Max 月卡')).toBeVisible();
  await expect(monthlyPanel.getByText('¥499')).toBeVisible();
  await expect(monthlyPanel.getByRole('link', { name: '立即购买' })).toHaveCount(3);
  await expect(monthlyPanel.getByRole('link', { name: '立即购买' }).nth(0)).toHaveAttribute('href', './buy.html?plan=plus-monthly');
  await expect(monthlyPanel.getByRole('link', { name: '立即购买' }).nth(1)).toHaveAttribute('href', './buy.html?plan=pro-monthly');
  await expect(monthlyPanel.getByRole('link', { name: '立即购买' }).nth(2)).toHaveAttribute('href', './buy.html?plan=max-monthly');

  await experienceTab.click();

  await expect(experienceTab).toHaveAttribute('aria-selected', 'true');
  await expect(monthlyPanel).toBeHidden();
  await expect(experiencePanel).toBeVisible();
  await expect(experiencePanel.getByText('免费', { exact: true })).toBeVisible();
  await expect(experiencePanel.getByText('¥29.9')).toBeVisible();
  await expect(experiencePanel.getByText('日卡').first()).toBeVisible();
  await expect(experiencePanel.getByText('周卡').first()).toBeVisible();
  await expect(experiencePanel.getByRole('link', { name: '立即购买' })).toHaveCount(2);
  await expect(experiencePanel.getByRole('link', { name: '立即购买' }).nth(0)).toHaveAttribute('href', './buy.html?plan=day-pass');
  await expect(experiencePanel.getByRole('link', { name: '立即购买' }).nth(1)).toHaveAttribute('href', './buy.html?plan=week-pass');
});

test('buy page shows the selected plan from the query string', async ({ page }) => {
  await page.goto('/buy.html?plan=plus-monthly');

  await expect(page.getByRole('heading', { level: 1, name: '购买 Brioi API' })).toBeVisible();
  await expect(page.getByText('已选择：Plus 月卡')).toBeVisible();
});

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

    const monthlyPanel = page.locator('#panel-monthly');
    const plusPlan = monthlyPanel.locator('article').filter({ hasText: 'Plus 月卡' });
    const plusBuyLink = plusPlan.getByRole('link', { name: '立即购买' });

    await expect(monthlyPanel).toBeVisible();
    await expect(plusPlan.getByText('Plus 月卡')).toBeVisible();
    await expect(plusBuyLink).toHaveAttribute('href', './buy.html?plan=plus-monthly');
  });

  test('shows the fallback usage guide with local official icon images and hides dead software triggers', async ({ page }) => {
    await page.goto('/');

    const fallbackGuide = page.locator('.software-noscript-guide');
    const softwareTrigger = page.locator('.software-trigger').first();

    await expect(fallbackGuide).toBeVisible();
    await expect(softwareTrigger).toBeHidden();

    for (const [softwareSlug, iconPath] of [
      ['codex', './assets/software-icons/codex-mac-app.png'],
      ['claude-code', './assets/software-icons/claude-code.png'],
      ['opencode', './assets/software-icons/opencode.png'],
      ['openclaw', './assets/software-icons/openclaw.svg'],
    ]) {
      const softwareCard = fallbackGuide.locator(`.software-noscript-card[data-software="${softwareSlug}"]`);
      const iconImage = softwareCard.locator('.software-icon-image');

      await expect(iconImage).toHaveAttribute('src', iconPath);
      await expect(iconImage).toHaveAttribute('alt', '');
      await expect(softwareCard.locator('.software-icon')).not.toContainText(/CX|CC|OC|OW/);
    }

    await expect(fallbackGuide.getByText('适合直接在 Codex 工作流中登录后开始使用。')).toBeVisible();
  });
});
