import { test, expect } from '@playwright/test';
import { BookingService } from '../../src/services/booking.service';
import { AuthService } from '../../src/services/auth.service';
import { DataUtils } from '../../src/utils/data.utils';

test.describe('Delete Booking Tests', () => {
  let bookingService: BookingService;
  let authService: AuthService;
  let createdBookingId: number;
  let token: string;

  test.beforeEach(async ({ request }) => {
    bookingService = new BookingService(request);
    authService = new AuthService(request);
    
    // Create a booking for testing
    const booking = DataUtils.generateRandomBooking();
    const response = await bookingService.createBooking(booking);
    createdBookingId = response.bookingid;
    
    // Get authentication token
    token = await authService.getDefaultToken();
  });

  test('should delete booking with valid token', async () => {
    await bookingService.deleteBooking(createdBookingId, token);
    
    // Verify booking is deleted by trying to get it
    const response = await bookingService.request.get(`/booking/${createdBookingId}`);
    expect(response.status()).toBe(404);
  });

  test('should fail to delete without authentication', async ({ request }) => {
    const response = await request.delete(`/booking/${createdBookingId}`);
    expect(response.status()).toBe(403);
  });

  test('should return 405 for non-existent booking deletion', async ({ request }) => {
    const response = await request.delete('/booking/999999', {
      headers: {
        'Cookie': `token=${token}`
      }
    });
    expect(response.status()).toBe(405);
  });
});
