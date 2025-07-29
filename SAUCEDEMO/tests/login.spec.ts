import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { InventoryPage } from '../src/pages/InventoryPage';
import { TestData } from '../src/utils/TestData';

test.describe('Login Tests', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
  });

  test('Should login successfully with valid credentials', async ({ page }) => {
    await loginPage.login(TestData.USERS.STANDARD);
    await inventoryPage.verifyInventoryPageLoaded();
    
    expect(await page.url()).toContain('/inventory.html');
  });

  test('Should show error for invalid credentials', async ({ page }) => {
    await loginPage.login({ username: 'invalid_user', password: 'wrong_password' });
    await loginPage.verifyLoginError();
    
    expect(await loginPage.isLoginPageVisible()).toBe(true);
  });
});
