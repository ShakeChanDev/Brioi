import { test, expect } from '@playwright/test';

test('homepage shell loads with title and navigation', async ({ page }) => {
  await page.goto('/');

  const nav = page.getByRole('navigation', { name: '主导航' });

  await expect(page).toHaveTitle(/Brioi API/);
  await expect(nav).toBeVisible();
  await expect(nav.getByRole('link', { name: '立即购买' })).toHaveAttribute('href', './buy.html?plan=plus-monthly');
  await expect(page.getByRole('main')).toBeVisible();
});

test('hero shows the approved price-first message and a single plus card', async ({ page }) => {
  await page.goto('/');

  const hero = page.locator('#hero');

  await expect(hero.getByRole('heading', { level: 1 })).toContainText('不想再为');
  await expect(hero.getByText('我想直接用 GPT / Codex。')).toBeVisible();
  await expect(hero.getByText('那就别买贵的。一个订阅，直接上。')).toBeVisible();
  await expect(hero.getByText('是官方客户端镜像接入，不是缩水版，也不是只卖 API 点数。')).toBeVisible();
  await expect(hero.getByRole('heading', { name: 'Plus 月卡' })).toBeVisible();
  await expect(hero.getByText('¥99')).toBeVisible();
  await expect(hero.locator('.hero-side-card')).toHaveCount(1);
});

test('homepage lists supported software cards and updated client FAQ copy', async ({ page }) => {
  await page.goto('/');

  const intro = page.locator('.editorial-blocks');
  const faq = page.locator('.faq');
  const footer = page.locator('.site-footer');

  await expect(intro.getByRole('heading', { level: 2, name: '支持的软件。直接开用。' })).toBeVisible();
  await expect(intro.locator('.software-card')).toHaveCount(4);
  for (const [softwareSlug, softwareName] of [
    ['codex', 'Codex'],
    ['claude-code', 'Claude Code'],
    ['opencode', 'OpenCode'],
    ['openclaw', 'OpenClaw'],
  ]) {
    const softwareCard = intro.locator(`.software-card[data-software="${softwareSlug}"]`);

    await expect(softwareCard.locator('.software-icon')).toHaveClass(`software-icon software-icon--${softwareSlug}`);
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
  await page.goto('/');

  const cards = page.locator('.software-card');

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
});
