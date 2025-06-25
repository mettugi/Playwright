import { expect, Page } from '@playwright/test';

export class CustomAssertions {
  static async expectUrlToContain(page: Page, expectedUrl: string) {
    await expect(page).toHaveURL(new RegExp(expectedUrl));
  }

  static async expectElementToBeVisible(page: Page, selector: string) {
    await expect(page.locator(selector)).toBeVisible();
  }

  static async expectErrorMessage(page: Page, expectedMessage: string) {
    const errorElement = page.locator('[data-test="error"]');
    await expect(errorElement).toBeVisible();
    await expect(errorElement).toContainText(expectedMessage);
  }

  static async expectSuccessfulLogin(page: Page) {
    await expect(page.locator('.title')).toContainText('Products');
    await expect(page.locator('.inventory_container')).toBeVisible();
    await expect(page).toHaveURL(/.*inventory\.html/);
  }
}
