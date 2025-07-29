import { Page, expect } from '@playwright/test';

export class Helpers {
  static async waitForPageLoad(page: Page, timeout: number = 10000): Promise<void> {
    await page.waitForLoadState('networkidle', { timeout });
  }

  static async takeScreenshot(page: Page, name: string): Promise<void> {
    await page.screenshot({ path: `test-results/screenshots/${name}.png` });
  }

  static async getTimestamp(): Promise<string> {
    return new Date().toISOString().replace(/[:.]/g, '-');
  }

  static async verifyUrl(page: Page, expectedUrl: string): Promise<void> {
    await expect(page).toHaveURL(new RegExp(expectedUrl));
  }

  static async verifyTitle(page: Page, expectedTitle: string): Promise<void> {
    await expect(page).toHaveTitle(new RegExp(expectedTitle));
  }
}
