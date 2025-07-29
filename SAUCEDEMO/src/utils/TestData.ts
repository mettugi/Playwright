import { User, Product } from '../types';

export class TestData {
  static readonly USERS: Record<string, User> = {
    STANDARD: { username: 'standard_user', password: 'secret_sauce' },
    LOCKED_OUT: { username: 'locked_out_user', password: 'secret_sauce' },
    PROBLEM: { username: 'problem_user', password: 'secret_sauce' },
    PERFORMANCE_GLITCH: { username: 'performance_glitch_user', password: 'secret_sauce' }
  };

  static readonly PRODUCTS: Record<string, Product> = {
    BACKPACK: {
      name: 'Sauce Labs Backpack',
      dataTestId: 'sauce-labs-backpack',
      price: '$29.99'
    },
    FLEECE_JACKET: {
      name: 'Sauce Labs Fleece Jacket',
      dataTestId: 'sauce-labs-fleece-jacket',
      price: '$49.99'
    },
    BOLT_TSHIRT: {
      name: 'Sauce Labs Bolt T-Shirt',
      dataTestId: 'sauce-labs-bolt-t-shirt',
      price: '$15.99'
    }
  };

  static readonly URLS = {
    LOGIN: '/',
    INVENTORY: '/inventory.html',
    CART: '/cart.html',
    ABOUT: 'https://saucelabs.com/'
  };
}
