import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly removeButtons: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.removeButtons = page.locator('button:has-text("Remove")');
    this.itemNames = page.locator('.inventory_item_name');
    this.itemPrices = page.locator('.inventory_item_price');
  }

  async open() {
    await this.page.goto('https://www.saucedemo.com/cart.html');
  }

  async removeItem(index: number) {
    await this.removeButtons.nth(index).click();
  }

  async getCartItemNames(): Promise<string[]> {
    return this.itemNames.allTextContents();
  }

  async getCartItemPrices(): Promise<string[]> {
    return this.itemPrices.allTextContents();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }
}
