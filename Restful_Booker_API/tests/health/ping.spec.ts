import { test, expect } from '@playwright/test';

test.describe('Health Check Tests', () => {
  test('should return 201 for ping endpoint', async ({ request }) => {
    const response = await request.get('/ping');
    expect(response.status()).toBe(201);
    
    const responseText = await response.text();
    expect(responseText).toBe('Created');
  });
});
