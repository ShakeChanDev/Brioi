import { test, expect } from '@playwright/test';

test('homepage shell loads with updated navigation and hero CTA', async ({ page }) => {
  await page.goto('/');

  const nav = page.locator('.site-nav');

  await expect(page).toHaveTitle(/Brioi API/);
  await expect(nav).toBeVisible();
  await expect(nav.locator('.brand')).toHaveAttribute('href', './index.html');
  await expect(nav.getByRole('link', { name: '定价' })).toHaveAttribute('href', '#pricing');
  await expect(nav.getByRole('link', { name: '登录' })).toHaveAttribute('href', '#');
  await expect(nav.getByRole('link', { name: '注册' })).toHaveAttribute('href', './buy.html?plan=plus-monthly');
  await expect(page.getByRole('main')).toBeVisible();
  await expect(page.locator('.section-hero').getByRole('link', { name: '开始使用' })).toHaveAttribute('href', '#pricing');
});

test('homepage hero exposes the current positioning, metadata, and supported client badges', async ({ page }) => {
  await page.goto('/');

  const hero = page.locator('.section-hero');
  const heroLines = hero.locator('.hero-line');
  const badgeLabels = hero.locator('.software-badge span');
  const badgeImages = hero.locator('.software-badge img');

  await expect(page.locator('head meta[name="description"]')).toHaveAttribute(
    'content',
    'Brioi API — 更强的 AI，不该只有少数人会用。支持最新 GPT-5.4 模型与原生体验。'
  );
  await expect(heroLines).toHaveText([
    '更强的 AI，',
    '不该只有少数人在用'
  ]);
  await expect(hero.locator('.hero-line--accent')).toHaveText('不该只有少数人在用');
  await expect(hero.locator('.hero-subtitle')).toHaveText('顶级 GPT-5.4 全系列 AI 模型直连，稳定、高速、安全');
  await expect(hero.getByText('Supported Client Extensions')).toBeVisible();
  await expect(hero.locator('.software-badge')).toHaveCount(7);
  await expect(badgeLabels).toHaveText([
    'Codex',
    'Claude Code',
    'OpenCode',
    'OpenClaw',
    'Copilot',
    'VS Code',
    '•••'
  ]);
  await expect(badgeImages).toHaveCount(6);
  const expectedBadgeSources = [
    './assets/software-icons/codex-color.svg',
    './assets/software-icons/claudecode-color.svg',
    './assets/software-icons/opencode.svg',
    './assets/software-icons/openclaw-color.svg',
    './assets/software-icons/githubcopilot.svg',
    './assets/software-icons/vscode.png'
  ];

  for (const [index, source] of expectedBadgeSources.entries()) {
    await expect(badgeImages.nth(index)).toHaveAttribute('src', source);
  }
});

test('supported client more badge reveals the compatibility tooltip on hover', async ({ page }) => {
  await page.goto('/');

  const moreBadge = page.locator('.software-badge--more');
  const tooltip = moreBadge.locator('.more-tooltip');

  await expect(tooltip).toBeHidden();

  await moreBadge.hover();

  await expect(tooltip).toBeVisible();
  await expect(tooltip).toHaveText('所有兼容标准 OpenAI 请求格式的环境均可无缝接入');
});

test('pricing defaults to periodic plans and switches to the more plans panel', async ({ page }) => {
  await page.goto('/');

  const periodicTab = page.getByRole('tab', { name: '周期套餐' });
  const moreTab = page.getByRole('tab', { name: '更多套餐' });
  const periodicPanel = page.locator('#pricing-periodic');
  const morePanel = page.locator('#pricing-more');

  await expect(periodicTab).toHaveAttribute('aria-selected', 'true');
  await expect(moreTab).toHaveAttribute('aria-selected', 'false');
  await expect(periodicPanel).toBeVisible();
  await expect(morePanel).toBeHidden();
  await expect(periodicPanel.getByText('周卡')).toBeVisible();
  await expect(periodicPanel.getByText('Plus 月卡')).toBeVisible();
  await expect(periodicPanel.getByText('Pro 月卡')).toBeVisible();
  await expect(periodicPanel.getByText('MAX 月卡')).toBeVisible();

  await moreTab.click();

  await expect(periodicTab).toHaveAttribute('aria-selected', 'false');
  await expect(moreTab).toHaveAttribute('aria-selected', 'true');
  await expect(periodicPanel).toBeHidden();
  await expect(morePanel).toBeVisible();
  await expect(morePanel.getByText('按量付费')).toBeVisible();
  await expect(morePanel.getByText('企业定制')).toBeVisible();
});

test('pricing contact modal opens from the CTA and closes from both close button and backdrop', async ({ page }) => {
  await page.goto('/');

  const trigger = page.locator('#pricing-periodic').getByRole('link', { name: '立即开通' }).first();
  const modal = page.locator('#contact-modal');

  await trigger.click();

  await expect(modal).toHaveAttribute('aria-hidden', 'false');
  await expect(modal).toHaveClass(/active/);
  await expect(page.locator('.modal-dialog')).toBeVisible();
  await expect(page.locator('.modal-title')).toHaveText('微信扫码添加');
  await expect(page.locator('.modal-qr')).toHaveAttribute('src', /Brioi_Contact/);
  await expect.poll(async () => page.evaluate(() => document.body.style.overflow)).toBe('hidden');

  await page.locator('.js-modal-close').click();

  await expect(modal).toHaveAttribute('aria-hidden', 'true');
  await expect(modal).not.toHaveClass(/active/);
  await expect.poll(async () => page.evaluate(() => document.body.style.overflow)).toBe('');

  await trigger.click();
  await expect(modal).toHaveAttribute('aria-hidden', 'false');

  await modal.click({ position: { x: 8, y: 8 } });

  await expect(modal).toHaveAttribute('aria-hidden', 'true');
  await expect.poll(async () => page.evaluate(() => document.body.style.overflow)).toBe('');
});

test('faq accordion keeps only the latest answer expanded', async ({ page }) => {
  await page.goto('/');

  const firstItem = page.locator('.faq-accordion').nth(0);
  const secondItem = page.locator('.faq-accordion').nth(1);

  await firstItem.locator('.faq-summary').click();
  await expect.poll(async () => firstItem.evaluate((element) => element.open)).toBe(true);
  await expect(firstItem.locator('.faq-answer')).toContainText('标准的加密传输协议');

  await secondItem.locator('.faq-summary').click();

  await expect.poll(async () => secondItem.evaluate((element) => element.open)).toBe(true);
  await expect.poll(async () => firstItem.evaluate((element) => element.open)).toBe(false);
  await expect(secondItem.locator('.faq-answer')).toContainText('优先消耗订阅提供的每日/每周额度');
});

test('buy page shows the selected plan from the query string', async ({ page }) => {
  await page.goto('/buy.html?plan=pro-monthly');

  await expect(page.getByRole('heading', { level: 1, name: '购买 Brioi API' })).toBeVisible();
  await expect(page.getByText('已选择：Pro 月卡')).toBeVisible();
});

test('mobile homepage stays within the viewport without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const brandBox = await page.locator('.site-header .brand').boundingBox();
  const navActionsBox = await page.locator('.nav-actions').boundingBox();

  expect(brandBox).not.toBeNull();
  expect(navActionsBox).not.toBeNull();
  expect(navActionsBox.y).toBeGreaterThan(brandBox.y);

  await expect
    .poll(async () => page.evaluate(() => ({
      innerWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth
    })))
    .toEqual({ innerWidth: 390, scrollWidth: 390 });
});

test.describe('homepage without javascript', () => {
  test.use({ javaScriptEnabled: false });

  test('shows the hero and the default periodic pricing panel', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('.section-hero')).toBeVisible();
    await expect(page.locator('#pricing-periodic')).toBeVisible();
    await expect(page.locator('#pricing-periodic').getByText('Plus 月卡')).toBeVisible();
    await expect(page.locator('#pricing-more')).toBeHidden();
  });
});
