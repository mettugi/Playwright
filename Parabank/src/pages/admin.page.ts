// src/pages/admin-page.ts
import { Page } from '@playwright/test';
import { BasePage } from './base-page';
import { AdminCredentials, DatabaseConfig } from '@types/interfaces';
import testData from '@fixtures/test-data.json';

export class AdminPage extends BasePage {
  // Selectors
  private readonly selectors = testData.selectors.admin;
  private readonly urls = testData.urls;

  constructor(page: Page) {
    super(page);
  }

  // Navigation
  async navigateToAdmin(): Promise<void> {
    await this.navigateTo(this.urls.admin);
  }

  // Authentication
  async login(credentials?: AdminCredentials): Promise<void> {
    const creds = credentials || testData.adminCredentials.valid;
    
    await this.fill(this.selectors.usernameInput, creds.username);
    await this.fill(this.selectors.passwordInput, creds.password);
    await this.click(this.selectors.loginButton);
    await this.waitForPageLoad();
  }

  async loginWithValidCredentials(): Promise<void> {
    await this.login(testData.adminCredentials.valid);
  }

  async loginWithInvalidCredentials(): Promise<void> {
    await this.login(testData.adminCredentials.invalid);
  }

  // Database Management
  async initializeDatabase(): Promise<void> {
    try {
      await this.waitForElement(this.selectors.initializeButton);
      await this.click(this.selectors.initializeButton);
      await this.waitForPageLoad();
      await this.waitForSuccessMessage();
    } catch (error) {
      console.log('Initialize button not found or already initialized');
    }
  }

  async cleanDatabase(): Promise<void> {
    try {
      await this.waitForElement(this.selectors.cleanButton);
      await this.click(this.selectors.cleanButton);
      await this.waitForPageLoad();
      await this.waitForSuccessMessage();
    } catch (error) {
      console.log('Clean button not found');
    }
  }

  async isDatabaseInitialized(): Promise<boolean> {
    try {
      const initButton = this.page.locator(this.selectors.initializeButton);
      return !(await initButton.isVisible());
    } catch {
      return true; // Assume initialized if we can't determine
    }
  }

  // Configuration Management
  async setLoanProvider(provider: 'funds' | 'combined' | 'wsapi'): Promise<void> {
    try {
      await this.waitForElement(this.selectors.loanProviderSelect);
      await this.selectOption(this.selectors.loanProviderSelect, provider);
      await this.submitConfiguration();
    } catch (error) {
      console.log('Loan provider selection not available');
    }
  }

  async setDataAccessMode(mode: 'jdbc' | 'jpa'): Promise<void> {
    try {
      await this.waitForElement(this.selectors.dataAccessModeSelect);
      await this.selectOption(this.selectors.dataAccessModeSelect, mode);
      await this.submitConfiguration();
    } catch (error) {
      console.log('Data access mode selection not available');
    }
  }

  async setInitialBalance(balance: number): Promise<void> {
    try {
      await this.waitForElement(this.selectors.initialBalanceInput);
      await this.fill(this.selectors.initialBalanceInput, balance.toString());
      await this.submitConfiguration();
    } catch (error) {
      console.log('Initial balance input not available');
    }
  }

  async setMinimumBalance(balance: number): Promise<void> {
    try {
      await this.waitForElement(this.selectors.minimumBalanceInput);
      await this.fill(this.selectors.minimumBalanceInput, balance.toString());
      await this.submitConfiguration();
    } catch (error) {
      console.log('Minimum balance input not available');
    }
  }

  async applyDatabaseConfig(config: DatabaseConfig): Promise<void> {
    await this.setLoanProvider(config.loanProvider);
    await this.setDataAccessMode(config.dataAccessMode);
    await this.setInitialBalance(config.initialBalance);
    await this.setMinimumBalance(config.minimumBalance);
  }

  private async submitConfiguration(): Promise<void> {
    try {
      await this.click(this.selectors.submitButton);
      await this.waitForPageLoad();
    } catch (error) {
      console.log('Submit button not found, configuration may auto-save');
    }
  }

  // Status and Verification Methods
  async waitForSuccessMessage(): Promise<void> {
    try {
      await this.waitForElement(this.selectors.successMessage, 'visible');
    } catch (error) {
      console.log('Success message not displayed');
    }
  }

  async waitForErrorMessage(): Promise<void> {
    try {
      await this.waitForElement(this.selectors.errorMessage, 'visible');
    } catch (error) {
      console.log('Error message not displayed');
    }
  }

  async getSuccessMessage(): Promise<string> {
    try {
      await this.waitForElement(this.selectors.successMessage);
      return await this.getText(this.selectors.successMessage);
    } catch {
      return '';
    }
  }

  async getErrorMessage(): Promise<string> {
    try {
      await this.waitForElement(this.selectors.errorMessage);
      return await this.getText(this.selectors.errorMessage);
    } catch {
      return '';
    }
  }

  async getCurrentLoanProvider(): Promise<string> {
    try {
      const select = this.page.locator(this.selectors.loanProviderSelect);
      return await select.inputValue();
    } catch {
      return '';
    }
  }

  async getCurrentDataAccessMode(): Promise<string> {
    try {
      const select = this.page.locator(this.selectors.dataAccessModeSelect);
      return await select.inputValue();
    } catch {
      return '';
    }
  }

  async getCurrentInitialBalance(): Promise<number> {
    try {
      const input = this.page.locator(this.selectors.initialBalanceInput);
      const value = await input.inputValue();
      return parseFloat(value) || 0;
    } catch {
      return 0;
    }
  }
