import { Locator, Page } from '@playwright/test';

export class PortfolioPage {
  readonly page: Page;
  readonly header: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.getByRole('heading', { name: 'Not Found' });
  }
}
