import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';

export class SignupPage extends BasePage {
  // Locators
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('#firstName');
    this.lastNameInput = page.locator('#lastName');
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.submitButton = page.locator('#submit');
    this.cancelButton = page.locator('#cancel');
    this.errorMessage = page.locator('#error');
    this.successMessage = page.locator('.success-message');
  }

  /**
   * Navigate to signup page
   */
  async navigateToSignup(): Promise<void> {
    await this.navigateTo('/addUser');
    await this.waitForPageLoad();
  }

  /**
   * Fill signup form with user data
   */
  async fillSignupForm(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<void> {
    await this.fillInput(this.firstNameInput, userData.firstName);
    await this.fillInput(this.lastNameInput, userData.lastName);
    await this.fillInput(this.emailInput, userData.email);
    await this.fillInput(this.passwordInput, userData.password);
  }

  /**
   * Submit signup form
   */
  async submitForm(): Promise<void> {
    await this.clickElement(this.submitButton);
  }

  /**
   * Cancel signup process
   */
  async cancelSignup(): Promise<void> {
    await this.clickElement(this.cancelButton);
  }

  /**
   * Complete signup process
   */
  async signup(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<void> {
    await this.fillSignupForm(userData);
    await this.submitForm();
  }

  /**
   * Verify signup page is displayed
   */
  async verifySignupPageDisplayed(): Promise<void> {
    await this.waitForElement(this.firstNameInput);
    await this.waitForElement(this.lastNameInput);
    await this.waitForElement(this.emailInput);
    await this.waitForElement(this.passwordInput);
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
   * Get success message text
   */
  async getSuccessMessage(): Promise<string> {
    return await this.getTextContent(this.successMessage);
  }

  /**
   * Check if success message is displayed
   */
  async isSuccessMessageDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.successMessage);
  }

  /**
   * Clear signup form
   */
  async clearForm(): Promise<void> {
    await this.firstNameInput.clear();
    await this.lastNameInput.clear();
    await this.emailInput.clear();
    await this.passwordInput.clear();
  }

  /**
   * Verify all required fields are present
   */
  async verifyRequiredFields(): Promise<void> {
    await this.waitForElement(this.firstNameInput);
    await this.waitForElement(this.lastNameInput);
    await this.waitForElement(this.emailInput);
    await this.waitForElement(this.passwordInput);
    await this.waitForElement(this.submitButton);
  }
}
