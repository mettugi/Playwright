import { faker } from '@faker-js/faker';
import { Booking } from '../types/booking.types';

export class DataUtils {
  static generateRandomBooking(): Booking {
    const checkin = faker.date.future();
    const checkout = faker.date.future({ refDate: checkin });
    
    return {
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      totalprice: faker.number.int({ min: 100, max: 1000 }),
      depositpaid: faker.datatype.boolean(),
      bookingdates: {
        checkin: checkin.toISOString().split('T')[0],
        checkout: checkout.toISOString().split('T')[0]
      },
      additionalneeds: faker.helpers.arrayElement(['Breakfast', 'Lunch', 'Dinner', 'Spa'])
    };
  }

  static generatePartialBooking(): Partial<Booking> {
    return {
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      totalprice: faker.number.int({ min: 100, max: 1000 })
    };
  }

  static getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  static getFutureDate(days: number = 30): string {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  }
}
