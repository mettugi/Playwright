import { DynamicContentPage } from '@pages/dynamic-content-page';
import { MainPage } from '@pages/main-page';
import { expect, test as base } from '@playwright/test';

const test = base.extend<{ dynamicContentPage: DynamicContentPage }>({
  dynamicContentPage: async ({ page }, use) => {
    await page.goto(process.env.BASE_URL);
    const mainPage = new MainPage(page);
    const dynamicContentPage = await mainPage.dynamicContent();
    use(dynamicContentPage);
  },
});

test.describe('Dynamic Content tests', () => {
  test('The page content is different for every page refresh', async ({ dynamicContentPage, page }) => {
    const row1TextBeforeReload = await dynamicContentPage.row1.innerText();
    const row2TextBeforeReload = await dynamicContentPage.row2.innerText();
    const row3TextBeforeReload = await dynamicContentPage.row3.innerText();
    await page.reload();
    await page.waitForURL(`${process.env.BASE_URL}/dynamic_content`);
    const row1TextAfterReload = await dynamicContentPage.row1.innerText();
    const row2TextAfterReload = await dynamicContentPage.row2.innerText();
    const row3TextAfterReload = await dynamicContentPage.row3.innerText();

    expect(row1TextBeforeReload).not.toBe(row1TextAfterReload);
    expect(row2TextBeforeReload).not.toBe(row2TextAfterReload);
    expect(row3TextBeforeReload).not.toBe(row3TextAfterReload);
  });

  test('The first to rows of page are the same with static content param', async ({ dynamicContentPage, page }) => {
    await dynamicContentPage.staticContentLink.click();

    const row1TextBeforeReload = await dynamicContentPage.row1.innerText();
    const row2TextBeforeReload = await dynamicContentPage.row2.innerText();
    const row3TextBeforeReload = await dynamicContentPage.row3.innerText();
    await page.reload();
    await page.waitForURL(`${process.env.BASE_URL}/dynamic_content?with_content=static`);
    const row1TextAfterReload = await dynamicContentPage.row1.innerText();
    const row2TextAfterReload = await dynamicContentPage.row2.innerText();
    const row3TextAfterReload = await dynamicContentPage.row3.innerText();

    expect(row1TextBeforeReload).toBe(row1TextAfterReload);
    expect(row2TextBeforeReload).toBe(row2TextAfterReload);
    expect(row3TextBeforeReload).not.toBe(row3TextAfterReload);
  });
});
