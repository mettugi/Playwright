import { FormData } from './interfaces/FormData';

export const validFormData: FormData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  gender: 'Male',
  mobile: '1234567890',
  dateOfBirth: {
    day: '15',
    month: '5', // May (0-indexed)
    year: '1990'
  },
  subjects: ['Math', 'Physics'],
  hobbies: ['Sports', 'Reading'],
  address: '123 Main Street, Anytown, USA',
  state: 'NCR',
  city: 'Delhi'
};

export const femaleUserData: FormData = {
  firstName: 'Jane',
  lastName: 'Smith',
  email: 'jane.smith@example.com',
  gender: 'Female',
  mobile: '9876543210',
  dateOfBirth: {
    day: '25',
    month: '11', // December
    year: '1995'
  },
  subjects: ['English', 'Chemistry'],
  hobbies: ['Music', 'Reading'],
  address: '456 Oak Avenue, Another City, USA',
  state: 'Uttar Pradesh',
  city: 'Agra'
};

export const invalidFormData = {
  firstName: '',
  lastName: '',
  email: 'invalid-email',
  mobile: '123', // Invalid mobile number
  address: ''
};
