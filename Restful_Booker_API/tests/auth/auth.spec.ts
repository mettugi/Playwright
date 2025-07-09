import { test, expect } from '@playwright/test';
import { AuthService } from '../../src/services/auth.service';
import { AuthRequest } from '../../src/types/booking.types';

test.describe('Authentication Tests', () => {
  let authService: AuthService;

  test.beforeEach(async ({ request }) => {
    authService = new AuthService(request);
  });

  test('should create token with valid credentials', async () => {
    const credentials: AuthRequest = {
      username: 'admin',
      password: 'password123'
    };

    const token = await authService.createToken(credentials);
    
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);
  });

  test('should fail with invalid credentials', async ({ request }) => {
    const invalidCredentials: AuthRequest = {
      username: 'invalid',
      password: 'invalid'
    };

    const response = await request.post('/auth', {
      data: invalidCredentials
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.reason).toBe('Bad credentials');
  });

  test('should get default token', async () => {
    const token = await authService.getDefaultToken();
    
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
  });
});
