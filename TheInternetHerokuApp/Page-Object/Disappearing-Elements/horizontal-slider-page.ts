import { Locator, Page } from '@playwright/test';

export class HorizontalSliderPage {
  private readonly page: Page;
  readonly slider: Locator;
  readonly sliderValueInfo: Locator;

  constructor(page: Page) {
    this.page = page;
    this.slider = page.getByRole('slider');
    this.sliderValueInfo = page.locator('#range');
  }

  async setSliderValue(value: string) {
    await this.slider.fill(value);
  }
}
