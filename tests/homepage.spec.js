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
