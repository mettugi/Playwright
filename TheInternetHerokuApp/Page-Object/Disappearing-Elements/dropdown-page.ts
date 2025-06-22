import { Locator, Page } from '@playwright/test';

export class DropdownPage {
  readonly page: Page;
  readonly dropdown: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dropdown = page.locator('#dropdown');
  }

  async selectOption(option: string) {
    await this.dropdown.selectOption(option);
  }

  getOptionByName(option: string): Locator {
    return this.page.getByRole('option', { name: option });
  }
}
