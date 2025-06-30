import { test, expect } from '../fixtures/testFixtures';
import { TEST_DATA } from '../utils/TestData';

test.describe('Visual Regression Tests', () => {
  test('VR001: Login page visual comparison', async ({ loginPage, page }) => {
    await loginPage.navigateToLogin();
    await loginPage.waitForPageLoad();
    
    // Visual comparison
    await expect(page).toHaveScreenshot('login-page.png');
  });

  test('VR002: Dashboard visual comparison', async ({ loginPage, dashboardPage, page }) => {
    await loginPage.navigateToLogin();
    await loginPage.login(TEST_DATA.valid.username, TEST_DATA.valid.password);
    await dashboardPage.waitForDashboard();
    
    // Visual comparison
    await expect(page).toHaveScreenshot('dashboard-page.png');
  });

  test('VR003: Mobile responsive design', async ({ loginPage, page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await loginPage.navigateToLogin();
    await loginPage.waitForPageLoad();
    
    // Mobile visual comparison
    await expect(page).toHaveScreenshot('login-page-mobile.png');
  });

  test('VR004: Cross-browser consistency', async ({ loginPage, page }) => {
    await loginPage.navigateToLogin();
    await loginPage.waitForPageLoad();
    
    // Browser-specific screenshots
    const browserName = page.context().browser()?.browserType()?.name() || 'unknown';
    await expect(page).toHaveScreenshot(`login-${browserName}.png`);
  });
});
