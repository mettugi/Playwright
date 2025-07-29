import { Page, Locator } from '@playwright/test';
import { Helpers } from '../utils/Helpers';

export abstract class BasePage {
  protected page: Page;
  protected baseUrl: string;

  constructor(page: Page, baseUrl: string = 'https://www.saucedemo.com') {
    this.page = page;
    this.baseUrl = baseUrl;
  }

  async goto(path: string = ''): Promise<void> {
    await this.page.goto(`${this.baseUrl}${path}`);
    await Helpers.waitForPageLoad(this.page);
  }

  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async takeScreenshot(name: string): Promise<void> {
    await Helpers.takeScreenshot(this.page, name);
  }
}
