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

  async getCartItemCount(): Promise<number> {
    return this.page.locator('.cart_item').count();
  }

  async isCartEmpty(): Promise<boolean> {
    return (await this.getCartItemCount()) === 0;
  }

  async isCartBadgeVisible(): Promise<boolean> {
    const badge = this.page.locator('.shopping_cart_badge');
    return await badge.count() > 0 && await badge.isVisible();
  }

  //async removeAllItems(): Promise<void> {
    //const removeButtonLocator = this.page.locator('[data-test*="remove"]');
    //while (await removeButtonLocator.count() > 0) {
      //await removeButtonLocator.first().click();
    //}
  //}

  async removeAllItems(): Promise<void> {
  let count = await this.removeButtons.count();
  while (count > 0) {
    const firstRemove = this.removeButtons.first();
    await firstRemove.waitFor({ state: 'visible', timeout: 5000 });
    await firstRemove.click();
    await this.page.waitForTimeout(500); // beri jeda agar DOM stabil
    count = await this.removeButtons.count(); // refresh count
    if (!(await firstRemove.isVisible())) {
  throw new Error('Remove button is not visible');
}
  }
}


  async navigateToCart(): Promise<void> {
    await this.page.locator('.shopping_cart_link').click();
    await this.page.waitForLoadState('networkidle');
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }
}
