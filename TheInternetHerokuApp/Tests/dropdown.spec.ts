import { DropdownPage } from '@pages/dropdown-page';
import { MainPage } from '@pages/main-page';
import { expect, test as base } from '@playwright/test';

const test = base.extend<{ dropdownPage: DropdownPage }>({
  dropdownPage: async ({ page }, use) => {
    await page.goto(process.env.BASE_URL);
    const mainPage = new MainPage(page);
    const dropdownPage = await mainPage.dropdown();
    use(dropdownPage);
  },
});

test.describe('Dropdown Tests', () => {
  test('User is able to select dropdown options', async ({ dropdownPage, page }) => {
    await expect(page.getByRole('option', { name: 'Please select an option' })).toHaveAttribute('selected');
    await dropdownPage.selectOption('Option 1');
    await expect(dropdownPage.getOptionByName('Option 1')).toHaveAttribute('selected');
    await dropdownPage.selectOption('Option 2');
    await expect(dropdownPage.getOptionByName('Option 2')).toHaveAttribute('selected');
  });
});
