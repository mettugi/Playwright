import { expect, test as base } from '@playwright/test';
import { AddRemoveElementsPage } from '@pages/add-remove-elements-page';
import { MainPage } from '@pages/main-page';

const test = base.extend<{ addRemoveElementsPage: AddRemoveElementsPage }>({
  addRemoveElementsPage: async ({ page }, use) => {
    await page.goto(process.env.BASE_URL);
    const mainPage = new MainPage(page);
    await mainPage.addRemoveElementsLink.click();
    const addRemoveElementsPage = new AddRemoveElementsPage(page);
    use(addRemoveElementsPage);
  },
});

test.describe('Add/Remove Elements Tests', () => {
  test('User should be able to go to the "Add/Remove Elements" page', async ({ addRemoveElementsPage }) => {
    await expect(addRemoveElementsPage.addElementButton).toBeVisible();
    await expect(addRemoveElementsPage.deleteElementButton).not.toBeVisible();
  });

  test('User should be able to add and remove one element', async ({ addRemoveElementsPage }) => {
    await addRemoveElementsPage.addElement();
    await expect(addRemoveElementsPage.deleteElementButton).toBeVisible();
    await addRemoveElementsPage.deleteElement();
    await expect(addRemoveElementsPage.deleteElementButton).not.toBeVisible();
  });

  test('User should be able to add and remove two elements', async ({ addRemoveElementsPage }) => {
    await addRemoveElementsPage.addElement();
    await expect(addRemoveElementsPage.deleteElementButton).toHaveCount(1);
    await addRemoveElementsPage.addElement();
    await expect(addRemoveElementsPage.deleteElementButton).toHaveCount(2);
    await addRemoveElementsPage.deleteElement();
    await expect(addRemoveElementsPage.deleteElementButton).toHaveCount(1);
    await addRemoveElementsPage.deleteElement();
    await expect(addRemoveElementsPage.deleteElementButton).not.toBeVisible();
  });
});
