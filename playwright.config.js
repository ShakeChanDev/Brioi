import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  use: {
    baseURL: 'http://127.0.0.1:22222',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run start',
    port: 22222,
    reuseExistingServer: !process.env.CI,
  },
});
