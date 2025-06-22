import { HorizontalSliderPage } from '@pages/horizontal-slider-page';
import { test, expect } from '@playwright/test';
import { execPath } from 'process';

test('Should be able to change slider value', async ({ page }) => {
  await page.goto(`${process.env.BASE_URL}/horizontal_slider`);
  const sliderPage = new HorizontalSliderPage(page);
  await sliderPage.setSliderValue('2.5');
  await expect(sliderPage.sliderValueInfo).toHaveText('2.5');
  await sliderPage.setSliderValue('4');
  await expect(sliderPage.sliderValueInfo).toHaveText('4');
  await sliderPage.setSliderValue('5');
  await expect(sliderPage.sliderValueInfo).toHaveText('5');
  await sliderPage.setSliderValue('1.5');
  await expect(sliderPage.sliderValueInfo).toHaveText('1.5');
});
