export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  gender: 'Male' | 'Female' | 'Other';
  mobile: string;
  dateOfBirth: {
    day: string;
    month: string;
    year: string;
  };
  subjects: string[];
  hobbies: string[];
  address: string;
  state: string;
  city: string;
  picture?: string;
}

export interface ValidationMessages {
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
}
