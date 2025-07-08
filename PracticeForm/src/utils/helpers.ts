import { Page } from '@playwright/test';

export class TestHelpers {
  static async waitForPageLoad(page: Page) {
    await page.waitForLoadState('networkidle');
  }

  static async scrollToElement(page: Page, locator: any) {
    await locator.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500); // Small delay after scrolling
  }

  static async takeScreenshot(page: Page, name: string) {
    await page.screenshot({ 
      path: `screenshots/${name}-${Date.now()}.png`,
      fullPage: true 
    });
  }

  static generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  static generateRandomEmail(): string {
    const username = this.generateRandomString(8);
    const domain = this.generateRandomString(5);
    return `${username}@${domain}.com`;
  }

  static generateRandomMobile(): string {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
  }
}
