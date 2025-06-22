import { Locator, Page } from '@playwright/test';

export class ForgotPasswordPage {
  private readonly page: Page;
  readonly passwordInput: Locator;
  readonly retrievePasswordButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.passwordInput = page.locator('#email');
    this.retrievePasswordButton = page.getByRole('button', { name: 'Retrieve password' });
  }

  async resetPassword(email: string) {
    await this.passwordInput.fill(email);
    await this.retrievePasswordButton.click();
  }
}
