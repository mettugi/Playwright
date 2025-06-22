import { ContextMenuPage } from '@pages/context-menu-page';
import { MainPage } from '@pages/main-page';
import { test as base, expect } from '@playwright/test';

const test = base.extend<{ contextMenuPage: ContextMenuPage }>({
  contextMenuPage: async ({ page }, use) => {
    await page.goto(process.env.BASE_URL);
    const mainPage = new MainPage(page);
    const contextMenuPage = await mainPage.contextMenu();
    use(contextMenuPage);
  },
});

test.describe('Context Menu Tests', () => {
  test('User should be able to see context menu alert', async ({ contextMenuPage }) => {
    contextMenuPage.page.on('dialog', (dialog) => {
      expect(dialog.message()).toContain('You selected a context menu');
      dialog.accept();
    });
    await contextMenuPage.showContextMenu();
  });
});
