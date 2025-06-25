// tests/inventory-advanced.spec.ts
import { test, expect, Page } from '@playwright/test';

// Advanced test scenarios for inventory page
const BASE_URL = 'https://www.saucedemo.com';
const USERS = {
  STANDARD: 'standard_user',
  PROBLEM: 'problem_user',
  PERFORMANCE_GLITCH: 'performance_glitch_user',
  ERROR: 'error_user',
  VISUAL: 'visual_user'
};

// Extended Page Object for Advanced Testing
class AdvancedInventoryPage {
  constructor(private page: Page) {}

  // Advanced selectors
  private productGrid = '.inventory_list';
  private productItems = '.inventory_item';
  private productImages = '.inventory_item_img img';
  private productTitles = '.inventory_item_name';
  private productDescriptions = '.inventory_item_desc';
  private productPrices = '.inventory_item_price';
  private addToCartButtons = '[data-test*="add-to-cart"]';
  private removeButtons = '[data-test*="remove"]';
  private sortDropdown = '[data-test="product_sort_container"]';
  private cartBadge = '.shopping_cart_badge';
  private cartLink = '.shopping_cart_link';
  private footerText = '.footer_copy';

  // Advanced product validation methods
  async validateProductCardStructure() {
    const products = await this.page.locator(this.productItems).all();
    
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      
      // Check if each product has required elements
      await expect(product.locator('.inventory_item_img')).toBeVisible();
      await expect(product.locator('.inventory_item_name')).toBeVisible();
      await expect(product.locator('.inventory_item_desc')).toBeVisible();
      await expect(product.locator('.inventory_item_price')).toBeVisible();
      await expect(product.locator('[data-test*="add-to-cart"], [data-test*="remove"]')).toBeVisible();
    }
  }

  async validateAllImagesLoaded() {
    const images = await this.page.locator(this.productImages).all();
    
    for (const image of images) {
      // Check if image is visible
