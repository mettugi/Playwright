import { Page, Locator } from '@playwright/test';

export class FloatingMenuPage {
  private readonly page: Page;
  readonly homeLink: Locator;
  readonly newsLink: Locator;
  readonly contactLink: Locator;
  readonly aboutLink: Locator;

  constructor(page: Page) {
    this.homeLink = page.getByRole('link', { name: 'Home' });
    this.newsLink = page.getByRole('link', { name: 'News' });
    this.contactLink = page.getByRole('link', { name: 'Contact' });
    this.aboutLink = page.getByRole('link', { name: 'About' });
  }
}
