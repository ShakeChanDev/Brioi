import { test, expect } from '@playwright/test';

test('homepage shell loads with title and navigation', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Brioi API/);
  await expect(page.getByRole('navigation', { name: '主导航' })).toBeVisible();
  await expect(page.getByRole('main')).toBeVisible();
});
