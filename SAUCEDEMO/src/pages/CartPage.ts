import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  private readonly cartContainer: Locator;
  private readonly cartItems: Locator;
  private readonly checkoutButton: Locator;
  private readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartContainer = page.locator('.cart_contents_container');
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('#checkout');
    this.continueShoppingButton = page.locator('#continue-shopping');
  }

  async verifyCartPageLoaded(): Promise<void> {
    await expect(this.cartContainer).toBeVisible();
  }

  async getCartItems(): Promise<Locator> {
    return this.cartItems;
  }

  async getCartItemsCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async getCartItemName(itemIndex: number = 0): Promise<string> {
    const itemName = this.cartItems.nth(itemIndex).locator('.inventory_item_name');
    return await itemName.textContent() || '';
  }

  async verifyItemInCart(expectedItemName: string): Promise<void> {
    const itemsCount = await this.getCartItemsCount();
    let itemFound = false;

    for (let i = 0; i < itemsCount; i++) {
      const itemName = await this.getCartItemName(i);
      if (itemName === expectedItemName) {
        itemFound = true;
        break;
      }
    }

    expect(itemFound).toBe(true);
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
