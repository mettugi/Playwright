import { BrokenImagesPage } from '@pages/broken-images-page';
import { MainPage } from '@pages/main-page';
import { test as base, expect } from '@playwright/test';

const test = base.extend<{ brokenImagesPage: BrokenImagesPage }>({
  brokenImagesPage: async ({ page }, use) => {
    await page.goto(process.env.BASE_URL);
    const mainPage = new MainPage(page);
    const brokenImagesPage = await mainPage.brokenImages();
    use(brokenImagesPage);
  },
});

test.describe('Broken Images Tests', () => {
  test('The second and third image on the page are broken', async ({ brokenImagesPage, page }) => {
    const images = await brokenImagesPage.getImages();
    const image1Url = await images[1].getAttribute('src');
    const resp1 = await page.request.get(`${process.env.BASE_URL}/${image1Url}`);
    const image2Url = await images[2].getAttribute('src');
    const resp2 = await page.request.get(`${process.env.BASE_URL}/${image2Url}`);
    expect(resp1.status()).toBe(404);
    expect(resp2.status()).toBe(404);
  });

  test('The github link and avatar images have proper source', async ({ brokenImagesPage, page }) => {
    const images = await brokenImagesPage.getImages();
    const image1Url = await images[0].getAttribute('src');
    const resp1 = await page.request.get(`${process.env.BASE_URL}/${image1Url}`);
    const image2Url = await images[3].getAttribute('src');
    const resp2 = await page.request.get(`${process.env.BASE_URL}/${image2Url}`);
    expect(resp1.status()).toBe(200);
    expect(resp2.status()).toBe(200);
  });
});
