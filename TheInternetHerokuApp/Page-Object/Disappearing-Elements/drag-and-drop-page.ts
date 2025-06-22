import { Locator, Page } from '@playwright/test';

export class DragAndDropPage {
  readonly page: Page;
  readonly columnB: Locator;
  readonly columnA: Locator;

  constructor(page: Page) {
    this.page = page;
    this.columnB = page.locator('#column-b');
    this.columnA = page.locator('#column-a');
  }

  async dragColumnBToColumnA() {
    await this.columnB.dragTo(this.columnA);
  }
}
