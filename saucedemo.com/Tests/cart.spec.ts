// cart.pages.ts - Page Object Model for Sauce Demo Cart Page
// This file contains page objects and selectors for automated testing

export class CartPage {
  // Page URL
  static readonly URL = 'https://www.saucedemo.com/cart.html';

  // Header elements
  static readonly HEADER_TITLE = '[data-test="title"]';
  static readonly SHOPPING_CART_BADGE = '[data-test="shopping-cart-badge"]';
  static readonly SHOPPING_CART_LINK = '[data-test="shopping-cart-link"]';
  static readonly HAMBURGER_MENU = '#react-burger-menu-btn';

  // Cart content selectors
  static readonly CART_LIST = '[data-test="cart-list"]';
  static readonly CART_ITEM = '[data-test="cart-item"]';
  static readonly CART_ITEM_LABEL = '[data-test="cart-item-label"]';
  static readonly INVENTORY_ITEM_NAME = '[data-test="inventory-item-name"]';
  static readonly INVENTORY_ITEM_DESC = '[data-test="inventory-item-desc"]';
  static readonly INVENTORY_ITEM_PRICE = '[data-test="inventory-item-price"]';
  static readonly CART_QUANTITY = '[data-test="cart-quantity"]';
  static readonly CART_QUANTITY_LABEL = '[data-test="cart-quantity-label"]';

  // Action buttons
  static readonly CONTINUE_SHOPPING_BUTTON = '[data-test="continue-shopping"]';
  static readonly CHECKOUT_BUTTON = '[data-test="checkout"]';
  static readonly REMOVE_BUTTON = '[data-test*="remove-"]';

  // Specific remove buttons for items
  static readonly REMOVE_SAUCE_LABS_BACKPACK = '[data-test="remove-sauce-labs-backpack"]';
  static readonly REMOVE_SAUCE_LABS_BIKE_LIGHT = '[data-test="remove-sauce-labs-bike-light"]';
  static readonly REMOVE_SAUCE_LABS_BOLT_TSHIRT = '[data-test="remove-sauce-labs-bolt-t-shirt"]';
  static readonly REMOVE_SAUCE_LABS_FLEECE_JACKET = '[data-test="remove-sauce-labs-fleece-jacket"]';
  static readonly REMOVE_SAUCE_LABS_ONESIE = '[data-test="remove-sauce-labs-onesie"]';
  static readonly REMOVE_TEST_ALLTHETHINGS_TSHIRT = '[data-test="remove-test.allthethings()-t-shirt-(red)"]';

  // Footer elements
  static readonly FOOTER = '[data-test="footer"]';
  static readonly FOOTER_COPY = '[data-test="footer-copy"]';
  static readonly SOCIAL_TWITTER = '[data-test="social-twitter"]';
  static readonly SOCIAL_FACEBOOK = '[data-test="social-facebook"]';
  static readonly SOCIAL_LINKEDIN = '[data-test="social-linkedin"]';

  // Page methods for interactions
  async navigateToCart(): Promise<void> {
    await page.goto(CartPage.URL);
  }

  async clickContinueShopping(): Promise<void> {
    await page.click(CartPage.CONTINUE_SHOPPING_BUTTON);
  }

  async clickCheckout(): Promise<void> {
    await page.click(CartPage.CHECKOUT_BUTTON);
  }

  async removeItem(itemName: string): Promise<void> {
    const removeSelector = `[data-test="remove-${itemName.toLowerCase().replace(/\s+/g, '-')}"]`;
    await page.click(removeSelector);
  }

  async getCartItemCount(): Promise<number> {
    const items = await page.$$(CartPage.CART_ITEM);
    return items.length;
  }

  async getCartItems(): Promise<CartItem[]> {
    const items = await page.$$(CartPage.CART_ITEM);
    const cartItems: CartItem[] = [];

    for (const item of items) {
      const name = await item.$eval(CartPage.INVENTORY_ITEM_NAME, el => el.textContent?.trim() || '');
      const description = await item.$eval(CartPage.INVENTORY_ITEM_DESC, el => el.textContent?.trim() || '');
      const price = await item.$eval(CartPage.INVENTORY_ITEM_PRICE, el => el.textContent?.trim() || '');
      const quantity = await item.$eval(CartPage.CART_QUANTITY, el => el.textContent?.trim() || '1');

      cartItems.push({
        name,
        description,
        price,
        quantity: parseInt(quantity)
      });
    }

    return cartItems;
  }

  async isCartEmpty(): Promise<boolean> {
    const itemCount = await this.getCartItemCount();
    return itemCount === 0;
  }

  async getCartBadgeCount(): Promise<number> {
    try {
      const badgeText = await page.textContent(CartPage.SHOPPING_CART_BADGE);
      return badgeText ? parseInt(badgeText) : 0;
    } catch {
      return 0; // Badge not present when cart is empty
    }
  }

  async waitForPageLoad(): Promise<void> {
    await page.waitForSelector(CartPage.HEADER_TITLE);
    await page.waitForSelector(CartPage.CONTINUE_SHOPPING_BUTTON);
    await page.waitForSelector(CartPage.CHECKOUT_BUTTON);
  }

  async getPageTitle(): Promise<string> {
    return await page.textContent(CartPage.HEADER_TITLE) || '';
  }
}

// Interface for cart item data
export interface CartItem {
  name: string;
  description: string;
  price: string;
  quantity: number;
}

// Alternative page object using CSS selectors (if data-test attributes are not available)
export class CartPageCSS {
  // Alternative selectors using CSS classes and IDs
  static readonly HEADER_TITLE = '.header_secondary_container .title';
  static readonly SHOPPING_CART_BADGE = '.shopping_cart_badge';
  static readonly SHOPPING_CART_LINK = '.shopping_cart_link';
  static readonly HAMBURGER_MENU = '#react-burger-menu-btn';

  // Cart content
  static readonly CART_LIST = '.cart_list';
  static readonly CART_ITEM = '.cart_item';
  static readonly INVENTORY_ITEM_NAME = '.inventory_item_name';
  static readonly INVENTORY_ITEM_DESC = '.inventory_item_desc';
  static readonly INVENTORY_ITEM_PRICE = '.inventory_item_price';
  static readonly CART_QUANTITY = '.cart_quantity';

  // Buttons
  static readonly CONTINUE_SHOPPING_BUTTON = '#continue-shopping';
  static readonly CHECKOUT_BUTTON = '#checkout';
  static readonly REMOVE_BUTTON = '[class*="btn_secondary cart_button"]';

  // Footer
  static readonly FOOTER = '.footer';
  static readonly FOOTER_COPY = '.footer_copy';
}

// Utility functions for cart operations
export class CartUtils {
  static async addItemToCart(itemName: string): Promise<void> {
    const addToCartSelector = `[data-test="add-to-cart-${itemName.toLowerCase().replace(/\s+/g, '-')}"]`;
    await page.click(addToCartSelector);
  }

  static async removeItemFromCart(itemName: string): Promise<void> {
    const removeSelector = `[data-test="remove-${itemName.toLowerCase().replace(/\s+/g, '-')}"]`;
    await page.click(removeSelector);
  }

  static async getTotalPrice(): Promise<string> {
    // This would be on checkout page, but useful for cart calculations
    try {
      return await page.textContent('.summary_total_label') || '0';
    } catch {
      return '0';
    }
  }

  static async validateCartContainsItem(itemName: string): Promise<boolean> {
    const items = await page.$$(CartPage.INVENTORY_ITEM_NAME);
    for (const item of items) {
      const text = await item.textContent();
      if (text?.includes(itemName)) {
        return true;
      }
    }
    return false;
  }
}

// Constants for common item names (for easier reference in tests)
export const ITEMS = {
  BACKPACK: 'sauce-labs-backpack',
  BIKE_LIGHT: 'sauce-labs-bike-light',
  BOLT_TSHIRT: 'sauce-labs-bolt-t-shirt',
  FLEECE_JACKET: 'sauce-labs-fleece-jacket',
  ONESIE: 'sauce-labs-onesie',
  RED_TSHIRT: 'test.allthethings()-t-shirt-(red)'
} as const;

// Export default cart page instance
export default new CartPage();

// Data-driven test suite continuation
test.describe('Data-Driven Cart Tests', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    
    // Navigate to login page and authenticate
    await loginPage.navigateToLogin();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.waitForPageLoad();
  });

  // Test data for different cart scenarios
  const cartTestData = [
    {
      testName: 'Single Item Cart',
      items: ['Sauce Labs Backpack'],
      expectedCount: 1,
      expectedTotal: '$29.99'
    },
    {
      testName: 'Multiple Items Cart',
      items: ['Sauce Labs Backpack', 'Sauce Labs Bike Light', 'Sauce Labs Bolt T-Shirt'],
      expectedCount: 3,
      expectedTotal: '$55.97'
    },
    {
      testName: 'All Items Cart',
      items: [
        'Sauce Labs Backpack',
        'Sauce Labs Bike Light', 
        'Sauce Labs Bolt T-Shirt',
        'Sauce Labs Fleece Jacket',
        'Sauce Labs Onesie',
        'Test.allTheThings() T-Shirt (Red)'
      ],
      expectedCount: 6,
      expectedTotal: '$129.94'
    },
    {
      testName: 'High Value Items Only',
      items: ['Sauce Labs Fleece Jacket', 'Sauce Labs Backpack'],
      expectedCount: 2,
      expectedTotal: '$79.98'
    }
  ];

  // User test data for different user scenarios
  const userTestData = [
    {
      username: 'standard_user',
      password: 'secret_sauce',
      description: 'Standard User'
    },
    {
      username: 'performance_glitch_user',
      password: 'secret_sauce',
      description: 'Performance Glitch User'
    },
    {
      username: 'problem_user',
      password: 'secret_sauce',
      description: 'Problem User'
    }
  ];

  // Data-driven test for adding items to cart
  cartTestData.forEach(({ testName, items, expectedCount, expectedTotal }) => {
    test(`${testName} - Add items and verify cart`, async ({ page }) => {
      // Add all items to cart
      for (const item of items) {
        await inventoryPage.addItemToCart(item);
      }

      // Navigate to cart
      await cartPage.navigateToCart();
      await cartPage.waitForPageLoad();

      // Verify cart count
      const actualCount = await cartPage.getCartItemCount();
      expect(actualCount).toBe(expectedCount);

      // Verify cart badge
      const badgeCount = await cartPage.getCartBadgeCount();
      expect(badgeCount).toBe(expectedCount);

      // Verify all items are present
      const cartItems = await cartPage.getCartItems();
      expect(cartItems).toHaveLength(expectedCount);

      // Verify each item is in cart
      for (const item of items) {
        const isItemPresent = await CartUtils.validateCartContainsItem(item);
        expect(isItemPresent).toBeTruthy();
      }
    });
  });

  // Data-driven test for different users
  userTestData.forEach(({ username, password, description }) => {
    test(`Cart functionality for ${description}`, async ({ page }) => {
      // Re-login with specific user
      await loginPage.logout();
      await loginPage.login(username, password);
      await inventoryPage.waitForPageLoad();

      // Add items to cart
      await inventoryPage.addItemToCart('Sauce Labs Backpack');
      await inventoryPage.addItemToCart('Sauce Labs Bike Light');

      // Navigate to cart
      await cartPage.navigateToCart();
      await cartPage.waitForPageLoad();

      // Verify cart functionality
      const itemCount = await cartPage.getCartItemCount();
      expect(itemCount).toBe(2);

      // Test remove functionality
      await cartPage.removeItem('sauce-labs-backpack');
      const updatedCount = await cartPage.getCartItemCount();
      expect(updatedCount).toBe(1);

      // Test continue shopping
      await cartPage.clickContinueShopping();
      expect(page.url()).toContain('inventory.html');
    });
  });

  // Remove items test data
  const removeItemsTestData = [
    {
      testName: 'Remove Single Item',
      itemsToAdd: ['Sauce Labs Backpack', 'Sauce Labs Bike Light'],
      itemsToRemove: ['Sauce Labs Backpack'],
      expectedFinalCount: 1
    },
    {
      testName: 'Remove Multiple Items',
      itemsToAdd: ['Sauce Labs Backpack', 'Sauce Labs Bike Light', 'Sauce Labs Bolt T-Shirt'],
      itemsToRemove: ['Sauce Labs Backpack', 'Sauce Labs Bike Light'],
      expectedFinalCount: 1
    },
    {
      testName: 'Remove All Items',
      itemsToAdd: ['Sauce Labs Backpack', 'Sauce Labs Bike Light'],
      itemsToRemove: ['Sauce Labs Backpack', 'Sauce Labs Bike Light'],
      expectedFinalCount: 0
    }
  ];

  // Data-driven remove items tests
  removeItemsTestData.forEach(({ testName, itemsToAdd, itemsToRemove, expectedFinalCount }) => {
    test(`${testName} from cart`, async ({ page }) => {
      // Add items to cart
      for (const item of itemsToAdd) {
        await inventoryPage.addItemToCart(item);
      }

      // Navigate to cart
      await cartPage.navigateToCart();
      await cartPage.waitForPageLoad();

      // Verify initial count
      const initialCount = await cartPage.getCartItemCount();
      expect(initialCount).toBe(itemsToAdd.length);

      // Remove specified items
      for (const item of itemsToRemove) {
        const itemKey = item.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '');
        await cartPage.removeItem(itemKey);
      }

      // Verify final count
      const finalCount = await cartPage.getCartItemCount();
      expect(finalCount).toBe(expectedFinalCount);

      // Verify cart badge
      if (expectedFinalCount === 0) {
        const isEmpty = await cartPage.isCartEmpty();
        expect(isEmpty).toBeTruthy();
      } else {
        const badgeCount = await cartPage.getCartBadgeCount();
        expect(badgeCount).toBe(expectedFinalCount);
      }
    });
  });

  // Checkout flow test data
  const checkoutTestData = [
    {
      items: ['Sauce Labs Backpack'],
      userInfo: {
        firstName: 'John',
        lastName: 'Doe',
        postalCode: '12345'
      }
    },
    {
      items: ['Sauce Labs Backpack', 'Sauce Labs Bike Light'],
      userInfo: {
        firstName: 'Jane',
        lastName: 'Smith',
        postalCode: '67890'
      }
    }
  ];

  // Data-driven checkout tests
  checkoutTestData.forEach(({ items, userInfo }, index) => {
    test(`Checkout flow ${index + 1} - ${items.length} item(s)`, async ({ page }) => {
      // Add items to cart
      for (const item of items) {
        await inventoryPage.addItemToCart(item);
      }

      // Navigate to cart and proceed to checkout
      await cartPage.navigateToCart();
      await cartPage.waitForPageLoad();
      await cartPage.clickCheckout();

      // Fill checkout information (assuming CheckoutPage exists)
      await page.fill('[data-test="firstName"]', userInfo.firstName);
      await page.fill('[data-test="lastName"]', userInfo.lastName);
      await page.fill('[data-test="postalCode"]', userInfo.postalCode);
      await page.click('[data-test="continue"]');

      // Verify checkout overview
      expect(page.url()).toContain('checkout-step-two.html');
      
      // Verify items in checkout summary
      const checkoutItems = await page.$(CartPage.CART_ITEM);
      expect(checkoutItems).toHaveLength(items.length);
    });
  });

  // Edge cases and error scenarios
  test('Empty cart checkout attempt', async ({ page }) => {
    await cartPage.navigateToCart();
    await cartPage.waitForPageLoad();
    
    const isEmpty = await cartPage.isCartEmpty();
    expect(isEmpty).toBeTruthy();
    
    // Checkout button should still be clickable but will show empty cart
    await cartPage.clickCheckout();
    expect(page.url()).toContain('checkout-step-one.html');
  });

  test('Cart persistence across page navigation', async ({ page }) => {
    // Add items to cart
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.addItemToCart('Sauce Labs Bike Light');
    
    // Navigate to different pages and back
    await cartPage.navigateToCart();
    await cartPage.clickContinueShopping();
    await cartPage.navigateToCart();
    
    // Verify items are still in cart
    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBe(2);
  });

  test('Cart badge updates correctly', async ({ page }) => {
    // Initially no badge
    let badgeCount = await cartPage.getCartBadgeCount();
    expect(badgeCount).toBe(0);
    
    // Add one item
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    badgeCount = await cartPage.getCartBadgeCount();
    expect(badgeCount).toBe(1);
    
    // Add another item
    await inventoryPage.addItemToCart('Sauce Labs Bike Light');
    badgeCount = await cartPage.getCartBadgeCount();
    expect(badgeCount).toBe(2);
    
    // Remove one item from cart page
    await cartPage.navigateToCart();
    await cartPage.removeItem('sauce-labs-backpack');
    badgeCount = await cartPage.getCartBadgeCount();
    expect(badgeCount).toBe(1);
  });

  test.afterEach(async ({ page }) => {
    // Clean up - remove all items from cart if any
    try {
      await cartPage.navigateToCart();
      const items = await page.$(CartPage.REMOVE_BUTTON);
      for (const item of items) {
        await item.click();
      }
    } catch (error) {
      // Cart might already be empty, ignore error
    }
  });
});
