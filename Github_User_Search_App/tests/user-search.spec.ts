// tests/user-search.spec.ts

import { test, expect } from '@playwright/test';
import { SearchPage } from '../pages/search.page';

test.describe('GitHub User Search App', () => {
  let search: SearchPage;

  test.beforeEach(async ({ page }) => {
    search = new SearchPage(page);
    await search.goto();
  });

  test('should show results for valid username', async () => {
    await search.search('octocat');
    const count = await search.getResultsCount();
    expect(count).toBeGreaterThan(0);

    const usernames = await search.getResultUsernames();
    expect(usernames).toContain('octocat');
  });

  test('should show no results for invalid username', async () => {
    await search.search('nonexistentuser_xyz_123');
    expect(await search.getResultsCount()).toBe(0);
    await expect(search.errorMessage).toBeVisible();
  });

  test('search button disabled when input is empty', async () => {
    await search.input.fill('');
    expect(await search.searchButton.isDisabled()).toBeTruthy();
  });
});
