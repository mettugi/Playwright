import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { User } from '../types';

export class LoginPage extends BasePage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('#user-name');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login-button');
    this.errorMessage = page.locator('.error-message-container');
  }

  async login(user: User): Promise<void> {
    await this.goto();
    await this.usernameInput.fill(user.username);
    await this.passwordInput.fill(user.password);
    await this.loginButton.click();
  }

  async verifyLoginError(): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
  }

  async isLoginPageVisible(): Promise<boolean> {
    return await this.loginButton.isVisible();
  }
}
