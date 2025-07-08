import { test, expect } from '../src/fixtures/pageFixtures';
import { invalidFormData } from '../src/data/testData';

test.describe('Practice Form Validation Tests', () => {
  test.beforeEach(async ({ practiceFormPage }) => {
    await practiceFormPage.navigateToForm();
  });

  test('Validate required fields on empty form submission', async ({ practiceFormPage }) => {
    await practiceFormPage.submitForm();
    
    // Check required field validations
    await practiceFormPage.verifyFieldValidation(practiceFormPage.firstNameInput);
    await practiceFormPage.verifyFieldValidation(practiceFormPage.lastNameInput);
    await practiceFormPage.verifyFieldValidation(practiceFormPage.mobileInput);
  });

  test('Validate email format', async ({ practiceFormPage }) => {
    await practiceFormPage.fillInput(practiceFormPage.emailInput, 'invalid-email');
    await practiceFormPage.submitForm();
    
    await practiceFormPage.verifyFieldValidation(practiceFormPage.emailInput);
  });

  test('Validate mobile number format', async ({ practiceFormPage }) => {
    await practiceFormPage.fillInput(practiceFormPage.mobileInput, '123');
    await practiceFormPage.submitForm();
    
    await practiceFormPage.verifyFieldValidation(practiceFormPage.mobileInput);
  });

  //test('Validate mobile number length', async ({ practiceFormPage }) => {
    //await practiceFormPage.fillInput(practiceFormPage.mobileInput, '12345678901'); // 11 digits
    //await practiceFormPage.submitForm();
    
    //await practiceFormPage.verifyFieldValidation(practiceFormPage.mobileInput);
  //});

  test('Validate mobile number length', async ({ practiceFormPage }) => {
    await practiceFormPage.fillInput(practiceFormPage.mobileInput, '123456789'); // invalid (9 digits)
    await practiceFormPage.submitForm();

    await practiceFormPage.verifyFieldValidation(practiceFormPage.mobileInput); // Should now detect error
});
});
