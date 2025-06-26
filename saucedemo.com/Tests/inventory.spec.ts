import { test, expect, Page } from '@playwright/test';

// Test data constants
const BASE_URL = 'https://www.saucedemo.com';
const VALID_PASSWORD = 'secret_sauce';

const USERS = {
  STANDARD: 'standard_user',
  PROBLEM: 'problem_user',
  PERFORMANCE_GLITCH: 'performance_glitch_user',
  ERROR: 'error_user',
  VISUAL: 'visual_user'
};

// Expected product data
const EXPECTED_PRODUCTS = [
  { name: 'Sauce Labs Backpack', price: '$29.99' },
  { name: 'Sauce Labs Bike Light', price: '$9.99' },
  { name: 'Sauce Labs Bolt T-Shirt', price: '$15.99' },
  { name: 'Sauce Labs Fleece Jacket', price: '$49.99' },
  { name: 'Sauce Labs Onesie', price: '$7.99' },
  { name: 'Test.allTheThings() T-Shirt (Red)', price: '$15.99' }
];

const SORT_OPTIONS = {
  NAME_A_TO_Z: 'az',
  NAME_Z_TO_A: 'za',
  PRICE_LOW_TO_HIGH: 'lohi',
  PRICE_HIGH_TO_LOW: 'hilo'
};

// Page Object Model for Login Page
class LoginPage {
  constructor(private page: Page) {}

  async login(username: string, password: string) {
    await this.page.goto(BASE_URL);
    await this.page.fill('[data-test="username"]', username);
    await this.page.fill('[data-test="password"]', password);
    await this.page.click('[data-test="login-button"]');
  }
}

// Page Object Model for Inventory Page
class InventoryPage {
  constructor(private page: Page) {}

  // Selectors
  private pageTitle = '.title';
  private inventoryContainer = '.inventory_container';
  private inventoryItems = '.inventory_item';
  private inventoryItemName = '.inventory_item_name';
  private inventoryItemDesc = '.inventory_item_desc';
  private inventoryItemPrice = '.inventory_item_price';
  private inventoryItemImg = '.inventory_item_img img';
  private addToCartButtons = '[data-test*="add-to-cart"]';
  private removeFromCartButtons = '[data-test*="remove"]';
  private sortDropdown = '[data-test="product_sort_container"]';
  private shoppingCartLink = '.shopping_cart_link';
  private shoppingCartBadge = '.shopping_cart_badge';
  private menuButton = '#react-burger-menu-btn';
  private logoutLink = '#logout_sidebar_link';
  private menuOverlay = '.bm-menu';
  private menuItems = '.bm-item';

  // Navigation methods
  async isInventoryPageLoaded() {
    await expect(this.page.locator(this.pageTitle)).toContainText('Products');
    await expect(this.page.locator(this.inventoryContainer)).toBeVisible();
  }

  async navigateToInventory() {
    await this.page.goto(`${BASE_URL}/inventory.html`);
  }

  // Product interaction methods
  async getProductCount() {
    return await this.page.locator(this.inventoryItems).count();
  }

  async getProductNames() {
    return await this.page.locator(this.inventoryItemName).allTextContents();
  }

  async getProductPrices() {
    return await this.page.locator(this.inventoryItemPrice).allTextContents();
  }

  async getProductDescriptions() {
    return await this.page.locator(this.inventoryItemDesc).allTextContents();
  }

  async clickProductByName(productName: string) {
    await this.page.locator(this.inventoryItemName, { hasText: productName }).click();
  }

  async clickProductImage(index: number) {
    await this.page.locator(this.inventoryItemImg).nth(index).click();
  }

  async addProductToCart(productName: string) {
    const productSelector = `[data-test="add-to-cart-${productName.toLowerCase().replace(/[\s\(\)\.]/g, '-')}"]`;
    await this.page.click(productSelector);
  }

  async removeProductFromCart(productName: string) {
    const productSelector = `[data-test="remove-${productName.toLowerCase().replace(/[\s\(\)\.]/g, '-')}"]`;
    await this.page.click(productSelector);
  }

  async addAllProductsToCart() {
    const addButtons = await this.page.locator(this.addToCartButtons).all();
    for (const button of addButtons) {
      await button.click();
    }
  }

  async removeAllProductsFromCart() {
    const removeButtons = await this.page.locator(this.removeFromCartButtons).all();
    for (const button of removeButtons) {
      await button.click();
    }
  }

  // Cart methods
  async getCartItemCount() {
    const badge = this.page.locator(this.shoppingCartBadge);
    if (await badge.isVisible()) {
      return parseInt(await badge.textContent() || '0');
    }
    return 0;
  }

  async clickShoppingCart() {
    await this.page.click(this.shoppingCartLink);
  }

  async isCartBadgeVisible() {
    return await this.page.locator(this.shoppingCartBadge).isVisible();
  }

  // Sorting methods
  async sortProducts(sortOption: string) {
    await this.page.selectOption(this.sortDropdown, sortOption);
  }

  //async getCurrentSortOption() {
    //return await this.page.locator(this.sortDropdown).inputValue();
  //}

  async getCurrentSortOption(): Promise<string> {
    const sortDropdown = this.page.locator('[data-test="product_sort_container"]');
    await expect(sortDropdown).toBeVisible(); // 🔒 wait for visibility
    return await sortDropdown.inputValue();   // ✅ will now work safely
  }

  // Menu methods
  async openMenu() {
    await this.page.click(this.menuButton);
    await expect(this.page.locator(this.menuOverlay)).toBeVisible();
  }

  async closeMenu() {
    await this.page.click('.bm-cross-button');
  }

  async getMenuItems() {
    await this.openMenu();
    return await this.page.locator(this.menuItems).allTextContents();
  }

  async logout() {
    await this.openMenu();
    await this.page.click(this.logoutLink);
  }

  // Utility methods
  async isAddToCartButtonVisible(productName: string) {
    const productSelector = `[data-test="add-to-cart-${productName.toLowerCase().replace(/[\s\(\)\.]/g, '-')}"]`;
    return await this.page.locator(productSelector).isVisible();
  }

  async isRemoveButtonVisible(productName: string) {
    const productSelector = `[data-test="remove-${productName.toLowerCase().replace(/[\s\(\)\.]/g, '-')}"]`;
    return await this.page.locator(productSelector).isVisible();
  }

  async getButtonTextForProduct(productName: string) {
    const addSelector = `[data-test="add-to-cart-${productName.toLowerCase().replace(/[\s\(\)\.]/g, '-')}"]`;
    const removeSelector = `[data-test="remove-${productName.toLowerCase().replace(/[\s\(\)\.]/g, '-')}"]`;
    
    if (await this.page.locator(addSelector).isVisible()) {
      return await this.page.locator(addSelector).textContent();
    } else if (await this.page.locator(removeSelector).isVisible()) {
      return await this.page.locator(removeSelector).textContent();
    }
    return null;
  }
}

// Page Object Model for Product Detail Page
class ProductDetailPage {
  constructor(private page: Page) {}

  private backButton = '[data-test="back-to-products"]';
  private productName = '[data-test="inventory-item-name"]';
  private productDesc = '[data-test="inventory-item-desc"]';
  private productPrice = '[data-test="inventory-item-price"]';
  private productImage = '.inventory_details_img';
  private addToCartButton = '[data-test*="add-to-cart"]';
  private removeButton = '[data-test*="remove"]';

  async isProductDetailPageLoaded() {
    await expect(this.page.locator(this.productName)).toBeVisible();
    await expect(this.page.locator(this.productImage)).toBeVisible();
  }

  async getProductName() {
    return await this.page.locator(this.productName).textContent();
  }

  async getProductPrice() {
    return await this.page.locator(this.productPrice).textContent();
  }

  async getProductDescription() {
    return await this.page.locator(this.productDesc).textContent();
  }

  async clickBackToProducts() {
    await this.page.click(this.backButton);
  }

  async addToCart() {
    await this.page.click(this.addToCartButton);
  }

  async removeFromCart() {
    await this.page.click(this.removeButton);
  }

  async isAddToCartButtonVisible() {
    return await this.page.locator(this.addToCartButton).isVisible();
  }

  async isRemoveButtonVisible() {
    return await this.page.locator(this.removeButton).isVisible();
  }
}

test.describe('SauceDemo Inventory Page Tests', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let productDetailPage: ProductDetailPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    productDetailPage = new ProductDetailPage(page);
    
    // Login with standard user before each test
    await loginPage.login(USERS.STANDARD, VALID_PASSWORD);
    await inventoryPage.isInventoryPageLoaded();
  });

  test.describe('Page Load and Display Tests', () => {
    test('should display inventory page correctly after login', async ({ page }) => {
      await inventoryPage.isInventoryPageLoaded();
      expect(page.url()).toContain('/inventory.html');
    });

    test('should display correct number of products', async () => {
      const productCount = await inventoryPage.getProductCount();
      expect(productCount).toBe(6);
    });

    test('should display all expected products with correct names and prices', async () => {
      const productNames = await inventoryPage.getProductNames();
      const productPrices = await inventoryPage.getProductPrices();

      for (const expectedProduct of EXPECTED_PRODUCTS) {
        expect(productNames).toContain(expectedProduct.name);
        expect(productPrices).toContain(expectedProduct.price);
      }
    });

    test('should display product descriptions for all items', async () => {
      const descriptions = await inventoryPage.getProductDescriptions();
      expect(descriptions.length).toBe(6);
      descriptions.forEach(desc => {
        expect(desc.trim().length).toBeGreaterThan(0);
      });
    });

    test('should display product images for all items', async ({ page }) => {
      const images = await page.locator('.inventory_item_img img').all();
      expect(images.length).toBe(6);

      for (const image of images) {
        await expect(image).toBeVisible();
        await expect(image).toHaveAttribute('src');
      }
    });
  });

  test.describe('Product Sorting Tests', () => {
    test('should sort products by name A to Z by default', async () => {
      const currentSort = await inventoryPage.getCurrentSortOption();
      expect(currentSort).toBe(SORT_OPTIONS.NAME_A_TO_Z);

      const productNames = await inventoryPage.getProductNames();
      const sortedNames = [...productNames].sort();
      expect(productNames).toEqual(sortedNames);
    });

    test('should sort products by name Z to A', async () => {
      await inventoryPage.sortProducts(SORT_OPTIONS.NAME_Z_TO_A);
      
      const productNames = await inventoryPage.getProductNames();
      const sortedNames = [...productNames].sort().reverse();
      expect(productNames).toEqual(sortedNames);
    });

    test('should sort products by price low to high', async () => {
      await inventoryPage.sortProducts(SORT_OPTIONS.PRICE_LOW_TO_HIGH);
      
      const productPrices = await inventoryPage.getProductPrices();
      const numericPrices = productPrices.map(price => parseFloat(price.replace('$', '')));
      const sortedPrices = [...numericPrices].sort((a, b) => a - b);
      expect(numericPrices).toEqual(sortedPrices);
    });

    test('should sort products by price high to low', async () => {
      await inventoryPage.sortProducts(SORT_OPTIONS.PRICE_HIGH_TO_LOW);
      
      const productPrices = await inventoryPage.getProductPrices();
      const numericPrices = productPrices.map(price => parseFloat(price.replace('$', '')));
      const sortedPrices = [...numericPrices].sort((a, b) => b - a);
      expect(numericPrices).toEqual(sortedPrices);
    });

    test('should maintain sort selection after page interaction', async () => {
      await inventoryPage.sortProducts(SORT_OPTIONS.PRICE_HIGH_TO_LOW);
      await inventoryPage.addProductToCart('sauce-labs-backpack');
      
      const currentSort = await inventoryPage.getCurrentSortOption();
      expect(currentSort).toBe(SORT_OPTIONS.PRICE_HIGH_TO_LOW);
    });
  });

  test.describe('Add to Cart Functionality Tests', () => {
    test('should add single product to cart', async () => {
      await inventoryPage.addProductToCart('sauce-labs-backpack');
      
      const cartCount = await inventoryPage.getCartItemCount();
      expect(cartCount).toBe(1);
      expect(await inventoryPage.isCartBadgeVisible()).toBeTruthy();
    });

    test('should add multiple products to cart', async () => {
      await inventoryPage.addProductToCart('sauce-labs-backpack');
      await inventoryPage.addProductToCart('sauce-labs-bike-light');
      await inventoryPage.addProductToCart('sauce-labs-bolt-t-shirt');
      
      const cartCount = await inventoryPage.getCartItemCount();
      expect(cartCount).toBe(3);
    });

    test('should add all products to cart', async () => {
      await inventoryPage.addAllProductsToCart();
      
      const cartCount = await inventoryPage.getCartItemCount();
      expect(cartCount).toBe(6);
    });

    test('should change button text from "Add to cart" to "Remove" after adding', async () => {
      const initialButtonText = await inventoryPage.getButtonTextForProduct('sauce-labs-backpack');
      expect(initialButtonText).toContain('Add to cart');
      
      await inventoryPage.addProductToCart('sauce-labs-backpack');
      
      const updatedButtonText = await inventoryPage.getButtonTextForProduct('sauce-labs-backpack');
      expect(updatedButtonText).toContain('Remove');
    });

    test('should remove product from cart', async () => {
      await inventoryPage.addProductToCart('sauce-labs-backpack');
      expect(await inventoryPage.getCartItemCount()).toBe(1);
      
      await inventoryPage.removeProductFromCart('sauce-labs-backpack');
      expect(await inventoryPage.getCartItemCount()).toBe(0);
      expect(await inventoryPage.isCartBadgeVisible()).toBeFalsy();
    });

    test('should remove all products from cart', async () => {
      await inventoryPage.addAllProductsToCart();
      expect(await inventoryPage.getCartItemCount()).toBe(6);
      
      await inventoryPage.removeAllProductsFromCart();
      expect(await inventoryPage.getCartItemCount()).toBe(0);
    });
  });

  test.describe('Product Navigation Tests', () => {
    test('should navigate to product detail page by clicking product name', async ({ page }) => {
      await inventoryPage.clickProductByName('Sauce Labs Backpack');
      
      await productDetailPage.isProductDetailPageLoaded();
      expect(page.url()).toContain('/inventory-item.html');
      
      const productName = await productDetailPage.getProductName();
      expect(productName).toBe('Sauce Labs Backpack');
    });

    test('should navigate to product detail page by clicking product image', async ({ page }) => {
      await inventoryPage.clickProductImage(0);
      
      await productDetailPage.isProductDetailPageLoaded();
      expect(page.url()).toContain('/inventory-item.html');
    });

    test('should return to inventory page from product detail page', async ({ page }) => {
      await inventoryPage.clickProductByName('Sauce Labs Backpack');
      await productDetailPage.isProductDetailPageLoaded();
      
      await productDetailPage.clickBackToProducts();
      
      await inventoryPage.isInventoryPageLoaded();
      expect(page.url()).toContain('/inventory.html');
    });

    test('should maintain cart state when navigating to product detail and back', async () => {
      await inventoryPage.addProductToCart('sauce-labs-backpack');
      expect(await inventoryPage.getCartItemCount()).toBe(1);
      
      await inventoryPage.clickProductByName('Sauce Labs Backpack');
      await productDetailPage.isProductDetailPageLoaded();
      await productDetailPage.clickBackToProducts();
      
      await inventoryPage.isInventoryPageLoaded();
      expect(await inventoryPage.getCartItemCount()).toBe(1);
    });
  });

  test.describe('Shopping Cart Navigation Tests', () => {
    test('should navigate to cart page when clicking cart icon', async ({ page }) => {
      await inventoryPage.clickShoppingCart();
      expect(page.url()).toContain('/cart.html');
    });

    test('should navigate to cart page with items in cart', async ({ page }) => {
      await inventoryPage.addProductToCart('sauce-labs-backpack');
      await inventoryPage.clickShoppingCart();
      
      expect(page.url()).toContain('/cart.html');
      // Verify cart page loads with items - this would need cart page object model
    });

    test('should display correct cart badge count', async () => {
      expect(await inventoryPage.isCartBadgeVisible()).toBeFalsy();
      
      await inventoryPage.addProductToCart('sauce-labs-backpack');
      expect(await inventoryPage.isCartBadgeVisible()).toBeTruthy();
      expect(await inventoryPage.getCartItemCount()).toBe(1);
      
      await inventoryPage.addProductToCart('sauce-labs-bike-light');
      expect(await inventoryPage.getCartItemCount()).toBe(2);
    });
  });

  test.describe('Menu Functionality Tests', () => {
    test('should open and close hamburger menu', async () => {
      await inventoryPage.openMenu();
      await expect(inventoryPage.page.locator('.bm-menu')).toBeVisible();
      
      await inventoryPage.closeMenu();
      await expect(inventoryPage.page.locator('.bm-menu')).not.toBeVisible();
    });

    test('should display all menu items', async () => {
      const menuItems = await inventoryPage.getMenuItems();
      expect(menuItems).toContain('All Items');
      expect(menuItems).toContain('About');
      expect(menuItems).toContain('Logout');
      expect(menuItems).toContain('Reset App State');
    });

    test('should logout successfully from menu', async ({ page }) => {
      await inventoryPage.logout();
      expect(page.url()).toBe(`${BASE_URL}/`);
    });

    test('should maintain cart state after opening and closing menu', async () => {
      await inventoryPage.addProductToCart('sauce-labs-backpack');
      expect(await inventoryPage.getCartItemCount()).toBe(1);
      
      await inventoryPage.openMenu();
      await inventoryPage.closeMenu();
      
      expect(await inventoryPage.getCartItemCount()).toBe(1);
    });
  });

  test.describe('User Experience Tests', () => {
    test('should maintain scroll position after adding item to cart', async ({ page }) => {
      // Scroll to bottom
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      const scrollPosition = await page.evaluate(() => window.scrollY);
      
      await inventoryPage.addProductToCart('sauce-labs-backpack');
      
      const newScrollPosition = await page.evaluate(() => window.scrollY);
      expect(newScrollPosition).toBe(scrollPosition);
    });

    test('should handle rapid clicking on add to cart button', async () => {
      const button = inventoryPage.page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
      
      // Rapid clicks should only add item once
      await button.click();
      await button.click();
      await button.click();
      
      expect(await inventoryPage.getCartItemCount()).toBe(1);
    });

    test('should display consistent product layout on different screen sizes', async ({ page }) => {
      // Test mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await inventoryPage.isInventoryPageLoaded();
      expect(await inventoryPage.getProductCount()).toBe(6);
      
      // Test tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      await inventoryPage.isInventoryPageLoaded();
      expect(await inventoryPage.getProductCount()).toBe(6);
      
      // Test desktop viewport
      await page.setViewportSize({ width: 1920, height: 1080 });
      await inventoryPage.isInventoryPageLoaded();
      expect(await inventoryPage.getProductCount()).toBe(6);
    });
  });

  test.describe('Error Handling and Edge Cases', () => {
    test('should handle page refresh with items in cart', async ({ page }) => {
      await inventoryPage.addProductToCart('sauce-labs-backpack');
      expect(await inventoryPage.getCartItemCount()).toBe(1);
      
      await page.reload();
      await inventoryPage.isInventoryPageLoaded();
      
      // Cart should maintain state after refresh
      expect(await inventoryPage.getCartItemCount()).toBe(1);
    });

    test('should handle browser back button navigation', async ({ page }) => {
      await inventoryPage.clickProductByName('Sauce Labs Backpack');
      await productDetailPage.isProductDetailPageLoaded();
      
      await page.goBack();
      await inventoryPage.isInventoryPageLoaded();
    });

    test('should handle direct URL access to inventory page', async ({ page }) => {
      await page.goto(`${BASE_URL}/inventory.html`);
      await inventoryPage.isInventoryPageLoaded();
    });
  });

  test.describe('Performance Tests', () => {
    test('should load inventory page within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto(`${BASE_URL}/inventory.html`);
      await inventoryPage.isInventoryPageLoaded();
      const loadTime = Date.now() - startTime;
      
      expect(loadTime).toBeLessThan(5000); // 5 seconds max
    });

    test('should render all product images within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      
      const images = await page.locator('.inventory_item_img img').all();
      for (const image of images) {
        await expect(image).toBeVisible();
      }
      
      const renderTime = Date.now() - startTime;
      expect(renderTime).toBeLessThan(3000); // 3 seconds max
    });
  });

  test.describe('Cross-User Behavior Tests', () => {
    test('should handle problem_user specific issues', async ({ page }) => {
      // Login as problem user
      await loginPage.login(USERS.PROBLEM, VALID_PASSWORD);
      await inventoryPage.isInventoryPageLoaded();
      
      // Problem user may have UI issues, but basic functionality should work
      const productCount = await inventoryPage.getProductCount();
      expect(productCount).toBe(6);
      
      await inventoryPage.addProductToCart('sauce-labs-backpack');
      expect(await inventoryPage.getCartItemCount()).toBe(1);
    });

    test('should handle performance_glitch_user with extended timeout', async ({ page }) => {
      test.setTimeout(60000); // Extended timeout for performance user
      
      await loginPage.login(USERS.PERFORMANCE_GLITCH, VALID_PASSWORD);
      await inventoryPage.isInventoryPageLoaded();
      
      const productCount = await inventoryPage.getProductCount();
      expect(productCount).toBe(6);
    });

    test('should handle visual_user display correctly', async ({ page }) => {
      await loginPage.login(USERS.VISUAL, VALID_PASSWORD);
      await inventoryPage.isInventoryPageLoaded();
      
      // Visual user should see all products correctly
      const productNames = await inventoryPage.getProductNames();
      expect(productNames.length).toBe(6);
      
      const productPrices = await inventoryPage.getProductPrices();
      expect(productPrices.length).toBe(6);
    });
  });
});

// Data-driven test for all products
test.describe('Data-Driven Product Tests', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.login(USERS.STANDARD, VALID_PASSWORD);
    await inventoryPage.isInventoryPageLoaded();
  });

  EXPECTED_PRODUCTS.forEach((product, index) => {
    test(`should add ${product.name} to cart successfully`, async () => {
      const productKey = product.name.toLowerCase().replace(/[\s\(\)\.]/g, '-');
      await inventoryPage.addProductToCart(productKey);
      
      expect(await inventoryPage.getCartItemCount()).toBe(1);
      expect(await inventoryPage.isRemoveButtonVisible(productKey)).toBeTruthy();
    });

    test(`should navigate to ${product.name} detail page`, async ({ page }) => {
      await inventoryPage.clickProductByName(product.name);
      
      expect(page.url()).toContain('/inventory-item.html');
      // Additional assertions could be made here with product detail page object
    });
  });
});

// Utility class for advanced inventory testing
export class InventoryTestHelpers {
  static async verifyProductOrder(page: Page, expectedOrder: string[]) {
    const actualOrder = await page.locator('.inventory_item_name').allTextContents();
    expect(actualOrder).toEqual(expectedOrder);
  }

  static async calculateTotalCartValue(page: Page): Promise<number> {
    // This would be used with cart page - placeholder for future implementation
    return 0;
  }

  static async takeProductScreenshot(page: Page, productName: string) {
    const productElement = page.locator('.inventory_item', { has: page.locator('.inventory_item_name', { hasText: productName }) });
    await productElement.screenshot({ path: `screenshots/${productName}-${Date.now()}.png` });
  }

  static async validateProductImageLoading(page: Page) {
    const images = await page.locator('.inventory_item_img img').all();
    for (const image of images) {
      const naturalWidth = await image.evaluate((img: HTMLImageElement) => img.naturalWidth);
      const naturalHeight = await image.evaluate((img: HTMLImageElement) => img.naturalHeight);
      expect(naturalWidth).toBeGreaterThan(0);
      expect(naturalHeight).toBeGreaterThan(0);
    }
  }
}
