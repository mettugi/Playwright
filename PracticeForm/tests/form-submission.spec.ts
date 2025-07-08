import { test, expect } from '../src/fixtures/pageFixtures';
import { validFormData, femaleUserData } from '../src/data/testData';

test.describe('Practice Form Submission Tests', () => {
  test.beforeEach(async ({ practiceFormPage }) => {
    await practiceFormPage.navigateToForm();
  });

  test('Submit complete form with valid data - Male user', async ({ practiceFormPage }) => {
    await practiceFormPage.fillCompleteForm(validFormData);
    await practiceFormPage.submitForm();
    await practiceFormPage.verifySubmissionSuccess();
    //await practiceFormPage.closeConfirmationModal();
  });

  test('Submit complete form with valid data - Female user', async ({ practiceFormPage }) => {
    await practiceFormPage.fillCompleteForm(femaleUserData);
    await practiceFormPage.submitForm();
    await practiceFormPage.verifySubmissionSuccess();
    //await practiceFormPage.closeConfirmationModal();
  });

  test('Submit form with only required fields', async ({ practiceFormPage }) => {
    const minimalData = {
      ...validFormData,
      subjects: [],
      hobbies: [],
      address: '',
      state: '',
      city: ''
    };

    await practiceFormPage.fillPersonalInfo(minimalData);
    await practiceFormPage.submitForm();
    await practiceFormPage.verifySubmissionSuccess();
    //await practiceFormPage.closeConfirmationModal();
  });
});
