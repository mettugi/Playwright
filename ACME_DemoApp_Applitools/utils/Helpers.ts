import { Page, expect } from '@playwright/test';

export class Helpers {
  static async waitForPageLoad(page: Page, timeout: number = 30000): Promise<void> {
    await page.waitForLoadState('networkidle', { timeout });
  }

  static async takeScreenshot(page: Page, name: string): Promise<void> {
    await page.screenshot({ 
      path: `reports/screenshots/${name}-${Date.now()}.png`,
      fullPage: true 
    });
  }

  static async getRandomString(length: number = 8): Promise<string> {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  static async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static async isElementVisible(page: Page, selector: string): Promise<boolean> {
    try {
      return await page.isVisible(selector);
    } catch {
      return false;
    }
  }

  static async waitForElementToDisappear(page: Page, selector: string, timeout: number = 5000): Promise<void> {
    await page.waitForSelector(selector, { state: 'hidden', timeout });
  }
}
