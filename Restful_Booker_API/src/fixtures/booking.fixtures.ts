import { Booking } from '../types/booking.types';

export class BookingFixtures {
  static validBooking: Booking = {
    firstname: "John",
    lastname: "Doe",
    totalprice: 250,
    depositpaid: true,
    bookingdates: {
      checkin: "2024-01-01",
      checkout: "2024-01-07"
    },
    additionalneeds: "Breakfast"
  };

  static invalidBooking = {
    firstname: "",
    lastname: "",
    totalprice: -100,
    depositpaid: "invalid",
    bookingdates: {
      checkin: "invalid-date",
      checkout: "invalid-date"
    }
  };

  static bookingWithoutOptionalFields: Booking = {
    firstname: "Jane",
    lastname: "Smith",
    totalprice: 150,
    depositpaid: false,
    bookingdates: {
      checkin: "2024-02-01",
      checkout: "2024-02-05"
    }
  };
}
