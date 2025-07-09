import { test, expect } from '@playwright/test';
import { BookingService } from '../../src/services/booking.service';
import { DataUtils } from '../../src/utils/data.utils';
import { BookingFixtures } from '../../src/fixtures/booking.fixtures';

test.describe('Create Booking Tests', () => {
  let bookingService: BookingService;

  test.beforeEach(async ({ request }) => {
    bookingService = new BookingService(request);
  });

  test('should create booking with valid data', async () => {
    const booking = DataUtils.generateRandomBooking();
    
    const response = await bookingService.createBooking(booking);
    
    expect(response.bookingid).toBeDefined();
    expect(response.booking.firstname).toBe(booking.firstname);
    expect(response.booking.lastname).toBe(booking.lastname);
    expect(response.booking.totalprice).toBe(booking.totalprice);
    expect(response.booking.depositpaid).toBe(booking.depositpaid);
  });

  test('should create booking with fixture data', async () => {
    const response = await bookingService.createBooking(BookingFixtures.validBooking);
    
    expect(response.bookingid).toBeDefined();
    expect(response.booking.firstname).toBe(BookingFixtures.validBooking.firstname);
    expect(response.booking.lastname).toBe(BookingFixtures.validBooking.lastname);
  });

  test('should create booking without optional fields', async () => {
    const response = await bookingService.createBooking(BookingFixtures.bookingWithoutOptionalFields);
    
    expect(response.bookingid).toBeDefined();
    expect(response.booking.firstname).toBe(BookingFixtures.bookingWithoutOptionalFields.firstname);
    expect(response.booking.additionalneeds).toBeUndefined();
  });
});
