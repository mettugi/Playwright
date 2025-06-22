import { ABTestPage } from '@pages/ab-test-page';
import { MainPage } from '@pages/main-page';
import { expect, test as base } from '@playwright/test';

const test = base.extend<{ aBTestPage: ABTestPage }>({
  aBTestPage: async ({ page }, use) => {
    await page.goto(process.env.BASE_URL);
    const mainPage = new MainPage(page);
    const aBTestPage = await mainPage.abTest();
    use(aBTestPage);
  },
});

test.describe('AB Test', () => {
  test('User should be able to go to the AB test site', async ({ aBTestPage }) => {
    await expect(aBTestPage.abTestHeading).toContainText('A/B Test');
    await expect(aBTestPage.abTestParagraph).toHaveText(
      'Also known as split testing. This is a way in which businesses are able to simultaneously test and learn different versions of a page to see which text and/or functionality works best towards a desired outcome (e.g. a user action such as a click-through).',
    );
  });
});
