import { GeolocationPage } from '@pages/geolocation-page';
import { MainPage } from '@pages/main-page';
import { expect, test as base } from '@playwright/test';

const test = base.extend<{ geolocationPage: GeolocationPage }>({
  geolocationPage: async ({ page }, use) => {
    await page.goto(process.env.BASE_URL);
    const mainPage = new MainPage(page);
    const geolocationPage = await mainPage.geolocation();
    use(geolocationPage);
  },
});

test('Should access and show users geolocation', async ({ geolocationPage, page }) => {
  await expect(page.getByText('Click the button to get your current latitude and longitude')).toBeVisible();
  await geolocationPage.whereAmIButton.click();

  await expect(page.getByText('Latitude:')).toBeVisible();
  await expect(page.getByText(process.env.LATITUDE)).toBeVisible();
  await expect(page.getByText('Longitude:')).toBeVisible();
  await expect(page.getByText(process.env.LONGITUDE)).toBeVisible();
});
