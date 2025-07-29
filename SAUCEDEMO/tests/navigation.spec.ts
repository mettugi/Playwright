import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { InventoryPage } from '../src/pages/InventoryPage';
import { TestData } from '../src/utils/TestData';
import { Helpers } from '../src/utils/Helpers';

test.describe('Navigation Tests', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    
    // Login before each test
    await loginPage.login(TestData.USERS.STANDARD);
    await inventoryPage.verifyInventoryPageLoaded();
  });

  test('Test Case 3: Navigate to About page via hamburger menu', async ({ page }) => {
    // Click hamburger menu
    await inventoryPage.openHamburgerMenu();

    // Verify About link is visible
    await inventoryPage.verifyAboutLinkVisible();

    // Click on About link
    await inventoryPage.clickAboutLink();

    // Verify navigation to Sauce Labs website
    await Helpers.verifyUrl(page, '.*saucelabs\\.com.*');

    // Additional verification - check if we're on the Sauce Labs website
    await Helpers.verifyTitle(page, '.*Sauce Labs.*');

    console.log('✅ Test Case 3 Passed: Successfully navigated to About page (Sauce Labs website)');
  });

  test('Logout functionality test', async ({ page }) => {
    // Logout
    await inventoryPage.logout();

    // Verify we're back on login page
    expect(await loginPage.isLoginPageVisible()).toBe(true);
    expect(await page.url()).toContain(TestData.URLS.LOGIN);

    console.log('✅ Logout test passed');
  });
});
