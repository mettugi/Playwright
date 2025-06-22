import { Locator, Page } from '@playwright/test';

export class BrokenImagesPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async getImages(): Promise<Locator[]> {
    return await this.page.locator('img').all();
  }
}
