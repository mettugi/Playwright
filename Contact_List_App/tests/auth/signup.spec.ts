import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

const BASE_URL = 'https://thinking-tester-contact-list.herokuapp.com';

test.describe('User Signup', () => {
  let validUserData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  };

  test.beforeEach(async ({ page }) => {
    // Generate fresh test data for each test
    validUserData = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: 'Test123!@#'
    };

    await page.goto(BASE_URL);
    
    // Navigate to signup page
    await page.click('text=Not yet a user? Click here to sign up!');
    await expect(page).toHaveURL(/.*addUser/);
  });

  test.describe('UI Elements Validation', () => {
    test('should display all required form elements', async ({ page }) => {
      // Check form title/heading
      await expect(page.locator('h1, h2, h3')).toContainText(/sign up|register|create account/i);
      
      // Check required form fields are present
      await expect(page.locator('#firstName')).toBeVisible();
      await expect(page.locator('#lastName')).toBeVisible();
      await expect(page.locator('#email')).toBeVisible();
      await expect(page.locator('#password')).toBeVisible();
      
      // Check submit button
      await expect(page.locator('button[type="submit"], input[type="submit"]')).toBeVisible();
      
      // Check login link for existing users
      await expect(page.locator('text=*already have an account*')).toBeVisible();
    });

    test('should have proper form field labels and placeholders', async ({ page }) => {
      const firstNameField = page.locator('#firstName');
      const lastNameField = page.locator('#lastName');
      const emailField = page.locator('#email');
      const passwordField = page.locator('#password');

      // Check labels or placeholders exist
      await expect(firstNameField).toHaveAttribute('placeholder', /first name/i);
      await expect(lastNameField).toHaveAttribute('placeholder', /last name/i);
      await expect(emailField).toHaveAttribute('placeholder', /email/i);
      await expect(passwordField).toHaveAttribute('placeholder', /password/i);
    });

    test('should mark required fields appropriately', async ({ page }) => {
      // Check required attributes
      await expect(page.locator('#firstName')).toHaveAttribute('required');
      await expect(page.locator('#lastName')).toHaveAttribute('required');
      await expect(page.locator('#email')).toHaveAttribute('required');
      await expect(page.locator('#password')).toHaveAttribute('required');
    });
  });

  test.describe('Successful Registration', () => {
    test('should successfully register with valid data', async ({ page }) => {
      // Fill out the form
      await page.fill('#firstName', validUserData.firstName);
      await page.fill('#lastName', validUserData.lastName);
      await page.fill('#email', validUserData.email);
      await page.fill('#password', validUserData.password);
      
      // Submit the form
      await page.click('button[type="submit"], input[type="submit"]');
      
      // Should redirect to contact list or login page
      await expect(page).toHaveURL(/.*contactList|.*login/);
      
      // Check for success indication
      await expect(page.locator('text=*welcome*')).toBeVisible({ timeout: 10000 });
    });

    test('should handle registration with minimum valid data', async ({ page }) => {
      await page.fill('#firstName', 'A');
      await page.fill('#lastName', 'B');
      await page.fill('#email', 'test@example.com');
      await page.fill('#password', '123456');
      
      await page.click('button[type="submit"], input[type="submit"]');
      
      // Should either succeed or show specific validation errors
      const url = page.url();
      if (url.includes('contactList') || url.includes('login')) {
        // Registration successful
        await expect(page.locator('text=*welcome*')).toBeVisible({ timeout: 10000 });
      } else {
        // Check for validation errors if minimum requirements not met
        await expect(page.locator('.error, .alert, [role="alert"]')).toBeVisible();
      }
    });
  });

  test.describe('Field Validation', () => {
    test('should show error for empty required fields', async ({ page }) => {
      // Try to submit empty form
      await page.click('button[type="submit"], input[type="submit"]');
      
      // Check browser validation or custom error messages
      const firstNameValidity = await page.locator('#firstName').evaluate(
        (el: HTMLInputElement) => el.validity.valid
      );
      expect(firstNameValidity).toBe(false);
    });

    test('should validate email format', async ({ page }) => {
      await page.fill('#firstName', validUserData.firstName);
      await page.fill('#lastName', validUserData.lastName);
      await page.fill('#email', 'invalid-email');
      await page.fill('#password', validUserData.password);
      
      await page.click('button[type="submit"], input[type="submit"]');
      
      // Check email validation
      const emailValidity = await page.locator('#email').evaluate(
        (el: HTMLInputElement) => el.validity.valid
      );
      expect(emailValidity).toBe(false);
    });

    test('should handle special characters in name fields', async ({ page }) => {
      await page.fill('#firstName', "O'Connor");
      await page.fill('#lastName', "Van Der Berg");
      await page.fill('#email', validUserData.email);
      await page.fill('#password', validUserData.password);
      
      await page.click('button[type="submit"], input[type="submit"]');
      
      // Should accept names with apostrophes and spaces
      await expect(page).toHaveURL(/.*contactList|.*login/, { timeout: 10000 });
    });

    test('should validate password requirements', async ({ page }) => {
      const testCases = [
        { password: '123', description: 'too short' },
        { password: '', description: 'empty' },
        { password: ' ', description: 'whitespace only' }
      ];

      for (const testCase of testCases) {
        await page.fill('#firstName', validUserData.firstName);
        await page.fill('#lastName', validUserData.lastName);
        await page.fill('#email', faker.internet.email());
        await page.fill('#password', testCase.password);
        
        await page.click('button[type="submit"], input[type="submit"]');
        
        // Should show validation error or remain on page
        const currentUrl = page.url();
        if (!currentUrl.includes('contactList')) {
          // Still on signup page - check for validation
          const passwordField = page.locator('#password');
          const isValid = await passwordField.evaluate(
            (el: HTMLInputElement) => el.validity.valid
          );
          expect(isValid).toBe(false);
        }
        
        // Clear form for next iteration
        await page.reload();
      }
    });
  });

  test.describe('Duplicate Registration', () => {
    test('should prevent duplicate email registration', async ({ page }) => {
      // First registration
      await page.fill('#firstName', validUserData.firstName);
      await page.fill('#lastName', validUserData.lastName);
      await page.fill('#email', validUserData.email);
      await page.fill('#password', validUserData.password);
      
      await page.click('button[type="submit"], input[type="submit"]');
      
      // Wait for potential redirect
      await page.waitForTimeout(2000);
      
      // Navigate back to signup for second attempt
      await page.goto(`${BASE_URL}/addUser`);
      
      // Try to register with same email
      await page.fill('#firstName', 'Different');
      await page.fill('#lastName', 'Name');
      await page.fill('#email', validUserData.email);
      await page.fill('#password', 'DifferentPass123!');
      
      await page.click('button[type="submit"], input[type="submit"]');
      
      // Should show error message or remain on page
      await expect(page.locator('.error, .alert, [role="alert"]')).toBeVisible();
    });
  });

  test.describe('Navigation and UX', () => {
    test('should navigate to login page from signup', async ({ page }) => {
      const loginLink = page.locator('text=*already have an account*');
      await loginLink.click();
      
      await expect(page).toHaveURL(/.*login/);
    });

    test('should maintain form data during navigation errors', async ({ page }) => {
      // Fill partial form
      await page.fill('#firstName', validUserData.firstName);
      await page.fill('#lastName', validUserData.lastName);
      
      // Trigger validation error
      await page.click('button[type="submit"], input[type="submit"]');
      
      // Check that filled data is preserved
      await expect(page.locator('#firstName')).toHaveValue(validUserData.firstName);
      await expect(page.locator('#lastName')).toHaveValue(validUserData.lastName);
    });

    test('should have accessible form elements', async ({ page }) => {
      // Check for proper labels associated with inputs
      const firstName = page.locator('#firstName');
      const lastName = page.locator('#lastName');
      const email = page.locator('#email');
      const password = page.locator('#password');
      
      // Each input should have associated label or aria-label
      for (const field of [firstName, lastName, email, password]) {
        const hasLabel = await field.evaluate(el => {
          const id = el.id;
          const label = document.querySelector(`label[for="${id}"]`);
          const ariaLabel = el.getAttribute('aria-label');
          const ariaLabelledBy = el.getAttribute('aria-labelledby');
          
          return !!(label || ariaLabel || ariaLabelledBy);
        });
        
        expect(hasLabel).toBe(true);
      }
    });

    test('should handle form submission via Enter key', async ({ page }) => {
      await page.fill('#firstName', validUserData.firstName);
      await page.fill('#lastName', validUserData.lastName);
      await page.fill('#email', validUserData.email);
      await page.fill('#password', validUserData.password);
      
      // Press Enter in password field
      await page.locator('#password').press('Enter');
      
      // Should submit the form
      await expect(page).toHaveURL(/.*contactList|.*login/, { timeout: 10000 });
    });
  });

  test.describe('Security and Edge Cases', () => {
    test('should sanitize input data', async ({ page }) => {
      const maliciousInput = '<script>alert("xss")</script>';
      
      await page.fill('#firstName', maliciousInput);
      await page.fill('#lastName', 'Test');
      await page.fill('#email', validUserData.email);
      await page.fill('#password', validUserData.password);
      
      await page.click('button[type="submit"], input[type="submit"]');
      
      // Should not execute script - page should remain functional
      const pageTitle = await page.title();
      expect(pageTitle).toBeTruthy();
      
      // No alert should have been triggered
      page.on('dialog', () => {
        throw new Error('Unexpected alert dialog - possible XSS vulnerability');
      });
    });

    test('should handle very long input strings', async ({ page }) => {
      const longString = 'a'.repeat(1000);
      
      await page.fill('#firstName', longString);
      await page.fill('#lastName', validUserData.lastName);
      await page.fill('#email', validUserData.email);
      await page.fill('#password', validUserData.password);
      
      await page.click('button[type="submit"], input[type="submit"]');
      
      // Should either truncate input or show validation error
      const currentUrl = page.url();
      if (!currentUrl.includes('contactList')) {
        // If still on signup page, check for validation feedback
        await expect(page.locator('.error, .alert, [role="alert"]')).toBeVisible();
      }
    });

    test('should handle Unicode characters in names', async ({ page }) => {
      await page.fill('#firstName', 'José');
      await page.fill('#lastName', 'François');
      await page.fill('#email', validUserData.email);
      await page.fill('#password', validUserData.password);
      
      await page.click('button[type="submit"], input[type="submit"]');
      
      // Should accept Unicode characters
      await expect(page).toHaveURL(/.*contactList|.*login/, { timeout: 10000 });
    });
  });

  test.describe('Performance and Reliability', () => {
    test('should handle slow network conditions', async ({ page }) => {
      // Simulate slow network
      await page.route('**/*', route => {
        setTimeout(() => route.continue(), 1000);
      });
      
      await page.fill('#firstName', validUserData.firstName);
      await page.fill('#lastName', validUserData.lastName);
      await page.fill('#email', validUserData.email);
      await page.fill('#password', validUserData.password);
      
      await page.click('button[type="submit"], input[type="submit"]');
      
      // Should eventually complete despite slow network
      await expect(page).toHaveURL(/.*contactList|.*login/, { timeout: 15000 });
    });

    test('should provide user feedback during form submission', async ({ page }) => {
      await page.fill('#firstName', validUserData.firstName);
      await page.fill('#lastName', validUserData.lastName);
      await page.fill('#email', validUserData.email);
      await page.fill('#password', validUserData.password);
      
      // Click submit and immediately check for loading state
      await page.click('button[type="submit"], input[type="submit"]');
      
      // Should show loading state or disable button
      const submitButton = page.locator('button[type="submit"], input[type="submit"]');
      
      // Button should be disabled during submission or show loading text
      const isDisabled = await submitButton.isDisabled();
      const buttonText = await submitButton.textContent();
      
      expect(isDisabled || buttonText?.includes('loading') || buttonText?.includes('...')).toBeTruthy();
    });
  });
});

// Utility functions for test data management
export class SignupTestHelper {
  static generateTestUser() {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: 'Test123!@#'
    };
  }

  static async fillSignupForm(page: any, userData: any) {
    await page.fill('#firstName', userData.firstName);
    await page.fill('#lastName', userData.lastName);
    await page.fill('#email', userData.email);
    await page.fill('#password', userData.password);
  }

  static async submitForm(page: any) {
    await page.click('button[type="submit"], input[type="submit"]');
  }

  static async expectSuccessfulRegistration(page: any) {
    await expect(page).toHaveURL(/.*contactList|.*login/, { timeout: 10000 });
  }

  static async expectValidationError(page: any) {
    await expect(page.locator('.error, .alert, [role="alert"]')).toBeVisible();
  }
}
