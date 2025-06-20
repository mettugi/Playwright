import { test, expect } from '@playwright/test';
import { BookstorePage } from '../pages/BookstorePage';

test('Search for a valid book by keyword title', async ({ page }) => {
  const bookstore = new BookstorePage(page);
  await page.goto('https://demoqa.com/books');
  await bookstore.searchBook('git');
  await expect(page.locator('.action-buttons a')).toHaveCount(1);
});

test('Search for a valid book by keyword author', async ({ page }) => {
  const bookstore = new BookstorePage(page);
  await page.goto('https://demoqa.com/books');
  await bookstore.searchBook('Marijn');
  await expect(page.locator('.action-buttons a')).toHaveCount(1);
});

test('Search for a invalid book by keyword title', async ({ page }) => {
  const bookstore = new BookstorePage(page);
  await page.goto('https://demoqa.com/books');
  await bookstore.searchBook('agit');
  await expect(page.locator('.action-buttons a')).toHaveCount(0);
});

test('Search for a invalid book by keyword author', async ({ page }) => {
  const bookstore = new BookstorePage(page);
  await page.goto('https://demoqa.com/books');
  await bookstore.searchBook('marijni');
  await expect(page.locator('.action-buttons a')).toHaveCount(0);
});
