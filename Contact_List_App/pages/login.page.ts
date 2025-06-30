import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';

export class LoginPage extends BasePage {
  // Locators
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly signupLink: Locator;
  readonly errorMessage: Locator;
  readonly welcomeMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.submitButton = page.locator('#submit');
    this.signupLink = page.locator('#signup');
    this.errorMessage = page.locator('#error');
    this.welcomeMessage = page.locator('text=Welcome!');
  }

  /**
   * Navigate to login page
   */
  async navigateToLogin(): Promise<void> {
    await this.navigateTo('/');
    await this.waitForPageLoad();
  }

  /**
   * Perform login with credentials
   */
  async login(email: string, password: string): Promise<void> {
    await this.fillInput(this.emailInput, email);
    await this.fillInput(this.passwordInput, password);
    await this.clickElement(this.submitButton);
  }

  /**
   * Click on signup link
   */
  async clickSignupLink(): Promise<void> {
    await this.clickElement(this.signupLink);
  }

  /**
   * Verify login page is displayed
   */
  async verifyLoginPageDisplayed(): Promise<void> {
    await this.waitForElement(this.emailInput);
    await this.waitForElement(this.passwordInput);
    await this.waitForElement(this.submitButton);
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    return await this.getTextContent(this.errorMessage);
  }

  /**
   * Check if error message is displayed
   */
  async isErrorMessageDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.errorMessage);
  }

  /**
   * Verify welcome message is displayed
   */
  async verifyWelcomeMessage(): Promise<void> {
    await this.waitForElement(this.welcomeMessage);
  }

  /**
   * Clear login form
   */
  async clearForm(): Promise<void> {
    await this.emailInput.clear();
    await this.passwordInput.clear();
  }

  /**
   * Check if submit button is enabled
   */
  async isSubmitButtonEnabled(): Promise<boolean> {
    return await this.submitButton.isEnabled();
  }
}
