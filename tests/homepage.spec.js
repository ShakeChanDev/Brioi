import { test, expect } from '@playwright/test';

test('homepage shell loads with title and navigation', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Brioi API/);
  await expect(page.getByRole('navigation', { name: '主导航' })).toBeVisible();
  await expect(page.getByRole('main')).toBeVisible();
});

test('hero shows the approved price-first message and a single plus card', async ({ page }) => {
  await page.goto('/');

  const hero = page.locator('#hero');

  await expect(hero.getByRole('heading', { level: 1 })).toContainText('不想再为');
  await expect(hero.getByText('我想直接用 Claude / Codex / Cursor。')).toBeVisible();
  await expect(hero.getByText('那就别买贵的。一个订阅，直接上。')).toBeVisible();
  await expect(hero.getByText('是官方客户端镜像接入，不是缩水版，也不是只卖 API 点数。')).toBeVisible();
  await expect(hero.getByRole('heading', { name: 'Plus 月卡' })).toBeVisible();
  await expect(hero.getByText('¥99')).toBeVisible();
  await expect(hero.locator('.hero-side-card')).toHaveCount(1);
});

test('homepage includes the editorial intro blocks and approved FAQ copy', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 2, name: '官方客户端。别买贵的。' })).toBeVisible();
  await expect(page.getByText('Claude / Codex / Cursor 直接用。')).toBeVisible();
  await expect(page.getByText('不是缩水版，也不是纯点数站。')).toBeVisible();
  await expect(page.getByText('购买放在单独页面，首页只负责说明白和卖清楚。')).toBeVisible();

  await expect(page.getByRole('heading', { level: 2, name: '你会问的，先回答。' })).toBeVisible();
  await expect(page.getByText('支持哪些客户端？')).toBeVisible();
  await expect(page.getByText('这是官方客户端接入，还是 API 点数？')).toBeVisible();
  await expect(page.getByText('额度怎么计算？')).toBeVisible();
  await expect(page.getByText('购买后去哪里？')).toBeVisible();
  await expect(page.getByText('哪个套餐最适合大多数人？')).toBeVisible();
});
