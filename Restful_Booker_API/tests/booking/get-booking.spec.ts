import { test, expect } from '@playwright/test';
import { BookingService } from '../../src/services/booking.service';
import { DataUtils } from '../../src/utils/data.utils';

test.describe('Get Booking Tests', () => {
  let bookingService: BookingService;
  let createdBookingId: number;

  test.beforeEach(async ({ request }) => {
    bookingService = new BookingService(request);
    
    // Create a booking for testing
    const booking = DataUtils.generateRandomBooking();
    const response = await bookingService.createBooking(booking);
    createdBookingId = response.bookingid;
  });

  test('should get all booking IDs', async () => {
    const bookingIds = await bookingService.getBookingIds();
    
    expect(bookingIds).toBeDefined();
    expect(Array.isArray(bookingIds)).toBe(true);
    expect(bookingIds.length).toBeGreaterThan(0);
    expect(bookingIds[0]).toHaveProperty('bookingid');
  });

  test('should get specific booking by ID', async () => {
    const booking = await bookingService.getBooking(createdBookingId);
    
    expect(booking).toBeDefined();
    expect(booking.firstname).toBeDefined();
    expect(booking.lastname).toBeDefined();
    expect(booking.totalprice).toBeDefined();
    expect(booking.depositpaid).toBeDefined();
    expect(booking.bookingdates).toBeDefined();
  });

  test('should return 404 for non-existent booking', async ({ request }) => {
    const response = await request.get('/booking/999999');
    expect(response.status()).toBe(404);
  });
});
