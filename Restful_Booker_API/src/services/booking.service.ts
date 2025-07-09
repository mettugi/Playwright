import { APIRequestContext } from '@playwright/test';
import { Booking, BookingResponse, BookingIds } from '../types/booking.types';
import { ApiUtils } from '../utils/api.utils';
import { Logger } from '../utils/logger.utils';

export class BookingService {
  private apiUtils: ApiUtils;

  constructor(private request: APIRequestContext) {
    this.apiUtils = new ApiUtils(request);
  }

  async createBooking(booking: Booking): Promise<BookingResponse> {
    Logger.info('Creating new booking', booking);
    
    const response = await this.apiUtils.makeRequest('POST', '/booking', {
      data: booking
    });

    await this.apiUtils.validateResponse(response, 200);
    const bookingResponse: BookingResponse = await this.apiUtils.getResponseBody(response);
    
    Logger.info('Booking created successfully', bookingResponse);
    return bookingResponse;
  }

  async getBookingIds(): Promise<BookingIds[]> {
    Logger.info('Fetching all booking IDs');
    
    const response = await this.apiUtils.makeRequest('GET', '/booking');
    await this.apiUtils.validateResponse(response, 200);
    
    const bookingIds: BookingIds[] = await this.apiUtils.getResponseBody(response);
    Logger.info(`Found ${bookingIds.length} bookings`);
    
    return bookingIds;
  }

  async getBooking(bookingId: number): Promise<Booking> {
    Logger.info(`Fetching booking with ID: ${bookingId}`);
    
    const response = await this.apiUtils.makeRequest('GET', `/booking/${bookingId}`);
    await this.apiUtils.validateResponse(response, 200);
    
    const booking: Booking = await this.apiUtils.getResponseBody(response);
    Logger.info('Booking retrieved successfully', booking);
    
    return booking;
  }

  async updateBooking(bookingId: number, booking: Booking, token: string): Promise<Booking> {
    Logger.info(`Updating booking with ID: ${bookingId}`, booking);
    
    const response = await this.apiUtils.makeRequest('PUT', `/booking/${bookingId}`, {
      data: booking,
      headers: {
        'Cookie': `token=${token}`
      }
    });

    await this.apiUtils.validateResponse(response, 200);
    const updatedBooking: Booking = await this.apiUtils.getResponseBody(response);
    
    Logger.info('Booking updated successfully', updatedBooking);
    return updatedBooking;
  }

  async partialUpdateBooking(bookingId: number, partialBooking: Partial<Booking>, token: string): Promise<Booking> {
    Logger.info(`Partially updating booking with ID: ${bookingId}`, partialBooking);
    
    const response = await this.apiUtils.makeRequest('PATCH', `/booking/${bookingId}`, {
      data: partialBooking,
      headers: {
        'Cookie': `token=${token}`
      }
    });

    await this.apiUtils.validateResponse(response, 200);
    const updatedBooking: Booking = await this.apiUtils.getResponseBody(response);
    
    Logger.info('Booking partially updated successfully', updatedBooking);
    return updatedBooking;
  }

  async deleteBooking(bookingId: number, token: string): Promise<void> {
    Logger.info(`Deleting booking with ID: ${bookingId}`);
    
    const response = await this.apiUtils.makeRequest('DELETE', `/booking/${bookingId}`, {
      headers: {
        'Cookie': `token=${token}`
      }
    });

    await this.apiUtils.validateResponse(response, 201);
    Logger.info('Booking deleted successfully');
  }
}
