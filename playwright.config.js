import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  use: {
    baseURL: 'http://127.0.0.1:22221',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npx http-server . -p 22221 -c-1',
    port: 22221,
    reuseExistingServer: !process.env.CI,
  },
});
