import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { Product } from '../types';

export class InventoryPage extends BasePage {
  private readonly inventoryContainer: Locator;
  private readonly cartIcon: Locator;
  private readonly cartBadge: Locator;
  private readonly hamburgerButton: Locator;
  private readonly aboutLink: Locator;
  private readonly logoutLink: Locator;

  constructor(page: Page) {
    super(page);
    this.inventoryContainer = page.locator('.inventory_container');
    this.cartIcon = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.hamburgerButton = page.locator('#react-burger-menu-btn');
    this.aboutLink = page.locator('#about_sidebar_link');
    this.logoutLink = page.locator('#logout_sidebar_link');
  }

  async verifyInventoryPageLoaded(): Promise<void> {
    await expect(this.inventoryContainer).toBeVisible();
  }

  async addProductToCart(product: Product): Promise<void> {
    const addToCartButton = this.page.locator(`[data-test="add-to-cart-${product.dataTestId}"]`);
    await addToCartButton.click();
  }

  async removeProductFromCart(product: Product): Promise<void> {
    const removeButton = this.page.locator(`[data-test="remove-${product.dataTestId}"]`);
    await removeButton.click();
  }

  async getCartItemCount(): Promise<string> {
    if (await this.cartBadge.isVisible()) {
      return await this.cartBadge.textContent() || '0';
    }
    return '0';
  }

  async goToCart(): Promise<void> {
    await this.cartIcon.click();
  }

  async openHamburgerMenu(): Promise<void> {
    await this.hamburgerButton.click();
  }

  async clickAboutLink(): Promise<void> {
    await this.aboutLink.click();
  }

  async logout(): Promise<void> {
    await this.openHamburgerMenu();
    await this.logoutLink.click();
  }

  async verifyAboutLinkVisible(): Promise<void> {
    await expect(this.aboutLink).toBeVisible();
  }
}
