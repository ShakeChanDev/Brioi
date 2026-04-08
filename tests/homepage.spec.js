import { test, expect } from '@playwright/test';

const STATIC_SITE_CASES = [
  {
    site: 'brioi',
    homePath: '/sites/brioi/index.html',
    buyPath: '/sites/brioi/buy.html?plan=pro-monthly',
    title: /Brioi API \| 官方客户端订阅接入/,
    buyTitle: /购买 Brioi API/,
    ogImage: '/sites/brioi/og-home.jpg',
    brand: 'Brioi',
    heroLines: ['更强的 AI，', '不该只有少数人在用'],
    subtitle: '顶级 GPT-5.4 全系列 AI 模型直连，稳定、高速、安全',
    plans: [
      ['week-pass', '周卡', '¥29'],
      ['plus-monthly', 'Plus 月卡', '¥99/月'],
      ['pro-monthly', 'Pro 月卡', '¥199/月'],
      ['max-monthly', 'MAX 月卡', '¥499/月'],
    ],
    hiddenPlans: [],
    buyHeading: '购买 Brioi API',
  },
  {
    site: 'cradeo',
    homePath: '/sites/cradeo/index.html',
    buyPath: '/sites/cradeo/buy.html?plan=plus-monthly',
    title: /CradEO API \| 官方客户端订阅接入/,
    buyTitle: /购买 CradEO API/,
    ogImage: '/sites/cradeo/og-home.jpg',
    brand: 'CradEO',
    heroLines: ['更强的 AI，', '不该只有少数人在用'],
    subtitle: '顶级 GPT-5.4 全系列 AI 模型直连，稳定、高速、安全',
    plans: [
      ['plus-monthly', 'Plus 月卡', '¥199/月'],
      ['pro-monthly', 'Pro 月卡', '¥299/月'],
      ['max-monthly', 'MAX 月卡', '¥699/月'],
    ],
    hiddenPlans: ['week-pass'],
    buyHeading: '购买 CradEO API',
  },
  {
    site: 'drigeo',
    homePath: '/sites/drigeo/index.html',
    buyPath: '/sites/drigeo/buy.html?plan=max-monthly',
    title: /Drigeo API \| 官方客户端订阅接入/,
    buyTitle: /购买 Drigeo API/,
    ogImage: '/sites/drigeo/og-home.jpg',
    brand: 'Drigeo',
    heroLines: ['让每个人，都能接入更强的 AI'],
    subtitle: '顶级 GPT-5.4 全系列 AI 模型直连，稳定、高速、安全',
    plans: [
      ['plus-monthly', 'Plus 月卡', '¥299/月'],
      ['pro-monthly', 'Pro 月卡', '¥399/月'],
      ['max-monthly', 'MAX 月卡', '¥799/月'],
    ],
    hiddenPlans: ['week-pass'],
    buyHeading: '购买 Drigeo API',
  },
];

async function expectStaticPlan(page, planId, label, priceText) {
  const plan = page.locator(`[data-plan-id="${planId}"]`);
  await expect(plan).toHaveCount(1);
  await expect(plan.locator('[data-plan-label]')).toHaveText(label);
  await expect(plan.locator('[data-plan-price]')).toHaveText(priceText);
}

test('site home shells expose approved static branding and pricing without javascript', async ({ browser }) => {
  for (const siteCase of STATIC_SITE_CASES) {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();

    await page.goto(siteCase.homePath);

    await expect(page).toHaveTitle(siteCase.title);
    await expect(page.locator('head meta[property="og:image"]')).toHaveAttribute('content', siteCase.ogImage);
    await expect(page.locator('[data-brand-name]').first()).toHaveText(siteCase.brand);
    await expect(page.locator('[data-hero-title] .hero-line')).toHaveText(siteCase.heroLines);
    await expect(page.locator('[data-copy="hero.subtitle"]').first()).toHaveText(siteCase.subtitle);

    for (const [planId, label, priceText] of siteCase.plans) {
      await expectStaticPlan(page, planId, label, priceText);
    }

    for (const hiddenPlan of siteCase.hiddenPlans) {
      await expect(page.locator(`[data-plan-id="${hiddenPlan}"]`)).toHaveCount(0);
    }

    await context.close();
  }
});

test('site buy shells expose approved static branding without javascript', async ({ browser }) => {
  for (const siteCase of STATIC_SITE_CASES) {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();

    await page.goto(siteCase.buyPath);

    await expect(page).toHaveTitle(siteCase.buyTitle);
    await expect(page.locator('[data-buy-heading]')).toHaveText(siteCase.buyHeading);
    await expect(page.locator('[data-selected-plan]')).toHaveText(/^已选择：.+/);

    await context.close();
  }
});

test('site runtime applies the configured accent token to each branded homepage', async ({ page }) => {
  for (const [path, accent] of [
    ['/sites/brioi/index.html', '#00E676'],
    ['/sites/cradeo/index.html', '#22C55E'],
    ['/sites/drigeo/index.html', '#10B981'],
  ]) {
    await page.goto(path);

    const runtimeAccent = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
    });

    expect(runtimeAccent).toBe(accent);
  }
});

test('buy page falls back to the first enabled plan when the requested plan is disabled', async ({ page }) => {
  await page.goto('/sites/cradeo/buy.html?plan=week-pass');
  await expect(page.locator('[data-selected-plan]')).toHaveText('已选择：Plus 月卡');

  await page.goto('/sites/drigeo/buy.html?plan=week-pass');
  await expect(page.locator('[data-selected-plan]')).toHaveText('已选择：Plus 月卡');
});

test('homepage shell loads with updated navigation and hero CTA', async ({ page }) => {
  await page.goto('/');

  const nav = page.locator('.site-nav');
  const navItems = nav.locator('.nav-actions > a');

  await expect(page).toHaveTitle(/Brioi API/);
  await expect(nav).toBeVisible();
  await expect(nav.locator('.brand')).toHaveAttribute('href', './index.html');
  await expect(navItems).toHaveCount(4);
  await expect(navItems.nth(0)).toHaveText('文档');
  await expect(navItems.nth(1)).toHaveText('定价');
  await expect(nav.getByRole('link', { name: '文档' })).toHaveAttribute('href', './docs.html');
  await expect(nav.getByRole('link', { name: '定价' })).toHaveAttribute('href', '#pricing');
  await expect(nav.getByRole('link', { name: '登录' })).toHaveAttribute('href', '#');
  await expect(nav.getByRole('link', { name: '注册' })).toHaveAttribute('href', './buy.html?plan=plus-monthly');
  await expect(page.getByRole('main')).toBeVisible();
  await expect(page.locator('.section-hero').getByRole('link', { name: '开始使用' })).toHaveAttribute('href', '#pricing');
});

test('homepage brand text is configured to use the Bungee font family', async ({ page }) => {
  await page.goto('/');

  const brandFontFamily = await page.locator('.site-header .brand-text').evaluate((element) => {
    return window.getComputedStyle(element).fontFamily;
  });
  const isBungeeLoaded = await page.evaluate(async () => {
    await document.fonts.ready;
    return document.fonts.check('48px "Bungee"');
  });

  expect(brandFontFamily).toContain('Bungee');
  expect(isBungeeLoaded).toBe(true);
});

test('docs page matches the real sub2api api-key modal structure', async ({ page }) => {
  await page.goto('/docs.html');

  await expect(page).toHaveTitle(/Brioi 文档/);
  await expect(page.getByRole('navigation', { name: '主导航' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 1, name: 'Brioi API 密钥使用说明' })).toBeVisible();
  await expect(page.getByText('文档内容按 sub2api 前端的“使用 API 密钥”弹窗真实模板整理。')).toBeVisible();
  await expect(page.getByRole('heading', { level: 2, name: '快速开始' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 2, name: 'Codex CLI 配置说明' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 2, name: 'Codex CLI（WebSocket）配置说明' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 2, name: 'OpenClaw 配置说明' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 2, name: 'Claude Code 配置说明' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 2, name: 'OpenCode 配置说明' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 2, name: '常见问题' })).toBeVisible();
  await expect(page.getByRole('link', { name: '创建密钥' })).toHaveAttribute('href', '#key-setup');
  await expect(page.getByRole('link', { name: 'Codex CLI 配置说明' })).toHaveAttribute('href', '#codex-setup');
  await expect(page.getByRole('link', { name: 'Codex CLI（WebSocket）配置说明' })).toHaveAttribute('href', '#codex-ws-setup');
  await expect(page.getByRole('link', { name: 'OpenClaw 配置说明' })).toHaveAttribute('href', '#openclaw-setup');
  await expect(page.getByRole('link', { name: 'Claude Code 配置说明' })).toHaveAttribute('href', '#claude-code-setup');
  await expect(page.getByRole('link', { name: 'OpenCode 配置说明' })).toHaveAttribute('href', '#opencode-setup');
  await expect(page.getByRole('link', { name: '常见问题' })).toHaveAttribute('href', '#faq');
  await expect(page.getByText('控制台进入 API Keys 页面')).toBeVisible();
  await expect(page.getByText('创建后的完整密钥通常只展示一次')).toBeVisible();
  await expect(page.getByText('Codex 与 Claude Code 模板直接使用弹窗里给出的根 Base URL', { exact: true })).toBeVisible();
  await expect(page.getByText('OpenCode 模板会在根地址基础上补成 /v1', { exact: true })).toBeVisible();
  await expect(page.getByText('ANTHROPIC_BASE_URL').first()).toBeVisible();
  await expect(page.getByText('OPENAI_API_KEY').first()).toBeVisible();
  await expect(page.getByText('supports_websockets').first()).toBeVisible();
  await expect(page.getByText('responses_websockets_v2').first()).toBeVisible();
  await expect(page.getByText('openai-responses').first()).toBeVisible();
  await expect(page.getByText('Node.js 22').first()).toBeVisible();
  await expect(page.getByText('baseURL').first()).toBeVisible();
  await expect(page.getByText('apiKey').first()).toBeVisible();
  await expect(page.getByText('sk-在此处替换成你的 API 密钥').first()).toBeVisible();
  await expect(page.getByText('https://brioi.com').first()).toBeVisible();
  await expect(page.getByText('https://brioi.com/v1').first()).toBeVisible();
  await expect(page.getByText('api.cubence.com')).toHaveCount(0);
  await expect(page.getByText('codex-for.me')).toHaveCount(0);
  await expect(page.getByText('sk-brioi-your-key')).toHaveCount(0);
  await expect(page.getByText('补充章节：当前上游弹窗未内置 OpenClaw 专用模板')).toBeVisible();
});

test('docs page uses a documentation layout with toc and reference table', async ({ page }) => {
  await page.goto('/docs.html');

  await expect(page.locator('.docs-layout')).toBeVisible();
  await expect(page.locator('.docs-sidebar')).toBeVisible();
  await expect(page.locator('.docs-article')).toBeVisible();
  await expect(page.getByRole('navigation', { name: '文档目录' })).toBeVisible();
  await expect(page.getByRole('link', { name: '创建密钥' })).toHaveAttribute('href', '#key-setup');
  await expect(page.getByRole('link', { name: 'Codex CLI 配置说明' })).toHaveAttribute('href', '#codex-setup');
  await expect(page.getByRole('link', { name: 'Codex CLI（WebSocket）配置说明' })).toHaveAttribute('href', '#codex-ws-setup');
  await expect(page.getByRole('link', { name: 'OpenClaw 配置说明' })).toHaveAttribute('href', '#openclaw-setup');
  await expect(page.getByRole('link', { name: 'Claude Code 配置说明' })).toHaveAttribute('href', '#claude-code-setup');
  await expect(page.getByRole('link', { name: 'OpenCode 配置说明' })).toHaveAttribute('href', '#opencode-setup');
  const referenceTable = page.locator('.docs-reference-table');
  await expect(referenceTable).toBeVisible();
  await expect(referenceTable.getByRole('cell', { name: 'Codex CLI', exact: true })).toBeVisible();
  await expect(referenceTable.getByRole('cell', { name: 'Codex CLI (WebSocket)', exact: true })).toBeVisible();
  await expect(referenceTable.getByRole('cell', { name: 'OpenClaw', exact: true })).toBeVisible();
  await expect(referenceTable.getByRole('cell', { name: 'Claude Code', exact: true })).toBeVisible();
  await expect(referenceTable.getByRole('cell', { name: 'OpenCode', exact: true })).toBeVisible();
  await expect(referenceTable.getByText('https://brioi.com', { exact: true })).toHaveCount(3);
  await expect(referenceTable.getByText('https://brioi.com/v1', { exact: true })).toHaveCount(2);
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
