import { test,  expect } from "@playwright/test";


test('The modal should shown on mouse leaving the viewport', async ({ page }) => {
  await page.goto(`${process.env.BASE_URL}/exit_intent`);
  await page.locator('html').dispatchEvent('mouseleave');
  await expect(page.getByText(
    "It's commonly used to encourage a user to take an action (e.g., give their e-mail address to sign up for something).")).toBeVisible();
});
