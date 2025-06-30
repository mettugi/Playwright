// pages/search.page.ts

import { Page, Locator } from '@playwright/test';

export class SearchPage {
  readonly page: Page;
  readonly input: Locator;
  readonly searchButton: Locator;
  readonly resultItems: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.input = page.locator('#username-input');
    this.searchButton = page.locator('#search-button');
    this.resultItems = page.locator('.user-card');       // adjust to actual selector
    this.errorMessage = page.locator('.error-message');  // adjust to actual selector
  }

  async goto() {
    await this.page.goto('https://gh-users-search.netlify.app/');
  }

  async search(username: string) {
    await this.input.fill(username);
    await this.searchButton.click();
  }

  async getResultsCount() {
    return await this.resultItems.count();
  }

  async getResultUsernames() {
    return await this.resultItems.locator('.username').allTextContents();
  }
}
