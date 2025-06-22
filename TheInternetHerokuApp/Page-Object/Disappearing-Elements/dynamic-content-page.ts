import { Locator, Page } from '@playwright/test';

export class DynamicContentPage {
  readonly page: Page;
  readonly row1: Locator;
  readonly row2: Locator;
  readonly row3: Locator;
  readonly staticContentLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.row1 = page.locator('.row > div.large-10.columns:nth-of-type(2)').nth(0);
    this.row2 = page.locator('.row > div.large-10.columns:nth-of-type(2)').nth(1);
    this.row3 = page.locator('.row > div.large-10.columns:nth-of-type(2)').nth(2);
    this.staticContentLink = page.getByRole('link', { name: 'click here' });
  }
}
