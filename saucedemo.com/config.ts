import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: 'https://www.saucedemo.com/',
    headless: true,
    //screenshot: 'only-on-failure',
  },
  testDir: './tests',
  reporter: [['html', { outputFolder: 'playwright-report' }]]
