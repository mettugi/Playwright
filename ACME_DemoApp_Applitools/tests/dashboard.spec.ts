import { test, expect } from '../fixtures/testFixtures';
import { TEST_DATA } from '../utils/TestData';

test.describe('Dashboard Tests', () => {
  test.beforeEach(async ({ loginPage, dashboardPage }) => {
    await loginPage.navigateToLogin();
    await loginPage.login(TEST_DATA.valid.username, TEST_DATA.valid.password);
    await dashboardPage.waitForDashboard();
  });

  test('DB001: Verify dashboard loads correctly', async ({ dashboardPage }) => {
    await dashboardPage.validateDashboardElements();
    expect(await dashboardPage.isDashboardLoaded()).toBeTruthy();
  });

  test('DB002: Verify logout functionality', async ({ dashboardPage, loginPage }) => {
    await dashboardPage.logout();
    
    // Should redirect to login page
    await loginPage.waitForPageLoad();
    expect(await loginPage.isLoginFormVisible()).toBeTruthy();
  });

  test('DB003: Navigation menu functionality', async ({ dashboardPage }) => {
    const menuItems = ['dashboard', 'accounts', 'statements', 'profile'] as const;
    
    for (const item of menuItems) {
      await dashboardPage.navigateToSection(item);
      // Add appropriate validations based on actual navigation behavior
    }
  });
