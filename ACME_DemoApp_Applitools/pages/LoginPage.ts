import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { CONSTANTS } from '../utils/Constants';

export class LoginPage extends BasePage {
  // Selectors
  private readonly selectors = {
    usernameInput: 'input[id="username"]',
    passwordInput: 'input[id="password"]',
    loginButton: 'input[id="log-in"]',
    signInButton: 'button[id="log-in"]',
    rememberMeCheckbox: 'input[name="remember-me"]',
    logo: '.logo-w img',
    appTitle: 'h4',
    formContainer: '.form-container',
    alertMessage: '.alert',
    socialIcons: {
      twitter: 'img[src*="twitter"]',
      facebook: 'img[src*="facebook"]',
      linkedin: 'img[src*="linkedin"]'
    },
    forgotPasswordLink: 'a[href*="forgot"]',
    createAccountLink: 'a[href*="register"]'
  };

  constructor(page: Page) {
    super(page);
  }

  // Actions
  async navigateToLogin(): Promise<void> {
    await this.navigateTo();
    await this.waitForPageLoad();
  }

  async waitForPageLoad(): Promise<void> {
    await this.waitForSelector(this.selectors.formContainer);
    await this.waitForSelector(this.selectors.usernameInput);
    await this.waitForSelector(this.selectors.passwordInput);
    await this.waitForSelector(this.selectors.loginButton);
  }

  async login(username: string, password: string): Promise<void> {
    await this.fillInput(this.selectors.usernameInput, username);
    await this.fillInput(this.selectors.passwordInput, password);
    await this.clickElement(this.selectors.loginButton);
  }

  async loginWithEnterKey(username: string, password: string): Promise<void> {
    await this.fillInput(this.selectors.usernameInput, username);
    await this.fillInput(this.selectors.passwordInput, password);
    await this.page.press(this.selectors.passwordInput, 'Enter');
  }

  async toggleRememberMe(): Promise<void> {
    await this.clickElement(this.selectors.rememberMeCheckbox);
  }

  async isRememberMeChecked(): Promise<boolean> {
    return await this.page.isChecked(this.selectors.rememberMeCheckbox);
  }

  async clickSocialIcon(platform: keyof typeof this.selectors.socialIcons): Promise<void> {
    await this.clickElement(this.selectors.socialIcons[platform]);
  }

  // Getters
  async getAppTitle(): Promise<string> {
    return await this.getText(this.selectors.appTitle);
  }

  async getAlertMessage(): Promise<string> {
    try {
      return await this.getText(this.selectors.alertMessage);
    } catch {
      return '';
    }
  }

  async getUsernameValue(): Promise<string> {
    return await this.page.inputValue(this.selectors.usernameInput);
  }

  async getPasswordValue(): Promise<string> {
    return await this.page.inputValue(this.selectors.passwordInput);
  }

  // Validations
  async isLoginFormVisible(): Promise<boolean> {
    return await this.isElementVisible(this.selectors.formContainer);
  }

  async isLoginButtonEnabled(): Promise<boolean> {
    return await this.page.isEnabled(this.selectors.loginButton);
  }

  async areFieldsEmpty(): Promise<boolean> {
    const username = await this.getUsernameValue();
    const password = await this.getPasswordValue();
    return username === '' && password === '';
  }

  async validateLoginPageElements(): Promise<void> {
    await expect(this.page.locator(this.selectors.logo)).toBeVisible();
    await expect(this.page.locator(this.selectors.usernameInput)).toBeVisible();
    await expect(this.page.locator(this.selectors.passwordInput)).toBeVisible();
    await expect(this.page.locator(this.selectors.loginButton)).toBeVisible();
    await expect(this.page.locator(this.selectors.rememberMeCheckbox)).toBeVisible();
  }
}
