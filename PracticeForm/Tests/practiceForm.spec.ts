import { test, expect } from '@playwright/test';
import { PracticeFormPage } from './pages/practiceForm.page';
import { formData } from './data/formData';

test('Fill out the practice form successfully', async ({ page }) => {
  const formPage = new PracticeFormPage(page);
  await formPage.open();
  await formPage.fillForm(formData);

  // Assert success modal
  await expect(page.locator('#example-modal-sizes-title-lg')).toHaveText('Thanks for submitting the form');
  await expect(page.locator('.modal-content')).toContainText(formData.firstName);
});
