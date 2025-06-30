// tests/api/bookings.spec.ts
import { test, expect } from '@playwright/test';
import { createRequestContext } from './helpers';

test.describe('Restful‑Booker API', () => {
  let request: ReturnType<typeof createRequestContext>;

  test.beforeAll(async () => {
    request = await createRequestContext();
  });

  test('Health check (GET /ping)', async () => {
    const res = await request.get('/ping');
    expect(res.status()).toBe(201);
  });

  test('CRUD lifecycle of booking', async () => {
    // 1️⃣ Create
    const bookingData = {
      firstname: 'Alice',
      lastname: 'Smith',
      totalprice: 123,
      depositpaid: true,
      bookingdates: { checkin: '2025-07-01', checkout: '2025-07-07' },
      additionalneeds: 'Breakfast',
    };
    const createRes = await request.post('/booking', { data: bookingData });
    expect(createRes.status()).toBe(200);
    const { bookingid } = await createRes.json();

    // 2️⃣ Retrieve
    const getRes = await request.get(`/booking/${bookingid}`);
    expect(getRes.status()).toBe(200);
    const getBody = await getRes.json();
    expect(getBody.firstname).toBe(bookingData.firstname);
    expect(getBody.lastname).toBe(bookingData.lastname);

    // 3️⃣ Update (PUT)
    const updatedData = {
      ...bookingData,
      firstname: 'AliceUpdated',
      additionalneeds: 'Late Checkout',
    };
    const tokenRes = await request.post('/auth', { data: { username: 'admin', password: 'password123' } });
    const token = (await tokenRes.json()).token;
    const putRes = await request.put(`/booking/${bookingid}`, {
      data: updatedData,
      headers: { Cookie: `token=${token}` }
    });
    expect(putRes.status()).toBe(200);
    const putBody = await putRes.json();
    expect(putBody.firstname).toBe('AliceUpdated');

    // 4️⃣ Partial update (PATCH)
    const patchRes = await request.patch(`/booking/${bookingid}`, {
      data: { additionalneeds: 'Extra Pillow' },
      headers: { Cookie: `token=${token}` }
    });
    expect(patchRes.status()).toBe(200);
    const patchBody = await patchRes.json();
    expect(patchBody.additionalneeds).toBe('Extra Pillow');

    // 5️⃣ Delete
    const delRes = await request.delete(`/booking/${bookingid}`, {
      headers: { Cookie: `token=${token}` }
    });
    // Note: API returns 201 even on delete ⚠️
    expect(delRes.status()).toBe(201);

    // Confirm deletion
    const confirmRes = await request.get(`/booking/${bookingid}`);
    expect(confirmRes.status()).toBe(404);
  });

  test('GET /booking returns list of IDs', async () => {
    const res = await request.get('/booking');
    expect(res.status()).toBe(200);
    const ids = await res.json();
    expect(Array.isArray(ids)).toBeTruthy();
    expect(ids.length).toBeGreaterThan(0);
    expect(typeof ids[0].bookingid).toBe('number');
  });

  test('Query filter by name returns 200 and list', async () => {
    const res = await request.get('/booking?firstname=John');
    expect(res.status()).toBe(200);
    const arr = await res.json();
    expect(Array.isArray(arr)).toBe(true);
  });
});
