import { test, expect } from '../fixtures/testFixtures';
import { TEST_DATA, LOGIN_TEST_CASES } from '../utils/TestData';

test.describe('Login Page Tests', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigateToLogin();
  });

  test('LP001: Verify login page elements', async ({ loginPage }) => {
    await loginPage.validateLoginPageElements();
    
    const title = await loginPage.getAppTitle();
    expect(title).toContain('Login Form');
    
    expect(await loginPage.isLoginFormVisible()).toBeTruthy();
    expect(await loginPage.isLoginButtonEnabled()).toBeTruthy();
  });

  test('LP002: Successful login with valid credentials', async ({ loginPage, dashboardPage }) => {
    await loginPage.login(TEST_DATA.valid.username, TEST_DATA.valid.password);
    
    await dashboardPage.waitForDashboard();
    expect(await dashboardPage.isDashboardLoaded()).toBeTruthy();
  });

  test('LP003: Login with Enter key', async ({ loginPage, dashboardPage }) => {
    await loginPage.loginWithEnterKey(TEST_DATA.valid.username, TEST_DATA.valid.password);
    
    await dashboardPage.waitForDashboard();
    expect(await dashboardPage.isDashboardLoaded()).toBeTruthy();
  });

  test('LP004: Remember Me functionality', async ({ loginPage }) => {
    expect(await loginPage.isRememberMeChecked()).toBeFalsy();
    
    await loginPage.toggleRememberMe();
    expect(await loginPage.isRememberMeChecked()).toBeTruthy();
    
    await loginPage.toggleRememberMe();
    expect(await loginPage.isRememberMeChecked()).toBeFalsy();
  });

  // Data-driven login tests
  LOGIN_TEST_CASES.forEach(({ name, credentials, expectedResult }) => {
    test(`LP005: ${name}`, async ({ loginPage, dashboardPage }) => {
      await loginPage.login(credentials.username, credentials.password);
      
      if (expectedResult === 'success') {
        await dashboardPage.waitForDashboard();
        expect(await dashboardPage.isDashboardLoaded()).toBeTruthy();
      } else {
        // For invalid credentials, we might stay on login page or see error
        const alertMessage = await loginPage.getAlertMessage();
        // Add specific validation based on actual behavior
      }
    });
  });

  test('LP006: Social media icons clickability', async ({ loginPage, page }) => {
    const socialPlatforms = ['twitter', 'facebook', 'linkedin'] as const;
    
    for (const platform of socialPlatforms) {
      // Note: This might open new tabs/windows in real implementation
      await loginPage.clickSocialIcon(platform);
      // Add appropriate validations based on actual behavior
    }
  });

  test('LP007: Form field validation', async ({ loginPage }) => {
    // Test empty form submission
    await loginPage.login('', '');
    
    // Verify form doesn't submit or shows validation
    expect(await loginPage.areFieldsEmpty()).toBeTruthy();
  });
});
