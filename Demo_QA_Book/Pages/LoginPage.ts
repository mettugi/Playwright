import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('https://demoqa.com/login');
  }

  async login(username: string, password: string) {
    await this.page.fill('#userName', 'testuser');
    await this.page.fill('#password', 'Test@123');
    await this.page.click('#login');
  }
}
