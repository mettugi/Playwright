export const TestConfig = {
  baseURL: process.env.BASE_URL || 'https://restful-booker.herokuapp.com',
  timeout: 30000,
  retries: 2,
  defaultCredentials: {
    username: process.env.DEFAULT_USERNAME || 'admin',
    password: process.env.DEFAULT_PASSWORD || 'password123'
  }
};
