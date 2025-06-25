import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly inventoryItems: Locator;
  readonly cartButton: Locator;
  readonly addToCartButtons: Locator;
  readonly removeButtons: Locator;
  readonly sortDropdown: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inventoryItems = page.locator('.inventory_item');
    this.cartButton = page.locator('.shopping_cart_link');
    this.addToCartButtons = page.locator('button:has-text("Add to cart")');
    this.removeButtons = page.locator('button:has-text("Remove")');
    this.sortDropdown = page.locator('[data-test="product_sort_container"]');
  }

  async open() {
    await this.page.goto('https://www.saucedemo.com/inventory.html');
  }

  async addItemToCart(index: number) {
    await this.addToCartButtons.nth(index).click();
  }

  async removeItemFromCart(index: number) {
    await this.removeButtons.nth(index).click();
  }

  async goToCart() {
    await this.cartButton.click();
  }

  async sortItems(option: string) {
    await this.sortDropdown.selectOption(option);
  }

  async getItemNames(): Promise<string[]> {
    return this.page.locator('.inventory_item_name').allTextContents();
  }

  async getItemPrices(): Promise<string[]> {
    return this.page.locator('.inventory_item_price').allTextContents();
  }
}
