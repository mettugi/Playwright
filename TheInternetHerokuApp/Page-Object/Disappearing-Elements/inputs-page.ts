import { Locator, Page } from '@playwright/test';

export class InputsPage {
  readonly page: Page;
  readonly numberInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.numberInput = page.locator("input[type='number']");
  }

  async fillInput(value: string) {
    await this.numberInput.fill(value);
  }
}
