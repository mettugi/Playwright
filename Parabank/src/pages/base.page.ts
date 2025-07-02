// src/pages/base-page.ts
import { Page, Locator, expect } from '@playwright/test';
import { environment } from '@config/environment';

export abstract class BasePage {
  protected page: Page;
  protected baseUrl: string;

  constructor(page: Page) {
    this.page = page;
    this.baseUrl = environment.baseUrl;
  }

  // Navigation methods
  async navigateTo(path: string): Promise<void> {
    const url = path.startsWith('http') ? path : `${this.baseUrl}${path}`;
    await this.page.goto(url);
    await this.waitForPageLoad();
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  // Element interaction methods
  async click(selector: string): Promise<void> {
    await this.page.click(selector);
  }

  async fill(selector: string, value: string): Promise<void> {
    await this.page.fill(selector, value);
  }

  async selectOption(selector: string, value: string): Promise<void> {
    await this.page.selectOption(selector, value);
  }

  async getText(selector: string): Promise<string> {
    return await this.page.textContent(selector) || '';
  }

  async getValue(selector: string): Promise<string> {
    return await this.page.inputValue(selector);
  }

  // Wait methods
  async waitForSelector(selector: string, timeout?: number): Promise<Locator> {
    return await this.page.waitForSelector(selector, { 
      timeout: timeout || environment.timeouts.default 
    });
  }

  async waitForElement(selector: string, state: 'visible' | 'hidden' | 'attached' | 'detached' = 'visible'): Promise<void> {
    await this.page.waitForSelector(selector, { state });
  }

  async waitForText(selector: string, text: string): Promise<void> {
    await this.page.waitForFunction(
      ({ selector, text }) => {
        const element = document.querySelector(selector);
        return element && element.textContent?.includes(text);
      },
      { selector, text }
    );
  }

  // Verification methods
  async verifyElementVisible(selector: string): Promise<void> {
    await expect(this.page.locator(selector)).toBeVisible();
  }

  async verifyElementHidden(selector: string): Promise<void> {
    await expect(this.page.locator(selector)).toBeHidden();
  }

  async verifyText(selector: string, expectedText: string): Promise<void> {
    await expect(this.page.locator(selector)).toContainText(expectedText);
  }

  async verifyValue(selector: string, expectedValue: string): Promise<void> {
    await expect(this.page.locator(selector)).toHaveValue(expectedValue);
  }

  async verifyTitle(expectedTitle: string): Promise<void> {
    await expect(this.page).toHaveTitle(new RegExp(expectedTitle));
  }

  async verifyUrl(expectedUrl: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(expectedUrl));
  }

  // Utility methods
  async takeScreenshot(name: string): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${name}-${timestamp}.png`;
    const path = `screenshots/${filename}`;
    
    await this.page.screenshot({ 
      path, 
      fullPage: true 
    });
    
    return path;
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async refreshPage(): Promise<void> {
    await this.page.reload();
    await this.waitForPageLoad();
  }

  async goBack(): Promise<void> {
    await this.page.goBack();
    await this.waitForPageLoad();
  }

  async goForward(): Promise<void> {
    await this.page.goForward();
    await this.waitForPageLoad();
  }

  // Form helpers
  async fillForm(formData: Record<string, string>): Promise<void> {
    for (const [selector, value] of Object.entries(formData)) {
      await this.fill(selector, value);
    }
  }

  async submitForm(submitSelector: string): Promise<void> {
    await this.click(submitSelector);
    await this.waitForPageLoad();
  }

  // Error handling
  async handleAlert(action: 'accept' | 'dismiss' = 'accept'): Promise<string | null> {
    return new Promise((resolve) => {
      this.page.once('dialog', async (dialog) => {
        const message = dialog.message();
        if (action === 'accept') {
          await dialog.accept();
        } else {
          await dialog.dismiss();
        }
        resolve(message);
      });
    });
  }

  // Debugging helpers
  async logPageContent(): Promise<void> {
    const content = await this.page.content();
    console.log('Page content:', content);
  }

  async logConsoleMessages(): Promise<void> {
    this.page.on('console', (msg) => {
      console.log('Browser console:', msg.text());
    });
  }

  // Cleanup
  async close(): Promise<void> {
    await this.page.close();
  }
}
