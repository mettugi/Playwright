import { Locator, Page } from '@playwright/test';

export class CheckboxesPage {
  readonly page: Page;
  readonly header: Locator;
  readonly checkbox1: Locator;
  readonly checkbox2: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.getByRole('heading', { name: 'Checkboxes' });
    this.checkbox1 = page.getByRole('checkbox').nth(0);
    this.checkbox2 = page.getByRole('checkbox').nth(1);
  }
}
