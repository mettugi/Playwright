import { EntryAdPage } from "@pages/entry-ad-page";
import { MainPage } from "@pages/main-page";
import { test as base,  expect } from "@playwright/test";


const test = base.extend<{entryAdPage: EntryAdPage}>({
    entryAdPage: async ({page}, use) => {
        await page.goto(process.env.BASE_URL);
        const mainPage = new MainPage(page);
        const entryAdPage = await mainPage.entryAd();
        use(entryAdPage);
    }
});

test('User should be able to close Ad modal', async ({ entryAdPage }) => {
    await expect(entryAdPage.modalText).toBeVisible();
    await entryAdPage.closeModal.click();
    await expect(entryAdPage.modalText).not.toBeVisible();
});
