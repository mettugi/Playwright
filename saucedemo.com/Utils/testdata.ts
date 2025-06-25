export const TestData = {
  VALID_CREDENTIALS: {
    STANDARD_USER: { username: 'standard_user', password: 'secret_sauce' },
    PROBLEM_USER: { username: 'problem_user', password: 'secret_sauce' },
    PERFORMANCE_USER: { username: 'performance_glitch_user', password: 'secret_sauce' },
    ERROR_USER: { username: 'error_user', password: 'secret_sauce' },
    VISUAL_USER: { username: 'visual_user', password: 'secret_sauce' }
  },
  
  INVALID_CREDENTIALS: [
    { username: 'invalid_user', password: 'secret_sauce', expectedError: 'Username and password do not match' },
    { username: 'standard_user', password: 'wrong_password', expectedError: 'Username and password do not match' },
    { username: '', password: 'secret_sauce', expectedError: 'Username is required' },
    { username: 'standard_user', password: '', expectedError: 'Password is required' },
    { username: 'locked_out_user', password: 'secret_sauce', expectedError: 'Sorry, this user has been locked out' }
  ],

  URLS: {
    BASE: 'https://www.saucedemo.com',
    LOGIN: 'https://www.saucedemo.com/',
    INVENTORY: 'https://www.saucedemo.com/inventory.html',
    CART: 'https://www.saucedemo.com/cart.html',
    CHECKOUT: 'https://www.saucedemo.com/checkout-step-one.html'
  },

  TIMEOUTS: {
    DEFAULT: 30000,
    PERFORMANCE_USER: 60000,
    NETWORK_IDLE: 5000
  }
};
