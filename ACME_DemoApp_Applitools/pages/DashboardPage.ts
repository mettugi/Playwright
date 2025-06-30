import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  // Selectors
  private readonly selectors = {
    mainContent: '.main-content',
    welcomeMessage: 'h1, h2',
    userProfile: '.user-profile',
    navigationMenu: '.nav-menu',
    logoutButton: 'button[id="log-out"]',
    accountSummary: '.account-summary',
    transactionHistory: '.transaction-history',
    balanceAmount: '.balance-amount',
    menuItems: {
      dashboard: 'a[href*="dashboard"]',
      accounts: 'a[href*="accounts"]',
      statements: 'a[href*="statements"]',
      profile: 'a[href*="profile"]'
    }
  };

  constructor(page: Page) {
    super(page);
  }

  // Actions
  async waitForDashboard(): Promise<void> {
    await this.waitForSelector(this.selectors.mainContent);
  }

  async logout(): Promise<void> {
    if (await this.isElementVisible(this.selectors.logoutButton)) {
      await this.clickElement(this.selectors.logoutButton);
    }
  }

  async navigateToSection(section: keyof typeof this.selectors.menuItems): Promise<void> {
    await this.clickElement(this.selectors.menuItems[section]);
  }

  // Getters
  async getWelcomeMessage(): Promise<string> {
    return await this.getText(this.selectors.welcomeMessage);
  }

  async getBalanceAmount(): Promise<string> {
    return await this.getText(this.selectors.balanceAmount);
  }

  // Validations
  async isDashboardLoaded(): Promise<boolean> {
    return await this.isElementVisible(this.selectors.mainContent);
  }

  async validateDashboardElements(): Promise<void> {
    await expect(this.page.locator(this.selectors.mainContent)).toBeVisible();
  }
}
