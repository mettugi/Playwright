import { expect, test } from '@playwright/test';
import { InputsPage } from '@pages/inputs-page';
import { MainPage } from '@pages/main-page';

test.beforeEach(async ({ page }) => {
  await page.goto(process.env.BASE_URL);
  const mainPage = new MainPage(page);
  await mainPage.inputsLink.click();
});

test.describe('Inputs Test', () => {
  test('User should be able to fill input with numbers', async ({ page }) => {
    const inputsPage = new InputsPage(page);
    await inputsPage.fillInput('123');
    await expect(inputsPage.numberInput).toHaveValue('123');
  });

  test('User should not be able to fill input with alphabet characters', async ({ page }) => {
    const inputsPage = new InputsPage(page);
    await expect(inputsPage.fillInput('abc')).rejects.toThrow();
  });
});
