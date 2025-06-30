import { test, expect, APIRequestContext } from '@playwright/test';

const BASE = 'https://thinking-tester-contact-list.herokuapp.com';

test.describe('Contact List REST API tests', () => {
  let api: APIRequestContext;
  let authToken: string;
  let contactId: string;

  test.beforeAll(async ({ request }) => {
    api = request;
  });

  test('Register a new user', async () => {
    const resp = await api.post(`${BASE}/users`, {
      data: {
        firstName: 'API',
        lastName: 'Tester',
        email: `apitest+${Date.now()}@example.com`,
        password: 'Password123!'
      }
    });
    expect(resp.status()).toBe(201);
  });

  test('Login to get auth token', async () => {
    const resp = await api.post(`${BASE}/users/login`, {
      data: {
        email: 'YOUR_REGISTERED_EMAIL',
        password: 'Password123!'
      }
    });
    expect(resp.status()).toBe(200);
    const body = await resp.json();
    expect(body.token).toBeTruthy();
    authToken = body.token;
  });

  test('Create a contact', async () => {
    const resp = await api.post(`${BASE}/contacts`, {
      data: {
        firstName: 'John',
        lastName: 'Doe',
        birthdate: '1980-01-01',
        email: 'john.doe@example.com',
        phone: '5551234567',
        street1: '1 Main St.',
        city: 'City',
        stateProvince: 'ST',
        postalCode: '12345',
        country: 'USA'
      },
      headers: { Authorization: `Bearer ${authToken}` }
    });
    expect(resp.status()).toBe(201);
    const body = await resp.json();
    contactId = body.id;
    expect(body.firstName).toBe('John');
  });

  test('Retrieve contact list', async () => {
    const resp = await api.get(`${BASE}/contacts`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    expect(resp.status()).toBe(200);
    const list = await resp.json();
    expect(Array.isArray(list)).toBe(true);
    expect(list.map(c => c.id)).toContain(contactId);
  });

  test('Update contact fully', async () => {
    const resp = await api.put(`${BASE}/contacts/${contactId}`, {
      data: {
        firstName: 'Jane',
        lastName: 'Doe',
        birthdate: '1990-05-05',
        email: 'jane.doe@example.com',
        phone: '5559876543',
        street1: '2 Main St.',
        city: 'City',
        stateProvince: 'ST',
        postalCode: '12345',
        country: 'USA'
      },
      headers: { Authorization: `Bearer ${authToken}` }
    });
    expect(resp.status()).toBe(200);
    const body = await resp.json();
    expect(body.firstName).toBe('Jane');
  });

  test('Partial update contact', async () => {
    const resp = await api.patch(`${BASE}/contacts/${contactId}`, {
      data: { phone: '5550001111' },
      headers: { Authorization: `Bearer ${authToken}` }
    });
    expect(resp.status()).toBe(200);
    const body = await resp.json();
    expect(body.phone).toBe('5550001111');
  });

  test('Delete contact', async () => {
    const resp = await api.delete(`${BASE}/contacts/${contactId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    expect(resp.status()).toBe(200);
  });

  test('Fetching deleted contact returns 404', async () => {
    const resp = await api.get(`${BASE}/contacts/${contactId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    expect(resp.status()).toBe(404);
  });

  test('Logout should succeed', async () => {
    const resp = await api.post(`${BASE}/users/logout`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    expect(resp.status()).toBe(200);
  });
});
