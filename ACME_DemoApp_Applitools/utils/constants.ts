export const CONSTANTS = {
  BASE_URL: 'https://demo.applitools.com',
  PAGE_TITLES: {
    LOGIN: 'ACME Demo App',
    DASHBOARD: 'ACME Demo App'
  },
  TIMEOUTS: {
    DEFAULT: 5000,
    LONG: 10000,
    NAVIGATION: 30000
  },
  CREDENTIALS: {
    VALID_USER: { username: 'testuser', password: 'testpass' },
    INVALID_USER: { username: 'invalid', password: 'invalid' },
    EMPTY_USER: { username: '', password: '' }
  }
} as const;
