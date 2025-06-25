import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('SauceDemo Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.waitForPageLoad();
  });

  test('should login with valid credentials', async ({ page }) => {
    await loginPage.loginWithValidCredentials();
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    await expect(page.locator('.title')).toHaveText('Products');
  });

  test('should show error with invalid username', async () => {
    await loginPage.login('invalid_user', 'secret_sauce');
    await expect(loginPage.errorMessage).toBeVisible();
    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toContain('Username and password do not match');
  });

  test('should show error with invalid password', async () => {
    await loginPage.login('standard_user', 'invalid_password');
    await expect(loginPage.errorMessage).toBeVisible();
    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toContain('Username and password do not match');
  });

  test('should show error with empty credentials', async () => {
    await loginPage.login('', '');
    await expect(loginPage.errorMessage).toBeVisible();
    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toContain('Username is required');
  });

  test('should show error with empty username', async () => {
    await loginPage.login('', 'secret_sauce');
    await expect(loginPage.errorMessage).toBeVisible();
    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toContain('Username is required');
  });

  test('should show error with empty password', async () => {
    await loginPage.login('standard_user', '');
    await expect(loginPage.errorMessage).toBeVisible();
    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toContain('Password is required');
  });

  test('should login with locked out user and show error', async () => {
    await loginPage.login('locked_out_user', 'secret_sauce');
    await expect(loginPage.errorMessage).toBeVisible();
    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toContain('Sorry, this user has been locked out');
  });

  test('should clear credentials', async () => {
    await loginPage.usernameInput.fill('test_user');
    await loginPage.passwordInput.fill('test_password');
    
    await loginPage.clearCredentials();
    
    await expect(loginPage.usernameInput).toHaveValue('');
    await expect(loginPage.passwordInput).toHaveValue('');
  });
});
