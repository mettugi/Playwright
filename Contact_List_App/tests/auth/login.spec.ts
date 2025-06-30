import { test, expect } from '../../fixtures/auth-fixture';
import { TestDataGenerator, staticTestData } from '../../utils/test-data';

test.describe('Login Tests', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigateToLogin();
  });

  test('should display login page correctly', async ({ loginPage }) => {
    await test.step('Verify login page elements are displayed', async () => {
      await loginPage.verifyLoginPageDisplayed();
      await loginPage.verifyWelcomeMessage();
      expect(await loginPage.getPageTitle()).toContain('Contact List');
    });
  });

  test('should login with valid credentials', async ({ loginPage, contactsPage }) => {
    // First create a user
    const userData = TestDataGenerator.generateUserData();
    const signupPage = await import('../../pages/signup-page');
    const signup = new signupPage.SignupPage(loginPage.page);
    
    await signup.navigateToSignup();
    await signup.signup(userData);
    
    // Now login with created user
    await loginPage.navigateToLogin();
    
    await test.step('Login with valid credentials', async () => {
      await loginPage.login(userData.email, userData.password);
    });

    await test.step('Verify successful login', async () => {
      await contactsPage.verifyContactsPageDisplayed();
      await contactsPage.verifyUrl('/contactList');
    });
  });

  test('should show error for invalid credentials', async ({ loginPage }) => {
    const invalidData = {
      email: 'invalid@email.com',
      password: 'wrongpassword'
    };

    await test.step('Attempt login with invalid credentials', async () => {
      await loginPage.login(invalidData.email, invalidData.password);
    });

    await test.step('Verify error message is displayed', async () => {
      expect(await loginPage.isErrorMessageDisplayed()).toBeTruthy();
      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage).toContain('Incorrect username or password');
    });
  });

  test('should show error for empty email', async ({ loginPage }) => {
    await test.step('Attempt login with empty email', async () => {
      await loginPage.login('', 'password123');
    });

    await test.step('Verify error handling', async () => {
      // Should either show error or prevent submission
      const isSubmitEnabled = await loginPage.isSubmitButtonEnabled();
      if (isSubmitEnabled) {
        expect(await loginPage.isErrorMessageDisplayed()).toBeTruthy();
      }
    });
  });

  test('should show error for empty password', async ({ loginPage }) => {
    await test.step('Attempt login with empty password', async () => {
      await loginPage.login('test@email.com', '');
    });

    await test.step('Verify error handling', async () => {
      const isSubmitEnabled = await loginPage.isSubmitButtonEnabled();
      if (isSubmitEnabled) {
        expect(await loginPage.isErrorMessageDisplayed()).toBeTruthy();
      }
    });
  });

  test('should navigate to signup page', async ({ loginPage, signupPage }) => {
    await test.step('Click signup link', async () => {
      await loginPage.clickSignupLink();
    });

    await test.step('Verify navigation to signup page', async () => {
      await signupPage.verifySignupPageDisplayed();
      await signupPage.verifyUrl('/addUser');
    });
  });

  test('should clear form fields', async ({ loginPage }) => {
    await test.step('Fill form with data', async () => {
      await loginPage.fillInput(loginPage.emailInput, 'test@email.com');
      await loginPage.fillInput(loginPage.passwordInput, 'password123');
    });

    await test.step('Clear form', async () => {
      await loginPage.clearForm();
    });

    await test.step('Verify fields are cleared', async () => {
      const emailValue = await loginPage.emailInput.inputValue();
      const passwordValue = await loginPage.passwordInput.inputValue();
      expect(emailValue).toBe('');
      expect(passwordValue).toBe('');
    });
  });

  test('should handle special characters in credentials', async ({ loginPage }) => {
    const specialData = {
      email: 'test+special@email.com',
      password: 'p@ssw0rd!123'
    };

    await test.step('Login with special characters', async () => {
      await loginPage.login(specialData.email, specialData.password);
    });

    await test.step('Verify error for non-existent user', async () => {
      expect(await loginPage.isErrorMessageDisplayed()).toBeTruthy();
    });
  });
});
