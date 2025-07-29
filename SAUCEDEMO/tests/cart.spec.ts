import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { InventoryPage } from '../src/pages/InventoryPage';
import { CartPage } from '../src/pages/CartPage';
import { TestData } from '../src/utils/TestData';

test.describe('Cart Tests', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    
    // Login before each test
    await loginPage.login(TestData.USERS.STANDARD);
    await inventoryPage.verifyInventoryPageLoaded();
  });

  test('Test Case 1: Add Sauce Labs Backpack to cart and verify', async ({ page }) => {
    // Add Sauce Labs Backpack to cart
    await inventoryPage.addProductToCart(TestData.PRODUCTS.BACKPACK);

    // Verify cart badge shows 1 item
    const cartCount = await inventoryPage.getCartItemCount();
    expect(cartCount).toBe('1');

    // Go to cart and verify correct item is added
    await inventoryPage.goToCart();
    await cartPage.verifyCartPageLoaded();

    // Verify item count in cart
    const itemsInCart = await cartPage.getCartItemsCount();
    expect(itemsInCart).toBe(1);

    // Verify correct item name
    await cartPage.verifyItemInCart(TestData.PRODUCTS.BACKPACK.name);

    console.log('✅ Test Case 1 Passed: Sauce Labs Backpack successfully added to cart');
  });

  test('Test Case 2: Add Sauce Labs Fleece Jacket to cart and verify', async ({ page }) => {
    // Add Sauce Labs Fleece Jacket to cart
    await inventoryPage.addProductToCart(TestData.PRODUCTS.FLEECE_JACKET);

    // Verify cart badge shows 1 item
    const cartCount = await inventoryPage.getCartItemCount();
    expect(cartCount).toBe('1');

    // Go to cart and verify correct item is added
    await inventoryPage.goToCart();
    await cartPage.verifyCartPageLoaded();

    // Verify item count in cart
    const itemsInCart = await cartPage.getCartItemsCount();
    expect(itemsInCart).toBe(1);

    // Verify correct item name
    await cartPage.verifyItemInCart(TestData.PRODUCTS.FLEECE_JACKET.name);

    console.log('✅ Test Case 2 Passed: Sauce Labs Fleece Jacket successfully added to cart');
  });

  test('Add multiple items to cart and verify', async ({ page }) => {
    // Add multiple items
    await inventoryPage.addProductToCart(TestData.PRODUCTS.BACKPACK);
    await inventoryPage.addProductToCart(TestData.PRODUCTS.FLEECE_JACKET);

    // Verify cart badge shows 2 items
    const cartCount = await inventoryPage.getCartItemCount();
    expect(cartCount).toBe('2');

    // Go to cart and verify both items
    await inventoryPage.goToCart();
    await cartPage.verifyCartPageLoaded();

    const itemsInCart = await cartPage.getCartItemsCount();
    expect(itemsInCart).toBe(2);

    // Verify both items are in cart
    await cartPage.verifyItemInCart(TestData.PRODUCTS.BACKPACK.name);
    await cartPage.verifyItemInCart(TestData.PRODUCTS.FLEECE_JACKET.name);

    console.log('✅ Multiple items test passed');
  });
});
