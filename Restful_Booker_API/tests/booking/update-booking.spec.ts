import { test, expect } from '@playwright/test';
import { BookingService } from '../../src/services/booking.service';
import { AuthService } from '../../src/services/auth.service';
import { DataUtils } from '../../src/utils/data.utils';

test.describe('Update Booking Tests', () => {
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

  test('should update booking with valid data', async () => {
    const updatedBooking = DataUtils.generateRandomBooking();
    
    const response = await bookingService.updateBooking(createdBookingId, updatedBooking, token);
    
    expect(response.firstname).toBe(updatedBooking.firstname);
    expect(response.lastname).toBe(updatedBooking.lastname);
    expect(response.totalprice).toBe(updatedBooking.totalprice);
  });

  test('should partially update booking', async () => {
    const partialUpdate = DataUtils.generatePartialBooking();
    
    const response = await bookingService.partialUpdateBooking(createdBookingId, partialUpdate, token);
    
    expect(response.firstname).toBe(partialUpdate.firstname);
    expect(response.lastname).toBe(partialUpdate.lastname);
    expect(response.totalprice).toBe(partialUpdate.totalprice);
  });

  test('should fail to update without authentication', async ({ request }) => {
    const updatedBooking = DataUtils.generateRandomBooking();
    
    const response = await request.put(`/booking/${createdBookingId}`, {
      data: updatedBooking
    });
    
    expect(response.status()).toBe(403);
  });
});
