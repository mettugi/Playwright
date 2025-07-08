import { test as base } from '@playwright/test';
import { PracticeFormPage } from '../pages/PracticeFormPage';

type PageFixtures = {
  practiceFormPage: PracticeFormPage;
};

export const test = base.extend<PageFixtures>({
  practiceFormPage: async ({ page }, use) => {
    const practiceFormPage = new PracticeFormPage(page);
    await use(practiceFormPage);
  },
});
