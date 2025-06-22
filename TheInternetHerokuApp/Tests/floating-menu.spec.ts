import { FloatingMenuPage } from '@pages/floating-menu-page';
import { MainPage } from '@pages/main-page';
import { expect, test as base } from '@playwright/test';

const test = base.extend<{ floatingMenuPage: FloatingMenuPage }>({
  floatingMenuPage: async ({ page }, use) => {
    await page.goto(process.env.BASE_URL);
    const mainPage = new MainPage(page);
    const floatingMenuPage = await mainPage.floatingMenu();
    use(floatingMenuPage);
  },
});

test('After scrolling down the floating menu is still visible', async ({ floatingMenuPage, page }) => {
  await expect(floatingMenuPage.homeLink).toBeVisible();
  await expect(floatingMenuPage.newsLink).toBeVisible();
  await expect(floatingMenuPage.contactLink).toBeVisible();
  await expect(floatingMenuPage.aboutLink).toBeVisible();

  const scrollHeight = await page.evaluate(() => {
    return window.document.body.scrollHeight;
  });

  await page.mouse.wheel(0, scrollHeight);

  await expect(floatingMenuPage.homeLink).toBeVisible();
  await expect(floatingMenuPage.newsLink).toBeVisible();
  await expect(floatingMenuPage.contactLink).toBeVisible();
  await expect(floatingMenuPage.aboutLink).toBeVisible();
});
