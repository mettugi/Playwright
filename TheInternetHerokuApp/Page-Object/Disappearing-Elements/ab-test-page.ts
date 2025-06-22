import { Locator, Page } from '@playwright/test';

export class ABTestPage {
  readonly page: Page;
  readonly abTestLink: Locator;
  readonly abTestHeading: Locator;
  readonly abTestParagraph: Locator;

  constructor(page: Page) {
    this.page = page;
    this.abTestHeading = page.locator('h3');
    this.abTestParagraph = page.locator('p');
  }
}
