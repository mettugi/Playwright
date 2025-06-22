import { MainPage } from '@pages/main-page';
import { Locator, Page } from '@playwright/test';
import { AboutPage } from '@pages/disappearing-elements/about-page';
import { ContactUsPage } from './contact-us-page';
import { PortfolioPage } from './portfolio-page';
import { GalleryPage } from './gallery-page';

export class DisappearingElementsPage {
  readonly page: Page;
  readonly homeButton: Locator;
  readonly aboutButton: Locator;
  readonly contactUsButton: Locator;
  readonly portfolioButton: Locator;
  readonly galleryButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.homeButton = page.getByRole('link', { name: 'Home' });
    this.aboutButton = page.getByRole('link', { name: 'About' });
    this.contactUsButton = page.getByRole('link', { name: 'Contact us' });
    this.portfolioButton = page.getByRole('link', { name: 'Portfolio' });
    this.galleryButton = page.getByRole('link', { name: 'Gallery' });
  }

  async home() {
    await this.homeButton.click();
    return new MainPage(this.page);
  }

  async about() {
    await this.aboutButton.click();
    return new AboutPage(this.page);
  }

  async contactUs() {
    await this.contactUsButton.click();
    return new ContactUsPage(this.page);
  }

  async portfolio() {
    await this.portfolioButton.click();
    return new PortfolioPage(this.page);
  }

  async gallery() {
    await this.galleryButton.click();
    return new GalleryPage(this.page);
  }
}
