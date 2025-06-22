import { DragAndDropPage } from '@pages/drag-and-drop-page';
import { MainPage } from '@pages/main-page';
import { test as base, expect } from '@playwright/test';

const test = base.extend<{ dragAndDropPage: DragAndDropPage }>({
  dragAndDropPage: async ({ page }, use) => {
    await page.goto(process.env.BASE_URL);
    const mainPage = new MainPage(page);
    const dragAndDropPage = await mainPage.dragAndDrop();
    use(dragAndDropPage);
  },
});

test('User should be able drag and drop card a to card b', async ({ dragAndDropPage }) => {
  await expect(dragAndDropPage.columnB).toHaveText('B');
  await expect(dragAndDropPage.columnA).toHaveText('A');

  await dragAndDropPage.dragColumnBToColumnA();

  await expect(dragAndDropPage.columnB).toHaveText('A');
  await expect(dragAndDropPage.columnA).toHaveText('B');
});
