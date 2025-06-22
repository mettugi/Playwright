import { expect, test as base } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { ForgotPasswordPage } from '@pages/reset-password-page';
import { MainPage } from '@pages/main-page';

const test = base.extend<{ forgotPasswordPage: ForgotPasswordPage }>({
  forgotPasswordPage: async ({ page }, use) => {
    await page.goto(process.env.BASE_URL);
    const mainPage = new MainPage(page);
    const forgotPasswordPage = await mainPage.forgotPassword();
    use(forgotPasswordPage);
  },
});

test.fail('The reset password message is sent after forgot password request', async ({ forgotPasswordPage, page }) => {
  await forgotPasswordPage.resetPassword(faker.internet.email());
  await expect(page.getByText('Internal Server Error')).not.toBeVisible();
  await expect(page.getByText('Reset password link sent')).toBeVisible();
});
