import { Locator, Page } from '@playwright/test';

export class EntryAdPage {
  readonly page: Page;
  readonly modalText: Locator;
  readonly closeModal: Locator;
  

  constructor(page: Page) {
    this.page = page;
    this.modalText = page.getByText(
      "It's commonly used to encourage a user to take an action (e.g., give their e-mail address to sign up for something or disable their ad blocker).");
    this.closeModal = page.getByText('Close', {exact: true})
  }
}
