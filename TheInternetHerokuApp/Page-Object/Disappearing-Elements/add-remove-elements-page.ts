import { Locator, Page } from '@playwright/test';

export class AddRemoveElementsPage {
  readonly page: Page;
  readonly addElementButton: Locator;
  readonly deleteElementButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addElementButton = page.locator("text='Add Element'");
    this.deleteElementButton = page.locator("text='Delete'");
  }

  async addElement() {
    await this.addElementButton.first().click();
  }

  async deleteElement() {
    await this.deleteElementButton.first().click();
  }
}
