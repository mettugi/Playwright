// Comprehensive Cart Test Scenarios for Sauce Demo
// Test URL: https://www.saucedemo.com/cart.html

import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { InventoryPage } from './pages/InventoryPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';

test.describe('Sauce Demo Cart Scenarios', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  // Test data for different products
  const products = {
    BACKPACK: {
      name: 'Sauce Labs Backpack',
      price: '$29.99',
      selector: 'sauce-labs-backpack'
    },
    BIKE_LIGHT: {
      name: 'Sauce Labs Bike Light',
      price: '$9.99',
      selector: 'sauce-labs-bike-light'
    },
    BOLT_SHIRT: {
      name: 'Sauce Labs Bolt T-Shirt',
      price: '$15.99',
      selector: 'sauce-labs-bolt-t-shirt'
    },
    FLEECE_JACKET: {
      name: 'Sauce Labs Fleece Jacket',
      price: '$49.99',
      selector: 'sauce-labs-fleece-jacket'
    },
    ONESIE: {
      name: 'Sauce Labs Onesie',
      price: '$7.99',
      selector: 'sauce-labs-onesie'
    },
    RED_SHIRT: {
      name: 'Test.allTheThings() T-Shirt (Red)',
      price: '$15.99',
      selector: 'test.allthethings()-t-shirt-(red)'
    }
  };

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    // Login with standard user
    await loginPage.navigateToLogin();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.waitForPageLoad();
  });

  test.describe('Cart Access and Navigation', () => {
    test('SC01: Navigate to cart from inventory page', async ({ page }) => {
      // Add item to cart first
      await inventoryPage.addItemToCart(products.BACKPACK.selector);
      
      // Navigate to cart via cart icon
      await page.click('[data-test="shopping-cart-link"]');
      
      // Verify we're on cart page
      expect(page.url()).toContain('/cart.html');
      await expect(page.locator('[data-test="title"]')).toHaveText('Your Cart');
    });

    test('SC02: Direct navigation to cart URL', async ({ page }) => {
      // Navigate directly to cart URL
      await page.goto('https://www.saucedemo.com/cart.html');
      
      // Verify cart page loads
      await expect(page.locator('[data-test="title"]')).toHaveText('Your Cart');
      await expect(page.locator('[data-test="continue-shopping"]')).toBeVisible();
      await expect(page.locator('[data-test="checkout"]')).toBeVisible();
    });

    test('SC03: Continue shopping button functionality', async ({ page }) => {
      await cartPage.navigateToCart();
      await cartPage.clickContinueShopping();
      
      // Verify navigation back to inventory
      expect(page.url()).toContain('/inventory.html');
      await expect(page.locator('[data-test="title"]')).toHaveText('Products');
    });
  });

  test.describe('Empty Cart Scenarios', () => {
    test('SC04: Empty cart display', async ({ page }) => {
      await cartPage.navigateToCart();
      
      // Verify empty cart state
      const isEmpty = await cartPage.isCartEmpty();
      expect(isEmpty).toBeTruthy();
      
      // Verify no cart badge is displayed
      const badgeCount = await cartPage.getCartBadgeCount();
      expect(badgeCount).toBe(0);
      
      // Verify checkout button is still present
      await expect(page.locator('[data-test="checkout"]')).toBeVisible();
    });

    test('SC05: Checkout with empty cart', async ({ page }) => {
      await cartPage.navigateToCart();
      await cartPage.clickCheckout();
      
      // Should navigate to checkout step one even with empty cart
      expect(page.url()).toContain('/checkout-step-one.html');
    });
  });

  test.describe('Single Item Cart Operations', () => {
    test('SC06: Add single item to cart', async ({ page }) => {
      // Add item from inventory
      await inventoryPage.addItemToCart(products.BACKPACK.selector);
      
      // Navigate to cart
      await cartPage.navigateToCart();
      
      // Verify item is in cart
      const cartItems = await cartPage.getCartItems();
      expect(cartItems).toHaveLength(1);
      expect(cartItems[0].name).toBe(products.BACKPACK.name);
      expect(cartItems[0].price).toBe(products.BACKPACK.price);
      
      // Verify cart badge
      const badgeCount = await cartPage.getCartBadgeCount();
      expect(badgeCount).toBe(1);
    });

    test('SC07: Remove single item from cart', async ({ page }) => {
      // Add item and navigate to cart
      await inventoryPage.addItemToCart(products.BACKPACK.selector);
      await cartPage.navigateToCart();
      
      // Remove item
      await cartPage.removeItem(products.BACKPACK.selector);
      
      // Verify cart is empty
      const isEmpty = await cartPage.isCartEmpty();
      expect(isEmpty).toBeTruthy();
      
      // Verify cart badge disappears
      const badgeCount = await cartPage.getCartBadgeCount();
      expect(badgeCount).toBe(0);
    });

    test('SC08: Single item quantity verification', async ({ page }) => {
      await inventoryPage.addItemToCart(products.BACKPACK.selector);
      await cartPage.navigateToCart();
      
      // Verify quantity is 1 (default)
      const cartItems = await cartPage.getCartItems();
      expect(cartItems[0].quantity).toBe(1);
      
      // Verify quantity label is displayed
      await expect(page.locator('[data-test="cart-quantity-label"]')).toContainText('QTY');
    });
  });

  test.describe('Multiple Items Cart Operations', () => {
    test('SC09: Add multiple different items', async ({ page }) => {
      const itemsToAdd = [products.BACKPACK, products.BIKE_LIGHT, products.BOLT_SHIRT];
      
      // Add multiple items
      for (const item of itemsToAdd) {
        await inventoryPage.addItemToCart(item.selector);
      }
      
      await cartPage.navigateToCart();
      
      // Verify all items are in cart
      const cartItems = await cartPage.getCartItems();
      expect(cartItems).toHaveLength(3);
      
      // Verify cart badge shows correct count
      const badgeCount = await cartPage.getCartBadgeCount();
      expect(badgeCount).toBe(3);
      
      // Verify each item is present
      for (const item of itemsToAdd) {
        const isPresent = await CartUtils.validateCartContainsItem(item.name);
        expect(isPresent).toBeTruthy();
      }
    });

    test('SC10: Remove specific item from multiple items', async ({ page }) => {
      // Add three items
      await inventoryPage.addItemToCart(products.BACKPACK.selector);
      await inventoryPage.addItemToCart(products.BIKE_LIGHT.selector);
      await inventoryPage.addItemToCart(products.BOLT_SHIRT.selector);
      
      await cartPage.navigateToCart();
      
      // Remove middle item
      await cartPage.removeItem(products.BIKE_LIGHT.selector);
      
      // Verify correct items remain
      const cartItems = await cartPage.getCartItems();
      expect(cartItems).toHaveLength(2);
      
      const itemNames = cartItems.map(item => item.name);
      expect(itemNames).toContain(products.BACKPACK.name);
      expect(itemNames).toContain(products.BOLT_SHIRT.name);
      expect(itemNames).not.toContain(products.BIKE_LIGHT.name);
    });

    test('SC11: Remove all items one by one', async ({ page }) => {
      const itemsToAdd = [products.BACKPACK, products.BIKE_LIGHT, products.BOLT_SHIRT];
      
      // Add items
      for (const item of itemsToAdd) {
        await inventoryPage.addItemToCart(item.selector);
      }
      
      await cartPage.navigateToCart();
      
      // Remove items one by one
      for (const item of itemsToAdd) {
        await cartPage.removeItem(item.selector);
        
        // Verify count decreases
        const remainingCount = await cartPage.getCartItemCount();
        const expectedCount = itemsToAdd.length - (itemsToAdd.indexOf(item) + 1);
        expect(remainingCount).toBe(expectedCount);
      }
      
      // Verify cart is finally empty
      const isEmpty = await cartPage.isCartEmpty();
      expect(isEmpty).toBeTruthy();
    });
  });

  test.describe('Cart Badge and Counter Tests', () => {
    test('SC12: Cart badge updates correctly', async ({ page }) => {
      // Initially no badge
      let badgeCount = await cartPage.getCartBadgeCount();
      expect(badgeCount).toBe(0);
      
      // Add first item
      await inventoryPage.addItemToCart(products.BACKPACK.selector);
      badgeCount = await cartPage.getCartBadgeCount();
      expect(badgeCount).toBe(1);
      
      // Add second item
      await inventoryPage.addItemToCart(products.BIKE_LIGHT.selector);
      badgeCount = await cartPage.getCartBadgeCount();
      expect(badgeCount).toBe(2);
      
      // Navigate to cart and remove one item
      await cartPage.navigateToCart();
      await cartPage.removeItem(products.BACKPACK.selector);
      badgeCount = await cartPage.getCartBadgeCount();
      expect(badgeCount).toBe(1);
    });

    test('SC13: Maximum items in cart', async ({ page }) => {
      const allProducts = Object.values(products);
      
      // Add all available products
      for (const product of allProducts) {
        await inventoryPage.addItemToCart(product.selector);
      }
      
      await cartPage.navigateToCart();
      
      // Verify all items are in cart
      const cartItems = await cartPage.getCartItems();
      expect(cartItems).toHaveLength(allProducts.length);
      
      // Verify badge shows correct count
      const badgeCount = await cartPage.getCartBadgeCount();
      expect(badgeCount).toBe(allProducts.length);
    });
  });

  test.describe('Cart Persistence Tests', () => {
    test('SC14: Cart persists across page navigation', async ({ page }) => {
      // Add items
      await inventoryPage.addItemToCart(products.BACKPACK.selector);
      await inventoryPage.addItemToCart(products.BIKE_LIGHT.selector);
      
      // Navigate to cart
      await cartPage.navigateToCart();
      let itemCount = await cartPage.getCartItemCount();
      expect(itemCount).toBe(2);
      
      // Navigate back to inventory
      await cartPage.clickContinueShopping();
      
      // Navigate to cart again
      await cartPage.navigateToCart();
      itemCount = await cartPage.getCartItemCount();
      expect(itemCount).toBe(2); // Items should persist
    });

    test('SC15: Cart state after browser refresh', async ({ page }) => {
      // Add items
      await inventoryPage.addItemToCart(products.BACKPACK.selector);
      await cartPage.navigateToCart();
      
      // Refresh page
      await page.reload();
      await cartPage.waitForPageLoad();
      
      // Verify items persist after refresh
      const itemCount = await cartPage.getCartItemCount();
      expect(itemCount).toBe(1);
    });
  });

  test.describe('Checkout Integration Tests', () => {
    test('SC16: Proceed to checkout with items', async ({ page }) => {
      // Add items to cart
      await inventoryPage.addItemToCart(products.BACKPACK.selector);
      await inventoryPage.addItemToCart(products.BIKE_LIGHT.selector);
      
      // Navigate to cart and checkout
      await cartPage.navigateToCart();
      await cartPage.clickCheckout();
      
      // Verify navigation to checkout
      expect(page.url()).toContain('/checkout-step-one.html');
      await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Your Information');
    });

    test('SC17: Complete checkout flow from cart', async ({ page }) => {
      // Add item and proceed to checkout
      await inventoryPage.addItemToCart(products.BACKPACK.selector);
      await cartPage.navigateToCart();
      await cartPage.clickCheckout();
      
      // Fill checkout information
      await page.fill('[data-test="firstName"]', 'John');
      await page.fill('[data-test="lastName"]', 'Doe');
      await page.fill('[data-test="postalCode"]', '12345');
      await page.click('[data-test="continue"]');
      
      // Verify checkout overview page
      expect(page.url()).toContain('/checkout-step-two.html');
      await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Overview');
      
      // Verify item appears in checkout summary
      const checkoutItems = await page.$$(CartPage.CART_ITEM);
      expect(checkoutItems).toHaveLength(1);
    });
  });

  test.describe('Error Handling and Edge Cases', () => {
    test('SC18: Cart behavior with page back navigation', async ({ page }) => {
      // Add item and go to cart
      await inventoryPage.addItemToCart(products.BACKPACK.selector);
      await cartPage.navigateToCart();
      
      // Use browser back button
      await page.goBack();
      expect(page.url()).toContain('/inventory.html');
      
      // Go forward to cart again
      await page.goForward();
      expect(page.url()).toContain('/cart.html');
      
      // Verify item still in cart
      const itemCount = await cartPage.getCartItemCount();
      expect(itemCount).toBe(1);
    });

    test('SC19: Cart accessibility verification', async ({ page }) => {
      await inventoryPage.addItemToCart(products.BACKPACK.selector);
      await cartPage.navigateToCart();
      
      // Verify accessibility attributes
      await expect(page.locator('[data-test="cart-list"]')).toBeVisible();
      await expect(page.locator('[data-test="continue-shopping"]')).toBeEnabled();
      await expect(page.locator('[data-test="checkout"]')).toBeEnabled();
      
      // Verify remove button is accessible
      const removeButton = page.locator(`[data-test="remove-${products.BACKPACK.selector}"]`);
      await expect(removeButton).toBeVisible();
      await expect(removeButton).toBeEnabled();
    });

    test('SC20: Cart performance with rapid item additions/removals', async ({ page }) => {
      const startTime = Date.now();
      
      // Rapidly add multiple items
      for (const product of Object.values(products)) {
        await inventoryPage.addItemToCart(product.selector);
      }
      
      await cartPage.navigateToCart();
      
      // Rapidly remove all items
      for (const product of Object.values(products)) {
        await cartPage.removeItem(product.selector);
      }
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Verify operations completed in reasonable time (less than 30 seconds)
      expect(duration).toBeLessThan(30000);
      
      // Verify cart is empty
      const isEmpty = await cartPage.isCartEmpty();
      expect(isEmpty).toBeTruthy();
    });
  });

  test.afterEach(async ({ page }) => {
    // Cleanup: Clear cart after each test
    try {
      await cartPage.navigateToCart();
      const removeButtons = await page.$$('[data-test*="remove-"]');
      for (const button of removeButtons) {
        await button.click();
      }
    } catch (error) {
      // Ignore cleanup errors
    }
  });
});
