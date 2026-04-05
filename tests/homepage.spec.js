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

  const intro = page.locator('.editorial-blocks');
  const faq = page.locator('.faq');
  const footer = page.locator('.site-footer');

  await expect(intro.getByRole('heading', { level: 2, name: '官方客户端。别买贵的。' })).toBeVisible();
  await expect(intro.getByText('Claude / Codex / Cursor 直接用。')).toBeVisible();
  await expect(intro.getByText('不是缩水版，也不是纯点数站。')).toBeVisible();
  await expect(intro.getByText('购买放在单独页面，首页只负责说明白和卖清楚。')).toBeVisible();

  await expect(faq.getByRole('heading', { level: 2, name: '你会问的，先回答。' })).toBeVisible();
  await expect(faq.getByRole('heading', { level: 3, name: '支持哪些客户端？' })).toBeVisible();
  await expect(faq.getByText('支持 Claude、Codex、Cursor 等官方客户端使用。')).toBeVisible();
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
  await expect(footer.getByRole('link', { name: '立即购买' })).toHaveAttribute('href', './buy.html');
});
