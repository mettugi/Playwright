import { Locator, Page } from '@playwright/test';

export class GeolocationPage {
  private readonly page: Page;
  readonly whereAmIButton: Locator;
  constructor(page: Page) {
    this.page = page;
    this.whereAmIButton = page.getByRole('button', { name: 'Where am I?' });
  }
}
