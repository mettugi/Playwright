import { test, expect } from '../../src/fixtures/pageFixtures';
import { validFormData } from '../../src/data/testData';

test.describe('Practice Form Components Tests', () => {
  test.beforeEach(async ({ practiceFormPage }) => {
    await practiceFormPage.navigateToForm();
  });

  test('Test date picker functionality', async ({ practiceFormPage }) => {
    await practiceFormPage.fillDateOfBirth(validFormData.dateOfBirth);
    await expect(practiceFormPage.dateOfBirthInput).not.toHaveValue('');
  });

  test('Test subjects autocomplete', async ({ practiceFormPage }) => {
    await practiceFormPage.scrollToElement(practiceFormPage.subjectsInput);
    
    await practiceFormPage.fillInput(practiceFormPage.subjectsInput, 'Math');
    await expect(practiceFormPage.subjectsAutoCompleteOption).toBeVisible();
    await practiceFormPage.clickElement(practiceFormPage.subjectsAutoCompleteOption.first());
    
    await expect(practiceFormPage.subjectsSelectedValue).toContainText('Maths');
  });

  test('Test gender radio buttons', async ({ practiceFormPage }) => {
    await practiceFormPage.clickElement(practiceFormPage.genderRadioLabel('Male'));
    await expect(practiceFormPage.page.locator('input[name="gender"][value="Male"]')).toBeChecked();
    
    await practiceFormPage.clickElement(practiceFormPage.genderRadioLabel('Female'));
    await expect(practiceFormPage.page.locator('input[name="gender"][value="Female"]')).toBeChecked();
    await expect(practiceFormPage.page.locator('input[name="gender"][value="Male"]')).not.toBeChecked();
  });

  test('Test hobby checkboxes', async ({ practiceFormPage }) => {
    await practiceFormPage.clickElement(practiceFormPage.hobbyCheckboxLabel('Sports'));
    await practiceFormPage.clickElement(practiceFormPage.hobbyCheckboxLabel('Reading'));
    
    await expect(practiceFormPage.page.locator('input[id="hobbies-checkbox-1"]')).toBeChecked();
    await expect(practiceFormPage.page.locator('input[id="hobbies-checkbox-2"]')).toBeChecked();
  });

  test('Test state and city dropdown dependency', async ({ practiceFormPage }) => {
    await practiceFormPage.scrollToElement(practiceFormPage.stateDropdown);
    
    await practiceFormPage.clickElement(practiceFormPage.stateDropdown);
    await practiceFormPage.clickElement(practiceFormPage.reactSelectOption('NCR'));
    
    await expect(practiceFormPage.cityDropdown).toBeEnabled();
    
    await practiceFormPage.clickElement(practiceFormPage.cityDropdown);
    await practiceFormPage.clickElement(practiceFormPage.reactSelectOption('Delhi'));
    
    await expect(practiceFormPage.stateDropdown).toContainText('NCR');
    await expect(practiceFormPage.cityDropdown).toContainText('Delhi');
  });
});
