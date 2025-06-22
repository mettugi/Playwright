import { CheckboxesPage } from '@pages/checkboxes-page';
import { MainPage } from '@pages/main-page';
import { expect, test as base } from '@playwright/test';

const test = base.extend<{ checkboxesPage: CheckboxesPage }>({
  checkboxesPage: async ({ page }, use) => {
    await page.goto(process.env.BASE_URL);
    const mainPage = new MainPage(page);
    const checkboxesPage = await mainPage.checkboxes();
    use(checkboxesPage);
  },
});

test.describe('Checkboxes Tests', () => {
  test('User should be able to check and uncheck checkboxes', async ({ checkboxesPage }) => {
    await expect(checkboxesPage.checkbox1).not.toBeChecked();
    await expect(checkboxesPage.checkbox2).toBeChecked();
    await checkboxesPage.checkbox1.check();
    await checkboxesPage.checkbox2.uncheck();
    await expect(checkboxesPage.checkbox1).toBeChecked();
    await expect(checkboxesPage.checkbox2).not.toBeChecked();
  });
});
