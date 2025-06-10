import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('Valid login scenario', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login('testuser', 'Test@123');
  await expect(page.locator('#userName-value')).toHaveText('testuser');
});

test('Invalid login scenario', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login('invalid', 'wrongpass');
  await expect(page.locator('#userName-value')).toHaveCount(0);
});
