import { test as authTest } from './auth-fixture';
import { AddContactPage, ContactData } from '../pages/add-contact-page';
import { ContactDetailsPage } from '../pages/contact-details-page';
import { TestDataGenerator } from '../utils/test-data';

export interface ContactFixtures {
  addContactPage: AddContactPage;
  contactDetailsPage: ContactDetailsPage;
  createContact: (contactData?: ContactData) => Promise<ContactData>;
  createMultipleContacts: (count: number) => Promise<ContactData[]>;
  authenticatedUserWithContacts: { 
    user: { email: string; password: string };
    contacts: ContactData[];
  };
}

export const test = authTest.extend<ContactFixtures>({
  addContactPage: async ({ page }, use) => {
    const addContactPage = new AddContactPage(page);
    await use(addContactPage);
  },

  contactDetailsPage: async ({ page }, use) => {
    const contactDetailsPage = new ContactDetailsPage(page);
    await use(contactDetailsPage);
  },

  createContact: async ({ page, authenticatedUser }, use) => {
    const createContact = async (contactData?: ContactData): Promise<ContactData> => {
      const contact = contactData || TestDataGenerator.generateContactData();
      
      const addContactPage = new AddContactPage(page);
      await addContactPage.navigateToAddContact();
      await addContactPage.addContact(contact);
      
      return contact;
    };
    
    await use(createContact);
  },

  createMultipleContacts: async ({ page, authenticatedUser }, use) => {
    const createMultipleContacts = async (count: number): Promise<ContactData[]> => {
      const contacts: ContactData[] = [];
      
      for (let i = 0; i < count; i++) {
        const contact = TestDataGenerator.generateContactData();
        
        const addContactPage = new AddContactPage(page);
        await addContactPage.navigateToAddContact();
        await addContactPage.addContact(contact);
        
        contacts.push(contact);
        
        // Navigate back to contacts list for next iteration
        const contactsPage = await import('../pages/contacts-page');
        const contactsList = new contactsPage.ContactsPage(page);
        await contactsList.navigateToContacts();
      }
      
      return contacts;
    };
    
    await use(createMultipleContacts);
  },

  authenticatedUserWithContacts: async ({ page }, use) => {
    // Create and login user
    const userData = TestDataGenerator.generateUserData();
    
    const signupPage = await import('../pages/signup-page');
    const signup = new signupPage.SignupPage(page);
    await signup.navigateToSignup();
    await signup.signup(userData);
    
    const loginPage = await import('../pages/login-page');
    const login = new loginPage.LoginPage(page);
    await login.navigateToLogin();
    await login.login(userData.email, userData.password);
    
    // Create some test contacts
    const contacts = TestDataGenerator.generateMultipleContacts(3);
    const addContactPage = new AddContactPage(page);
    
    for (const contact of contacts) {
      await addContactPage.navigateToAddContact();
      await addContactPage.addContact(contact);
    }
    
    await use({
      user: { email: userData.email, password: userData.password },
      contacts: contacts
    });
  }
});

export { expect } from '@playwright/test';
