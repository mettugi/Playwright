import { Locator, Page } from '@playwright/test';

export class ContextMenuPage {
  readonly page: Page;
  readonly hotSpot: Locator;

  constructor(page: Page) {
    this.page = page;
    this.hotSpot = page.locator('#hot-spot');
  }

  async showContextMenu() {
    await this.hotSpot.hover();
    await this.hotSpot.click({ button: 'right' });
  }
}
