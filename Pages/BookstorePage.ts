import { Page } from '@playwright/test';

export class BookstorePage {
  constructor(private page: Page) {}

  async searchBook(bookName: string) {
    await this.page.fill('#searchBox', bookName);
  }

  async clickFirstBook() {
    await this.page.locator('.action-buttons a').first().click();
  }
}
