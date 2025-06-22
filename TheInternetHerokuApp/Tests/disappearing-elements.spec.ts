import { DisappearingElementsPage as DisappearingElementsPage } from '@pages/disappearing-elements/disappearing-elements-page';
import { MainPage } from '@pages/main-page';
import { test as base, expect } from '@playwright/test';

const test = base.extend<{ dissappearringElementsPage: DisappearingElementsPage }>({
  dissappearringElementsPage: async ({ page }, use) => {
    await page.goto(process.env.BASE_URL);
    const mainPage = new MainPage(page);
    const dissappearringElementsPage = await mainPage.dissappearringElements();
    use(dissappearringElementsPage);
  },
});

test.describe('DisappearingElements Tests', () => {
  test('User is redirected to home page after clicking "Home" link', async ({ dissappearringElementsPage }) => {
    const mainPage = await dissappearringElementsPage.home();
    await expect(mainPage.header).toBeVisible();
  });

  test('User is redirected to "Not found" page after clicking "About" link', async ({ dissappearringElementsPage }) => {
    const aboutPage = await dissappearringElementsPage.about();
    await expect(aboutPage.header).toBeVisible();
  });

  test('User is redirected to "Not found" page after clicking "Contact us" link', async ({
    dissappearringElementsPage,
  }) => {
    const contactUsPage = await dissappearringElementsPage.contactUs();
    await expect(contactUsPage.header).toBeVisible();
  });

  test('User is redirected to "Not found" page after clicking "Portfolio" link', async ({
    dissappearringElementsPage,
  }) => {
    const portfolioPage = await dissappearringElementsPage.portfolio();
    await expect(portfolioPage.header).toBeVisible();
  });

  // I don't like this test that much because it depends on element dynamically showing
  // I am tempted to skip it
  test('The "Gallery" link shows and dissapears randomly', async ({ dissappearringElementsPage, page }) => {
    let refreshPageCount = 10;
    let galleryLinkVisibleCount = 0;
    while (refreshPageCount > 0) {
      await page.reload();
      if (await dissappearringElementsPage.galleryButton.isVisible()) {
        galleryLinkVisibleCount += 1;
      }
      refreshPageCount--;
    }
    console.log(`Gallery link appeared ${galleryLinkVisibleCount} times`);
    expect(galleryLinkVisibleCount).toBeGreaterThan(0);
  });
});
