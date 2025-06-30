import { Page } from '@playwright/test';
import { CONSTANTS } from '../utils/Constants';

export abstract class BasePage {
  constructor(protected page: Page) {}

  async navigateTo(url: string = CONSTANTS.BASE_URL): Promise<void> {
    await this.page.goto(url);
    await this.page.waitForLoadState('networkidle');
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  async getPageUrl(): Promise<string> {
    return this.page.url();
  }

  async refreshPage(): Promise<void> {
    await this.page.reload();
    await this.page.waitForLoadState('networkidle');
  }

  async goBack(): Promise<void> {
    await this.page.goBack();
    await this.page.waitForLoadState('networkidle');
  }

  async waitForSelector(selector: string, timeout: number = CONSTANTS.TIMEOUTS.DEFAULT): Promise<void> {
    await this.page.waitForSelector(selector, { timeout });
  }

  async clickElement(selector: string): Promise<void> {
    await this.waitForSelector(selector);
    await this.page.click(selector);
  }

  async fillInput(selector: string, value: string): Promise<void> {
    await this.waitForSelector(selector);
    await this.page.fill(selector, value);
  }

  async getText(selector: string): Promise<string> {
    await this.waitForSelector(selector);
    return await this.page.textContent(selector) || '';
  }

  async isElementVisible(selector: string): Promise<boolean> {
    try {
      return await this.page.isVisible(selector);
    } catch {
      return false;
    }
  }
}
