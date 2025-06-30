import { faker } from 'faker';
import { ContactData } from '../pages/add-contact-page';

export class TestDataGenerator {
  /**
   * Generate random user data for signup
   */
  static generateUserData() {
    return {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.password(8)
    };
  }

  /**
   * Generate random contact data
   */
  static generateContactData(): ContactData {
    return {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      birthdate: faker.date.past(50).toISOString().split('T')[0], // YYYY-MM-DD format
      email: faker.internet.email().toLowerCase(),
      phone: faker.phone.number('##########'),
      street1: faker.address.streetAddress(),
      street2: faker.address.secondaryAddress(),
      city: faker.address.city(),
      stateProvince: faker.address.state(),
      postalCode: faker.address.zipCode(),
      country: faker.address.country()
    };
  }

  /**
   * Generate multiple contacts
   */
  static generateMultipleContacts(count: number): ContactData[] {
    const contacts: ContactData[] = [];
    for (let i = 0; i < count; i++) {
      contacts.push(this.generateContactData());
    }
    return contacts;
  }

  /**
   * Generate contact with minimal required data
   */
  static generateMinimalContact(): ContactData {
    return {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      birthdate: '',
      email: faker.internet.email().toLowerCase(),
      phone: '',
      street1: '',
      city: '',
      stateProvince: '',
      postalCode: '',
      country: ''
    };
  }

  /**
   * Generate invalid email addresses for testing
   */
  static generateInvalidEmails(): string[] {
    return [
      'invalid-email',
      'test@',
      '@domain.com',
      'test..test@domain.com',
      'test@domain',
      '',
      'test@.com'
    ];
  }

  /**
   * Generate invalid phone numbers
   */
  static generateInvalidPhones(): string[] {
    return [
      'abc123',
      '123',
      '+1-abc-def-ghij',
      '()123-456-7890',
      '123.456.7890.1234'
    ];
  }

  /**
   * Generate test user with specific data
   */
  static generateSpecificUser(overrides: Partial<{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }> = {}) {
    const defaultUser = this.generateUserData();
    return { ...defaultUser, ...overrides };
  }

  /**
   * Generate contact with specific data
   */
  static generateSpecificContact(overrides: Partial<ContactData> = {}): ContactData {
    const defaultContact = this.generateContactData();
    return { ...defaultContact, ...overrides };
  }
}

// Static test data for consistent testing
export const staticTestData = {
  users: {
    validUser: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@test.com',
      password: 'password123'
    },
    testUser2: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@test.com',
      password: 'password456'
    }
  },
  contacts: {
    contact1: {
      firstName: 'Alice',
      lastName: 'Johnson',
      birthdate: '1990-01-15',
      email: 'alice.johnson@email.com',
      phone: '1234567890',
      street1: '123 Main St',
      street2: 'Apt 4B',
      city: 'New York',
      stateProvince: 'NY',
      postalCode: '10001',
      country: 'USA'
    } as ContactData,
    contact2: {
      firstName: 'Bob',
      lastName: 'Wilson',
      birthdate: '1985-06-20',
      email: 'bob.wilson@email.com',
      phone: '9876543210',
      street1: '456 Oak Ave',
      city: 'Los Angeles',
      stateProvince: 'CA',
      postalCode: '90210',
      country: 'USA'
    } as ContactData
  },
  invalidData: {
    invalidEmails: [
      'invalid-email',
      'test@',
      '@domain.com',
      'test..test@domain.com'
    ],
    shortPasswords: [
      '123',
      'ab',
      '12345'
    ],
    invalidPhones: [
      'abc123',
      '123',
      'phone-number'
    ]
  }
};
