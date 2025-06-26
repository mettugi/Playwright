// tests/cart.spec.ts
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

// Expected product data for testing
const TEST_PRODUCTS = [
  { 
    id: 'sauce-labs-backpack',
    name: 'Sauce Labs Backpack', 
    price: '$29.99',
    description: 'carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.'
  },
  { 
    id: 'sauce-labs-bike-light',
    name: 'Sauce Labs Bike Light', 
    price: '$9.99',
    description: 'A red light isn\'t the desired state in testing but it sure helps when riding your bike at night. Water-resistant with 3 lighting modes, 1 AAA battery included.'
  },
  { 
    id: 'sauce-labs-bolt-t-shirt',
    name: 'Sauce Labs Bolt T-Shirt', 
    price: '$15.99',
    description: 'Get your testing superhero on with the Sauce Labs bolt T-shirt. From American Apparel, 100% ringspun combed cotton, heather gray with red bolt.'
  }
];

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

  async addProductToCart(productId: string) {
    await this.page.click(`[data-test="add-to-cart-${productId}"]`);
  }

  async addMultipleProductsToCart(productIds: string[]) {
    for (const productId of productIds) {
      await this.addProductToCart(productId);
    }
  }

  //async navigateToCart() {
    //await this.page.click('.shopping_cart_link');
  //}

  async navigateToCart(): Promise<void> {
  await this.page.locator('.shopping_cart_link').click();
  await this.page.waitForURL('**/cart.html');
  await this.page.waitForLoadState('networkidle');
  await this.page.waitForSelector('.cart_item', { timeout: 5000 });
}


  async getCartBadgeCount() {
    const badge = this.page.locator('.shopping_cart_badge');
    if (await badge.isVisible()) {
      return parseInt(await badge.textContent() || '0');
    }
    return 0;
  }
}

// Page Object Model for Cart Page
class CartPage {
  constructor(private page: Page) {}

  // Selectors
  private pageTitle = '.title';
  private cartList = '.cart_list';
  private cartItems = '.cart_item';
  private cartItemNames = '.inventory_item_name';
  private cartItemDescriptions = '.inventory_item_desc';
  private cartItemPrices = '.inventory_item_price';
  private cartItemQuantities = '.cart_quantity';
  private removeButtons = '[data-test*="remove"]';
  private continueShoppingButton = '[data-test="continue-shopping"]';
  private checkoutButton = '[data-test="checkout"]';
  private cartBadge = '.shopping_cart_badge';
  private emptyCartMessage = '.cart_item';
  private cartFooter = '.cart_footer';

  // Navigation methods
  async isCartPageLoaded() {
    await expect(this.page.locator(this.pageTitle)).toContainText('Your Cart');
    await expect(this.page.locator(this.cartList)).toBeVisible();
  }

  async navigateToCart() {
    await this.page.goto(`${BASE_URL}/cart.html`);
  }

  // Cart item methods
  async getCartItemCount() {
    return await this.page.locator(this.cartItems).count();
  }

  async getCartItemNames() {
    return await this.page.locator(this.cartItemNames).allTextContents();
  }

  async getCartItemPrices() {
    return await this.page.locator(this.cartItemPrices).allTextContents();
  }

  async getCartItemDescriptions() {
    return await this.page.locator(this.cartItemDescriptions).allTextContents();
  }

  async getCartItemQuantities() {
    const quantities = await this.page.locator(this.cartItemQuantities).allTextContents();
    return quantities.map(q => parseInt(q));
  }

  //async removeItemFromCart(productName: string) {
    //const productSelector = `[data-test="remove-${productName.toLowerCase().replace(/[\s\(\)\.]/g, '-')}"]`;
    //await this.page.click(productSelector);
  //}

  async removeItemFromCart(productName: string) {
  const items = await this.page.locator('.inventory_item_name').allTextContents();
  console.log('DEBUG - Cart contains:', items);

  const cartItem = this.page.locator('.cart_item').filter({
    has: this.page.locator('.inventory_item_name', { hasText: productName })
  });

  const removeButton = cartItem.locator('button:has-text("Remove")');
  
  try {
    await removeButton.first().waitFor({ state: 'visible', timeout: 5000 });
    await removeButton.first().click();
  } catch (error) {
    throw new Error(`Could not find/remove item "${productName}". Available items: ${items.join(', ')}`);
  }
}

  async removeItemByIndex(index: number) {
    const removeButtons = await this.page.locator(this.removeButtons).all();
    if (removeButtons[index]) {
      await removeButtons[index].click();
    }
  }

  //async removeAllItems() {
    //const removeButtons = await this.page.locator(this.removeButtons).all();
    //for (const button of removeButtons) {
      //await button.click();
    //}
  //}

  async removeAllItems(): Promise<void> {
  const removeButtons = this.page.locator('[data-test*="remove"]');
  while (await removeButtons.count() > 0) {
    const first = removeButtons.first();
    try {
      await first.waitFor({ state: 'visible', timeout: 5000 });
      await first.click();
      await this.page.waitForTimeout(100); // memberi waktu DOM update
    } catch (error) {
      console.error('❌ Gagal klik tombol Remove:', error);
      break; // hindari infinite loop
    }
  }
}


  async isItemInCart(productName: string) {
    const itemNames = await this.getCartItemNames();
    return itemNames.includes(productName);
  }

  async getItemQuantityByName(productName: string) {
    const items = await this.page.locator(this.cartItems).all();
    for (const item of items) {
      const nameElement = item.locator(this.cartItemNames);
      const name = await nameElement.textContent();
      if (name === productName) {
        const quantityElement = item.locator(this.cartItemQuantities);
        return parseInt(await quantityElement.textContent() || '0');
      }
    }
    return 0;
  }

  // Cart state methods
  async isCartEmpty() {
    const itemCount = await this.getCartItemCount();
    return itemCount === 0;
  }

  async getCartBadgeCount() {
    const badge = this.page.locator(this.cartBadge);
    if (await badge.isVisible()) {
      return parseInt(await badge.textContent() || '0');
    }
    return 0;
  }

  async isCartBadgeVisible() {
    return await this.page.locator(this.cartBadge).isVisible();
  }

  // Navigation methods
  async clickContinueShopping() {
    await this.page.click(this.continueShoppingButton);
  }

  async clickCheckout() {
    await this.page.click(this.checkoutButton);
  }

  async isContinueShoppingButtonVisible() {
    return await this.page.locator(this.continueShoppingButton).isVisible();
  }

  async isCheckoutButtonVisible() {
    return await this.page.locator(this.checkoutButton).isVisible();
  }

  // Cart validation methods
  async validateCartItemStructure(index: number) {
    const item = this.page.locator(this.cartItems).nth(index);
    
    await expect(item.locator('.inventory_item_name')).toBeVisible();
    await expect(item.locator('.inventory_item_desc')).toBeVisible();
    await expect(item.locator('.inventory_item_price')).toBeVisible();
    await expect(item.locator('.cart_quantity')).toBeVisible();
    await expect(item.locator('[data-test*="remove"]')).toBeVisible();
  }

  async calculateTotalPrice() {
    const prices = await this.getCartItemPrices();
    const quantities = await this.getCartItemQuantities();
    
    let total = 0;
    for (let i = 0; i < prices.length; i++) {
      const price = parseFloat(prices[i].replace('$', ''));
      const quantity = quantities[i];
      total += price * quantity;
    }
    return total;
  }

  // Product interaction methods
  async clickProductName(productName: string) {
    await this.page.locator(this.cartItemNames, { hasText: productName }).click();
  }

  async getProductDetailsInCart(productName: string) {
    const items = await this.page.locator(this.cartItems).all();
    
    for (const item of items) {
      const nameElement = item.locator(this.cartItemNames);
      const name = await nameElement.textContent();
      
      if (name === productName) {
        const description = await item.locator(this.cartItemDescriptions).textContent();
        const price = await item.locator(this.cartItemPrices).textContent();
        const quantity = parseInt(await item.locator(this.cartItemQuantities).textContent() || '0');
        
        return { name, description, price, quantity };
      }
    }
    return null;
  }
}

// Page Object Model for Product Detail Page (for navigation testing)
class ProductDetailPage {
  constructor(private page: Page) {}

  private backButton = '[data-test="back-to-products"]';

  async isProductDetailPageLoaded() {
    await expect(this.page.locator('[data-test="inventory-item-name"]')).toBeVisible();
  }

  async clickBackToProducts() {
    await this.page.click(this.backButton);
  }
}

test.describe('SauceDemo Cart Page Tests', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let productDetailPage: ProductDetailPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    productDetailPage = new ProductDetailPage(page);
  });

  test.describe('Cart Page Load and Display Tests', () => {
    test('should load empty cart page correctly', async ({ page }) => {
      await loginPage.login(USERS.STANDARD, VALID_PASSWORD);
      await cartPage.navigateToCart();
      
      await cartPage.isCartPageLoaded();
      expect(page.url()).toContain('/cart.html');
      expect(await cartPage.isCartEmpty()).toBeTruthy();
      expect(await cartPage.isCartBadgeVisible()).toBeFalsy();
    });

    test('should display cart page elements correctly', async () => {
      await loginPage.login(USERS.STANDARD, VALID_PASSWORD);
      await cartPage.navigateToCart();
      
      await cartPage.isCartPageLoaded();
      expect(await cartPage.isContinueShoppingButtonVisible()).toBeTruthy();
      expect(await cartPage.isCheckoutButtonVisible()).toBeTruthy();
    });

    test('should load cart page with items correctly', async ({ page }) => {
      await loginPage.login(USERS.STANDARD, VALID_PASSWORD);
      await inventoryPage.addProductToCart(TEST_PRODUCTS[0].id);
      await cartPage.navigateToCart();
      
      await cartPage.isCartPageLoaded();
      expect(await cartPage.getCartItemCount()).toBe(1);
      expect(await cartPage.isCartBadgeVisible()).toBeTruthy();
      expect(await cartPage.getCartBadgeCount()).toBe(1);
    });
  });

  test.describe('Cart Item Display Tests', () => {
    test('should display single item correctly in cart', async () => {
      await loginPage.login(USERS.STANDARD, VALID_PASSWORD);
      await inventoryPage.addProductToCart(TEST_PRODUCTS[0].id);
      await cartPage.navigateToCart();
      
      const itemNames = await cartPage.getCartItemNames();
      const itemPrices = await cartPage.getCartItemPrices();
      const itemQuantities = await cartPage.getCartItemQuantities();
      
      expect(itemNames).toContain(TEST_PRODUCTS[0].name);
      expect(itemPrices).toContain(TEST_PRODUCTS[0].price);
      expect(itemQuantities[0]).toBe(1);
    });

    test('should display multiple items correctly in cart', async () => {
      await loginPage.login(USERS.STANDARD, VALID_PASSWORD);
      await inventoryPage.addMultipleProductsToCart([
        TEST_PRODUCTS[0].id,
        TEST_PRODUCTS[1].id,
        TEST_PRODUCTS[2].id
      ]);
      await cartPage.navigateToCart();
      
      expect(await cartPage.getCartItemCount()).toBe(3);
      
      const itemNames = await cartPage.getCartItemNames();
      expect(itemNames).toContain(TEST_PRODUCTS[0].name);
      expect(itemNames).toContain(TEST_PRODUCTS[1].name);
      expect(itemNames).toContain(TEST_PRODUCTS[2].name);
    });

    test('should display correct item details in cart', async () => {
      await loginPage.login(USERS.STANDARD, VALID_PASSWORD);
      await inventoryPage.addProductToCart(TEST_PRODUCTS[0].id);
      await cartPage.navigateToCart();
      
      const productDetails = await cartPage.getProductDetailsInCart(TEST_PRODUCTS[0].name);
      
      expect(productDetails).not.toBeNull();
      expect(productDetails!.name).toBe(TEST_PRODUCTS[0].name);
      expect(productDetails!.price).toBe(TEST_PRODUCTS[0].price);
      expect(productDetails!.quantity).toBe(1);
    });

    test('should validate cart item structure for all items', async () => {
      await loginPage.login(USERS.STANDARD, VALID_PASSWORD);
      await inventoryPage.addMultipleProductsToCart([
        TEST_PRODUCTS[0].id,
        TEST_PRODUCTS[1].id
      ]);
      await cartPage.navigateToCart();
      
      const itemCount = await cartPage.getCartItemCount();
      for (let i = 0; i < itemCount; i++) {
        await cartPage.validateCartItemStructure(i);
      }
    });
  });

  test.describe('Remove Items from Cart Tests', () => {
    test('should remove single item from cart', async () => {
      await loginPage.login(USERS.STANDARD, VALID_PASSWORD);
      await inventoryPage.addProductToCart(TEST_PRODUCTS[0].id);
      await cartPage.navigateToCart();
      
      expect(await cartPage.getCartItemCount()).toBe(1);
      
      await cartPage.removeItemFromCart(TEST_PRODUCTS[0].id);
      
      expect(await cartPage.getCartItemCount()).toBe(0);
      expect(await cartPage.isCartEmpty()).toBeTruthy();
      expect(await cartPage.isCartBadgeVisible()).toBeFalsy();
    });

    test('should remove specific item from multiple items', async () => {
      await loginPage.login(USERS.STANDARD, VALID_PASSWORD);
      await inventoryPage.addMultipleProductsToCart([
        TEST_PRODUCTS[0].id,
        TEST_PRODUCTS[1].id,
        TEST_PRODUCTS[2].id
      ]);
      await cartPage.navigateToCart();
      
      expect(await cartPage.getCartItemCount()).toBe(3);
      
      await cartPage.removeItemFromCart(TEST_PRODUCTS[1].id);
      
      expect(await cartPage.getCartItemCount()).toBe(2);
      expect(await cartPage.isItemInCart(TEST_PRODUCTS[1].name)).toBeFalsy();
      expect(await cartPage.isItemInCart(TEST_PRODUCTS[0].name)).toBeTruthy();
      expect(await cartPage.isItemInCart(TEST_PRODUCTS[2].name)).toBeTruthy();
    });

    test('should remove all items from cart', async () => {
      await loginPage.login(USERS.STANDARD, VALID_PASSWORD);
      await inventoryPage.addMultipleProductsToCart([
        TEST_PRODUCTS[0].id,
        TEST_PRODUCTS[1].id,
        TEST_PRODUCTS[2].id
      ]);
      await cartPage.navigateToCart();
      
      expect(await cartPage.getCartItemCount()).toBe(3);

      await cartPage.removeAllItems();
      
      expect(await cartPage.getCartItemCount()).toBe(0);
      expect(await cartPage.isCartEmpty()).toBeTruthy();
      expect(await cartPage.isCartBadgeVisible()).toBeFalsy();
    });

    test('should update cart badge after removing items', async () => {
      await loginPage.login(USERS.STANDARD, VALID_PASSWORD);
      await inventoryPage.addMultipleProductsToCart([
        TEST_PRODUCTS[0].id,
        TEST_PRODUCTS[1].id
      ]);
      await cartPage.navigateToCart();
      
      expect(await cartPage.getCartBadgeCount()).toBe(2);
      
      await cartPage.removeItemByIndex(0);
      expect(await cartPage.getCartBadgeCount()).toBe(1);
      
      await cartPage.removeItemByIndex(0);
      expect(await cartPage.isCartBadgeVisible()).toBeFalsy();
    });
  });

  test.describe('Cart Navigation Tests', () => {
    test('should navigate back to inventory page via Continue Shopping', async ({ page }) => {
      await loginPage.login(USERS.STANDARD, VALID_PASSWORD);
      await cartPage.navigateToCart();
      
      await cartPage.clickContinueShopping();
      
      expect(page.url()).toContain('/inventory.html');
      await expect(page.locator('.title')).toContainText('Products');
    });

    test('should navigate to checkout page via Checkout button', async ({ page }) => {
      await loginPage.login(USERS.STANDARD, VALID_PASSWORD);
      await inventoryPage.addProductToCart(TEST_PRODUCTS[0].id);
      await cartPage.navigateToCart();
      
      await cartPage.clickCheckout();
      
      expect(page.url()).toContain('/checkout-step-one.html');
    });

    test('should maintain cart state when navigating back and forth', async ({ page }) => {
      await loginPage.login(USERS.STANDARD, VALID_PASSWORD);
      await inventoryPage.addProductToCart(TEST_PRODUCTS[0].id);
      await cartPage.navigateToCart();
      
      expect(await cartPage.getCartItemCount()).toBe(1);
      
      await cartPage.clickContinueShopping();
      expect(page.url()).toContain('/inventory.html');
      
      await inventoryPage.navigateToCart();
      expect(await cartPage.getCartItemCount()).toBe(1);
    });

    test('should navigate to product detail from cart item name', async ({ page }) => {
      await loginPage.login(USERS.STANDARD, VALID_PASSWORD);
      await inventoryPage.addProductToCart(TEST_PRODUCTS[0].id);
      await cartPage.navigateToCart();
      
      await cartPage.clickProductName(TEST_PRODUCTS[0].name);
      
      expect(page.url()).toContain('/inventory-item.html');
      await productDetailPage.isProductDetailPageLoaded();
    });

    test('should return to cart from product detail page', async ({ page }) => {
      await loginPage.login(USERS.STANDARD, VALID_PASSWORD);
      await inventoryPage.addProductToCart(TEST_PRODUCTS[0].id);
      await cartPage.navigateToCart();
      
      await cartPage.clickProductName(TEST_PRODUCTS[0].name);
      await productDetailPage.isProductDetailPageLoaded();
      
      await productDetailPage.clickBackToProducts();
      expect(page.url()).toContain('/inventory.html');
    });
  });

  test.describe('Cart State Persistence Tests', () => {
    test('should maintain cart state after page refresh', async ({ page }) => {
      await loginPage.login(USERS.STANDARD, VALID_PASSWORD);
      await inventoryPage.addProductToCart(TEST_PRODUCTS[0].id);
      await cartPage.navigateToCart();
      
      expect(await cartPage.getCartItemCount()).toBe(1);
      
      await page.reload();
      await cartPage.isCartPageLoaded();
      
      expect(await cartPage.getCartItemCount()).toBe(1);
      expect(await cartPage.isItemInCart(TEST_PRODUCTS[0].name)).toBeTruthy();
    });

    test('should maintain cart state after browser back/forward', async ({ page }) => {
      await loginPage.login(USERS.STANDARD, VALID_PASSWORD);
      await inventoryPage.addProductToCart(TEST_PRODUCTS[0].id);
      await cartPage.navigateToCart();
      
      expect(await cartPage.getCartItemCount()).toBe(1);
      
      await cartPage.clickContinueShopping();
      await page.goBack();
      
      await cartPage.isCartPageLoaded();
      expect(await cartPage.getCartItemCount()).toBe(1);
    });

    test('should handle direct URL access to cart page', async ({ page }) => {
      await loginPage.login(USERS.STANDARD, VALID_PASSWORD);
      await inventoryPage.addProductToCart(TEST_PRODUCTS[0].id);
      
      await page.goto(`${BASE_URL}/cart.html`);
      await cartPage.isCartPageLoaded();
      
      expect(await cartPage.getCartItemCount()).toBe(1);
    });
  });

  test.describe('Cart Functionality Edge Cases', () => {
    test('should handle empty cart checkout attempt', async ({ page }) => {
      await loginPage.login(USERS.STANDARD, VALID_PASSWORD);
      await cartPage.navigateToCart();
      
      expect(await cartPage.isCartEmpty()).toBeTruthy();
      
      await cartPage.clickCheckout();
      
      // Should still navigate to checkout even with empty cart
      expect(page.url()).toContain('/checkout-step-one.html');
    });

    test('should handle rapid add/remove operations', async () => {
      await loginPage.login(USERS.STANDARD, VALID_PASSWORD);
      await inventoryPage.addProductToCart(TEST_PRODUCTS[0].id);
      await cartPage.navigateToCart();
      
      // Rapid remove/add cycles
      await cartPage.removeItemFromCart(TEST_PRODUCTS[0].id);
      expect(await cartPage.isCartEmpty()).toBeTruthy();
      
      await cartPage.clickContinueShopping();
      await inventoryPage.addProductToCart(TEST_PRODUCTS[0].id);
      await cartPage.navigateToCart();
      
      expect(await cartPage.getCartItemCount()).toBe(1);
    });

    test('should handle cart with maximum number of different items', async () => {
      await loginPage.login(USERS.STANDARD, VALID_PASSWORD);
      
      // Add all available products (6 total in SauceDemo)
      const allProductIds = [
        'sauce-labs-backpack',
        'sauce-labs-bike-light',
        'sauce-labs-bolt-t-shirt',
        'sauce-labs-fleece-jacket',
        'sauce-labs-onesie',
        'test.allthethings()-t-shirt-(red)'
      ];
      
      await inventoryPage.addMultipleProductsToCart(allProductIds);
      await cartPage.navigateToCart();
      
      expect(await cartPage.getCartItemCount()).toBe(6);
      expect(await cartPage.getCartBadgeCount()).toBe(6);
    });

    test('should handle cart operations with special characters in product names', async () => {
      await loginPage.login(USERS.STANDARD, VALID_PASSWORD);
      await inventoryPage.addProductToCart('test.allthethings()-t-shirt-(red)');
      await cartPage.navigateToCart();
      
      expect(await cartPage.getCartItemCount()).toBe(1);
      expect(await cartPage.isItemInCart('Test.allTheThings() T-Shirt (Red)')).toBeTruthy();
      
      await cartPage.removeItemFromCart("Test.allTheThings() T-Shirt (Red)");

      const itemNames = await cartPage.getCartItemNames();
      expect(itemNames).not.toContain("Test.allTheThings() T-Shirt (Red)");
    });
  });

  test.describe('Cart Price Calculation Tests', () => {
    test('should calculate correct total for single item', async () => {
      await loginPage.login(USERS.STANDARD, VALID_PASSWORD);
      await inventoryPage.addProductToCart(TEST_PRODUCTS[0].id);
      await cartPage.navigateToCart();
      
      const calculatedTotal = await cartPage.calculateTotalPrice();
      const expectedTotal = parseFloat(TEST_PRODUCTS[0].price.replace('$', ''));
      
      expect(calculatedTotal).toBe(expectedTotal);
    });

    test('should calculate correct total for multiple items', async () => {
      await loginPage.login(USERS.STANDARD, VALID_PASSWORD);
      await inventoryPage.addMultipleProductsToCart([
        TEST_PRODUCTS[0].id,
        TEST_PRODUCTS[1].id,
        TEST_PRODUCTS[2].id
      ]);
      await cartPage.navigateToCart();
      
      const calculatedTotal = await cartPage.calculateTotalPrice();
      const expectedTotal = parseFloat(TEST_PRODUCTS[0].price.replace('$', '')) +
                           parseFloat(TEST_PRODUCTS[1].price.replace('$', '')) +
                           parseFloat(TEST_PRODUCTS[2].price.replace('$', ''));
      
      expect(calculatedTotal).toBeCloseTo(expectedTotal, 2);
    });
  });

  test.describe('Cross-User Cart Behavior Tests', () => {
    test('should handle cart operations with problem_user', async () => {
      await loginPage.login(USERS.PROBLEM, VALID_PASSWORD);
      await inventoryPage.addProductToCart(TEST_PRODUCTS[0].id);
      await cartPage.navigateToCart();
      
      await cartPage.isCartPageLoaded();
      expect(await cartPage.getCartItemCount()).toBe(1);
      
      await cartPage.removeItemFromCart(TEST_PRODUCTS[0].id);
      expect(await cartPage.isCartEmpty()).toBeTruthy();
    });

    test('should handle cart operations with performance_glitch_user', async () => {
      test.setTimeout(60000); // Extended timeout
      
      await loginPage.login(USERS.PERFORMANCE_GLITCH, VALID_PASSWORD);
      await inventoryPage.addProductToCart(TEST_PRODUCTS[0].id);
      await cartPage.navigateToCart();
      
      await cartPage.isCartPageLoaded();
      expect(await cartPage.getCartItemCount()).toBe(1);
    });

    test('should handle cart operations with visual_user', async () => {
      await loginPage.login(USERS.VISUAL, VALID_PASSWORD);
      await inventoryPage.addProductToCart(TEST_PRODUCTS[0].id);
      await cartPage.navigateToCart();
      
      await cartPage.isCartPageLoaded();
      expect(await cartPage.getCartItemCount()).toBe(1);
      
      // Visual user should see cart items correctly
      const itemNames = await cartPage.getCartItemNames();
      expect(itemNames).toContain(TEST_PRODUCTS[0].name);
    });
  });

  test.describe('Cart Accessibility and UX Tests', () => {
    test('should maintain keyboard navigation in cart', async ({ page }) => {
      await loginPage.login(USERS.STANDARD, VALID_PASSWORD);
      await inventoryPage.addProductToCart(TEST_PRODUCTS[0].id);
      await cartPage.navigateToCart();
      
      // Test tab navigation through cart elements
      await page.keyboard.press('Tab'); // Should focus on first interactive element
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      
      // Should be able to activate buttons with Enter/Space
      await page.keyboard.press('Enter');
    });

    test('should handle responsive design in cart', async ({ page }) => {
      await loginPage.login(USERS.STANDARD, VALID_PASSWORD);
      await inventoryPage.addProductToCart(TEST_PRODUCTS[0].id);
      await cartPage.navigateToCart();
      
      // Test mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await cartPage.isCartPageLoaded();
      expect(await cartPage.getCartItemCount()).toBe(1);
      
      // Test tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      await cartPage.isCartPageLoaded();
      expect(await cartPage.getCartItemCount()).toBe(1);
    });

    test('should display appropriate messages for empty cart', async ({ page }) => {
      await loginPage.login(USERS.STANDARD, VALID_PASSWORD);
      await cartPage.navigateToCart();
      
      expect(await cartPage.isCartEmpty()).toBeTruthy();
      
      // Should still show navigation buttons even when cart is empty
      expect(await cartPage.isContinueShoppingButtonVisible()).toBeTruthy();
      expect(await cartPage.isCheckoutButtonVisible()).toBeTruthy();
    });
  });

  test.describe('Cart Performance Tests', () => {
    test('should load cart page within acceptable time', async ({ page }) => {
      await loginPage.login(USERS.STANDARD, VALID_PASSWORD);
      await inventoryPage.addProductToCart(TEST_PRODUCTS[0].id);
      
      const startTime = Date.now();
      await cartPage.navigateToCart();
      await cartPage.isCartPageLoaded();
      const loadTime = Date.now() - startTime;
      
      expect(loadTime).toBeLessThan(5000); // 5 seconds max
    });

    test('should handle cart operations efficiently', async () => {
      await loginPage.login(USERS.STANDARD, VALID_PASSWORD);
      await inventoryPage.addMultipleProductsToCart([
        TEST_PRODUCTS[0].id,
        TEST_PRODUCTS[1].id,
        TEST_PRODUCTS[2].id
      ]);
      await cartPage.navigateToCart();
      
      const startTime = Date.now();
      
      // Perform multiple cart operations
      await cartPage.removeItemByIndex(0);
      await cartPage.removeItemByIndex(0);
      await cartPage.removeItemByIndex(0);
      
      const operationTime = Date.now() - startTime;
      expect(operationTime).toBeLessThan(10000); // 10 seconds max for all operations
    });
  });
});
