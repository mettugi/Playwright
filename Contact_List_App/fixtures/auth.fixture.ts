import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { SignupPage } from '../pages/signup-page';
import { ContactsPage } from '../pages/contacts-page';
import { TestDataGenerator } from '../utils/test-data';

export interface AuthFixtures {
  loginPage: LoginPage;
  signupPage: SignupPage;
  contactsPage: ContactsPage;
  authenticatedUser: { email: string; password: string };
  loginAsUser: (email?: string, password?: string) => Promise<void>;
  createAndLoginUser: () => Promise<{ email: string; password: string }>;
}

export const test = base.extend<AuthFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  signupPage: async ({ page }, use) => {
    const signupPage = new SignupPage(page);
    await use(signupPage);
  },

  contactsPage: async ({ page }, use) => {
    const contactsPage = new ContactsPage(page);
    await use(contactsPage);
  },

  authenticatedUser: async ({ page }, use) => {
    // Generate test user data
    const userData = TestDataGenerator.generateUserData();
    
    // Create user account
    const signupPage = new SignupPage(page);
    await signupPage.navigateToSignup();
    await signupPage.signup(userData);
    
    // Login with created user
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLogin();
    await loginPage.login(userData.email, userData.password);
    
    await use({ email: userData.email, password: userData.password });
  },

  loginAsUser: async ({ page }, use) => {
    const loginAsUser = async (email?: string, password?: string) => {
      const loginPage = new LoginPage(page);
      await loginPage.navigateToLogin();
      
      if (email && password) {
        await loginPage.login(email, password);
      } else {
        // Use default test user
        const userData = TestDataGenerator.generateUserData();
        await loginPage.login(userData.email, userData.password);
      }
    };
    
    await use(loginAsUser);
  },

  createAndLoginUser: async ({ page }, use) => {
    const createAndLoginUser = async () => {
      // Generate user data
      const userData = TestDataGenerator.generateUserData();
      
      // Create account
      const signupPage = new SignupPage(page);
      await signupPage.navigateToSignup();
      await signupPage.signup(userData);
      
      // Login
      const loginPage = new LoginPage(page);
      await loginPage.navigateToLogin();
      await loginPage.login(userData.email, userData.password);
      
      return { email: userData.email, password: userData.password };
    };
    
    await use(createAndLoginUser);
  }
});

export { expect } from '@playwright/test';
