import { test, expect, Page } from '@playwright/test';

// Test data constants
const BASE_URL = 'https://www.saucedemo.com';
const VALID_PASSWORD = 'secret_sauce';

const USERS = {
  STANDARD: 'standard_user',
  LOCKED_OUT: 'locked_out_user',
  PROBLEM: 'problem_user',
  PERFORMANCE_GLITCH: 'performance_glitch_user',
  ERROR: 'error_user',
  VISUAL: 'visual_user'
};

// Page Object Model for Login Page
class LoginPage {
  constructor(private page: Page) {}

  // Selectors
  private usernameInput = '[data-test="username"]';
  private passwordInput = '[data-test="password"]';
  private loginButton = '[data-test="login-button"]';
  private errorMessage = '[data-test="error"]';
  private errorButton = '.error-button';

  // Actions
  async navigate() {
    await this.page.goto(BASE_URL);
  }

  async fillUsername(username: string) {
    await this.page.fill(this.usernameInput, username);
  }

  async fillPassword(password: string) {
    await this.page.fill(this.passwordInput, password);
  }

  async clickLogin() {
    await this.page.click(this.loginButton);
  }

  async login(username: string, password: string) {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLogin();
  }

  async getErrorMessage() {
    return await this.page.textContent(this.errorMessage);
  }

  async isErrorDisplayed() {
    return await this.page.isVisible(this.errorMessage);
  }

  async closeError() {
    await this.page.click(this.errorButton);
  }

  async clearForm() {
    await this.page.fill(this.usernameInput, '');
    await this.page.fill(this.passwordInput, '');
  }
}

// Page Object Model for Products Page (Dashboard after login)
class ProductsPage {
  constructor(private page: Page) {}

  private productsTitle = '.title';
  private inventoryContainer = '.inventory_container';
  private menuButton = '#react-burger-menu-btn';
  private logoutLink = '#logout_sidebar_link';

  async isProductsPageLoaded() {
    await expect(this.page.locator(this.productsTitle)).toContainText('Products');
    await expect(this.page.locator(this.inventoryContainer)).toBeVisible();
  }

  async logout() {
    await this.page.click(this.menuButton);
    await this.page.click(this.logoutLink);
  }

  async getCurrentUrl() {
    return this.page.url();
  }
}

test.describe('SauceDemo Login Scenarios', () => {
  let loginPage: LoginPage;
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    await loginPage.navigate();
  });

  test.describe('Successful Login Tests', () => {
    test('should login successfully with standard_user', async ({ page }) => {
      await loginPage.login(USERS.STANDARD, VALID_PASSWORD);
      await productsPage.isProductsPageLoaded();
      expect(page.url()).toContain('/inventory.html');
    });

    test('should login successfully with problem_user', async ({ page }) => {
      await loginPage.login(USERS.PROBLEM, VALID_PASSWORD);
      await productsPage.isProductsPageLoaded();
      expect(page.url()).toContain('/inventory.html');
    });

    test('should login successfully with performance_glitch_user', async ({ page }) => {
      // This user has performance issues, so we increase timeout
      test.setTimeout(30000);
      await loginPage.login(USERS.PERFORMANCE_GLITCH, VALID_PASSWORD);
      await productsPage.isProductsPageLoaded();
      expect(page.url()).toContain('/inventory.html');
    });

    test('should login successfully with error_user', async ({ page }) => {
      await loginPage.login(USERS.ERROR, VALID_PASSWORD);
      await productsPage.isProductsPageLoaded();
      expect(page.url()).toContain('/inventory.html');
    });

    test('should login successfully with visual_user', async ({ page }) => {
      await loginPage.login(USERS.VISUAL, VALID_PASSWORD);
      await productsPage.isProductsPageLoaded();
      expect(page.url()).toContain('/inventory.html');
    });
  });

  test.describe('Failed Login Tests', () => {
    test('should show error for locked_out_user', async ({ page }) => {
      await loginPage.login(USERS.LOCKED_OUT, VALID_PASSWORD);
      
      expect(await loginPage.isErrorDisplayed()).toBeTruthy();
      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage).toContain('Epic sadface: Sorry, this user has been locked out');
      
      // Verify user stays on login page
      expect(page.url()).toBe(BASE_URL + '/');
    });

    test('should show error for invalid username', async ({ page }) => {
      await loginPage.login('invalid_user', VALID_PASSWORD);
      
      expect(await loginPage.isErrorDisplayed()).toBeTruthy();
      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage).toContain('Epic sadface: Username and password do not match');
    });

    test('should show error for invalid password', async ({ page }) => {
      await loginPage.login(USERS.STANDARD, 'invalid_password');
      
      expect(await loginPage.isErrorDisplayed()).toBeTruthy();
      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage).toContain('Epic sadface: Username and password do not match');
    });

    test('should show error for empty username', async ({ page }) => {
      await loginPage.login('', VALID_PASSWORD);
      
      expect(await loginPage.isErrorDisplayed()).toBeTruthy();
      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage).toContain('Epic sadface: Username is required');
    });

    test('should show error for empty password', async ({ page }) => {
      await loginPage.login(USERS.STANDARD, '');
      
      expect(await loginPage.isErrorDisplayed()).toBeTruthy();
      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage).toContain('Epic sadface: Password is required');
    });

    test('should show error for both empty fields', async ({ page }) => {
      await loginPage.login('', '');
      
      expect(await loginPage.isErrorDisplayed()).toBeTruthy();
      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage).toContain('Epic sadface: Username is required');
    });
  });

  test.describe('UI Interaction Tests', () => {
    test('should close error message when X button is clicked', async ({ page }) => {
      await loginPage.login('invalid_user', VALID_PASSWORD);
      expect(await loginPage.isErrorDisplayed()).toBeTruthy();
      
      await loginPage.closeError();
      expect(await loginPage.isErrorDisplayed()).toBeFalsy();
    });

    test('should clear form fields after error', async ({ page }) => {
      await loginPage.login('invalid_user', VALID_PASSWORD);
      expect(await loginPage.isErrorDisplayed()).toBeTruthy();
      
      await loginPage.clearForm();
      await loginPage.login(USERS.STANDARD, VALID_PASSWORD);
      await productsPage.isProductsPageLoaded();
    });

    test('should handle Enter key for login submission', async ({ page }) => {
      await loginPage.fillUsername(USERS.STANDARD);
      await loginPage.fillPassword(VALID_PASSWORD);
      await page.keyboard.press('Enter');
      
      await productsPage.isProductsPageLoaded();
      expect(page.url()).toContain('/inventory.html');
    });
  });

  test.describe('Security and Edge Cases', () => {
    test('should not allow direct access to inventory without login', async ({ page }) => {
      await page.goto(BASE_URL + '/inventory.html');
      // Should redirect back to login
      expect(page.url()).toBe(BASE_URL + '/');
    });

    test('should handle SQL injection attempt', async ({ page }) => {
      await loginPage.login("admin'; DROP TABLE users; --", VALID_PASSWORD);
      expect(await loginPage.isErrorDisplayed()).toBeTruthy();
    });

    test('should handle XSS attempt in username', async ({ page }) => {
      await loginPage.login('<script>alert("xss")</script>', VALID_PASSWORD);
      expect(await loginPage.isErrorDisplayed()).toBeTruthy();
    });

    test('should handle very long username', async ({ page }) => {
      const longUsername = 'a'.repeat(1000);
      await loginPage.login(longUsername, VALID_PASSWORD);
      expect(await loginPage.isErrorDisplayed()).toBeTruthy();
    });
  });

  test.describe('Session Management', () => {
    test('should maintain session after page refresh', async ({ page }) => {
      await loginPage.login(USERS.STANDARD, VALID_PASSWORD);
      await productsPage.isProductsPageLoaded();
      
      await page.reload();
      await productsPage.isProductsPageLoaded();
      expect(page.url()).toContain('/inventory.html');
    });

    test('should logout successfully', async ({ page }) => {
      await loginPage.login(USERS.STANDARD, VALID_PASSWORD);
      await productsPage.isProductsPageLoaded();
      
      await productsPage.logout();
      expect(page.url()).toBe(BASE_URL + '/');
    });
  });

  test.describe('Performance Tests', () => {
    test('should load login page within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      await loginPage.navigate();
      const loadTime = Date.now() - startTime;
      
      expect(loadTime).toBeLessThan(5000); // 5 seconds max
    });

    test('should complete standard login within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      await loginPage.login(USERS.STANDARD, VALID_PASSWORD);
      await productsPage.isProductsPageLoaded();
      const loginTime = Date.now() - startTime;
      
      expect(loginTime).toBeLessThan(10000); // 10 seconds max
    });
  });

  test.describe('Data-Driven Tests', () => {
    const validUsers = [
      USERS.STANDARD,
      USERS.PROBLEM,
      USERS.ERROR,
      USERS.VISUAL
    ];

    validUsers.forEach(username => {
      test(`should login successfully with ${username}`, async ({ page }) => {
        await loginPage.login(username, VALID_PASSWORD);
        await productsPage.isProductsPageLoaded();
        expect(page.url()).toContain('/inventory.html');
      });
    });

    const invalidCredentials = [
      { username: 'invalid_user', password: VALID_PASSWORD, expectedError: 'Username and password do not match' },
      { username: USERS.STANDARD, password: 'wrong_password', expectedError: 'Username and password do not match' },
      { username: '', password: VALID_PASSWORD, expectedError: 'Username is required' },
      { username: USERS.STANDARD, password: '', expectedError: 'Password is required' }
    ];

    invalidCredentials.forEach(({ username, password, expectedError }) => {
      test(`should show error for ${username || 'empty username'} with ${password || 'empty password'}`, async ({ page }) => {
        await loginPage.login(username, password);
        expect(await loginPage.isErrorDisplayed()).toBeTruthy();
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toContain(expectedError);
      });
    });
  });
});

// Additional helper functions for more advanced testing
export class TestHelpers {
  static async takeScreenshotOnFailure(page: Page, testName: string) {
    await page.screenshot({ 
      path: `screenshots/failed-${testName}-${Date.now()}.png`,
      fullPage: true 
    });
  }

  static async logNetworkActivity(page: Page) {
    page.on('request', request => 
      console.log(`Request: ${request.method()} ${request.url()}`)
    );
    page.on('response', response => 
      console.log(`Response: ${response.status()} ${response.url()}`)
    );
  }

  static async waitForNetworkIdle(page: Page, timeout = 5000) {
    await page.waitForLoadState('networkidle', { timeout });
  }
}
