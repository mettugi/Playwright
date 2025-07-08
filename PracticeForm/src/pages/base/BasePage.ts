import { Page, Locator } from '@playwright/test';
import { TestHelpers } from '../../utils/helpers';
import { TIMEOUTS } from '../../utils/constants';

export abstract class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(url: string) {
    await this.page.goto(url);
    await TestHelpers.waitForPageLoad(this.page);
  }

  //async clickElement(locator: Locator) {
    //await locator.click({ force: true }); // ⬅️ force click even if overlapped
  //}
  //async clickElement(locator: Locator) {
  //try {
    //await locator.click();
  //} catch (err) {
    //console.warn('Default click failed, retrying with force...');
    //await locator.click({ force: true });
  //}
//}
async clickElement(locator: Locator) {
  if (this.page.isClosed()) {
    console.warn('Cannot click — page is already closed.');
    return;
  }

  try {
    await locator.click();
  } catch (err) {
    console.warn('Default click failed, retrying with force...');
    try {
      await locator.click({ force: true });
    } catch (innerErr) {
      console.error('Force click also failed:', innerErr);
    }
  }
}


  async fillInput(locator: Locator, text: string) {
    //await locator.clear();
    await locator.waitFor({state: 'visible', timeout: 10000});
    await locator.fill(text);
  }

  async selectOption(locator: Locator, option: string) {
    await locator.selectOption(option);
  }

  async waitForElement(locator: Locator, timeout: number = TIMEOUTS.MEDIUM) {
    await locator.waitFor({ timeout });
  }

  async isElementVisible(locator: Locator): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
      return true;
    } catch {
      return false;
    }
  }

  async scrollToElement(locator: Locator) {
    await TestHelpers.scrollToElement(this.page, locator);
  }

  async takeScreenshot(name: string) {
    await TestHelpers.takeScreenshot(this.page, name);
  }
}
