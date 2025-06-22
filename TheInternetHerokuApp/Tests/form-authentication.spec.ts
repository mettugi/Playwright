import { expect, test as base } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { LoginPage } from '@pages/login-page';
import { MainPage } from '@pages/main-page';

const test = base.extend<{ loginPage: LoginPage }>({
  loginPage: async ({ page }, use) => {
    await page.goto(process.env.BASE_URL);
    const mainPage = new MainPage(page);
    const loginPage = await mainPage.formAuthentication();
    use(loginPage);
  },
});

test('Error message should be shown after providing invalid username', async ({ loginPage, page }) => {
  await loginPage.login(faker.internet.username(), 'SuperSecretPassword!');
  await expect(page.getByText('Your username is invalid!')).toBeVisible();
});

test('Error message should be shown after providing invalid password', async ({ loginPage, page }) => {
  await loginPage.login('tomsmith', 'invalid');
  await expect(page.getByText('Your password is invalid!')).toBeVisible();
});

test('User should succefully login after providing proper username and password', async ({ loginPage, page }) => {
  await loginPage.login('tomsmith', 'SuperSecretPassword!');
  await expect(page.getByText('Secure Area', { exact: true })).toBeVisible();
  await expect(page.getByText('Welcome to the Secure Area. When you are done click logout below.')).toBeVisible();
});
