import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: 'https://demoqa.com/books',
    headless: true,
    screenshot: 'only-on-failure',
  },
  testDir: './tests',
  reporter: [['html', { outputFolder: 'playwright-report' }]]
});
