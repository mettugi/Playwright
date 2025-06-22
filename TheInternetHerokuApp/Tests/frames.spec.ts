import { MainPage } from '@pages/main-page';
import { test, expect } from '@playwright/test';

test('Should be able to access all nested frames and verify hierarchy', async ({ page }) => {
  await page.goto(process.env.BASE_URL);
  const mainPage = new MainPage(page);
  const nestedFrames = await mainPage.nestedFrames();

  expect(nestedFrames.frameTop).not.toBeNull();
  expect(nestedFrames.frameLeft).not.toBeNull();
  expect(nestedFrames.frameMiddle).not.toBeNull();
  expect(nestedFrames.frameRight).not.toBeNull();
  expect(nestedFrames.frameBottom).not.toBeNull();
  await expect(nestedFrames.frameLeft.getByText('LEFT')).toBeVisible();
  await expect(nestedFrames.frameMiddle.getByText('MIDDLE')).toBeVisible();
  await expect(nestedFrames.frameRight.getByText('RIGHT')).toBeVisible();
  await expect(nestedFrames.frameBottom.getByText('BOTTOM')).toBeVisible();
});
