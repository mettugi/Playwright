import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';

export interface ContactData {
  firstName: string;
  lastName: string;
  birthdate: string;
  email: string;
  phone: string;
  street1: string;
  street2?: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
}

export class AddContactPage extends BasePage {
  // Locators
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly birthdateInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly street1Input: Locator;
  readonly street2Input: Locator;
  readonly cityInput: Locator;
  readonly stateProvinceInput: Locator;
  readonly postalCodeInput: Locator;
  readonly countryInput: Locator;
  readonly submitButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('#firstName');
    this.lastNameInput = page.locator('#lastName');
    this.birthdateInput = page.locator('#birthdate');
    this.emailInput = page.locator('#email');
    this.phoneInput = page.locator('#phone');
    this.street1Input = page.locator('#street1');
    this.street2Input = page.locator('#street2');
    this.cityInput = page.locator('#city');
    this.stateProvinceInput = page.locator('#stateProvince');
    this.postalCodeInput = page.locator('#postalCode');
    this.countryInput = page.locator('#country');
    this.submitButton = page.locator('#submit');
    this.cancelButton = page.locator('#cancel');
    this.errorMessage = page.locator('#error');
  }

  /**
   * Navigate to add contact page
   */
  async navigateToAddContact(): Promise<void> {
    await this.navigateTo('/addContact');
    await this.waitForPageLoad();
  }

  /**
   * Fill contact form with data
   */
  async fillContactForm(contactData: ContactData): Promise<void> {
    await this.fillInput(this.firstNameInput, contactData.firstName);
    await this.fillInput(this.lastNameInput, contactData.lastName);
    await this.fillInput(this.birthdateInput, contactData.birthdate);
    await this.fillInput(this.emailInput, contactData.email);
    await this.fillInput(this.phoneInput, contactData.phone);
    await this.fillInput(this.street1Input, contactData.street1);
    
    if (contactData.street2) {
      await this.fillInput(this.street2Input, contactData.street2);
    }
    
    await this.fillInput(this.cityInput, contactData.city);
    await this.fillInput(this.stateProvinceInput, contactData.stateProvince);
    await this.fillInput(this.postalCodeInput, contactData.postalCode);
    await this.fillInput(this.countryInput, contactData.country);
  }

  /**
   * Submit contact form
   */
  async submitForm(): Promise<void> {
    await this.clickElement(this.submitButton);
  }

  /**
   * Cancel adding contact
   */
  async cancelAddContact(): Promise<void> {
    await this.clickElement(this.cancelButton);
  }

  /**
   * Add new contact with data
   */
  async addContact(contactData: ContactData): Promise<void> {
    await this.fillContactForm(contactData);
    await this.submitForm();
  }

  /**
   * Verify add contact page is displayed
   */
  async verifyAddContactPageDisplayed(): Promise<void> {
    await this.waitForElement(this.firstNameInput);
    await this.waitForElement(this.lastNameInput);
    await this.waitForElement(this.submitButton);
  }

  /**
   * Clear all form fields
   */
  async clearForm(): Promise<void> {
    await this.firstNameInput.clear();
    await this.lastNameInput.clear();
    await this.birthdateInput.clear();
    await this.emailInput.clear();
    await this.phoneInput.clear();
    await this.street1Input.clear();
    await this.street2Input.clear();
    await this.cityInput.clear();
    await this.stateProvinceInput.clear();
    await this.postalCodeInput.clear();
    await this.countryInput.clear();
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    return await this.getTextContent(this.errorMessage);
  }

  /**
   * Check if error message is displayed
   */
  async isErrorMessageDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.errorMessage);
  }

  /**
   * Verify required fields are present
   */
  async verifyRequiredFields(): Promise<void> {
    await this.waitForElement(this.firstNameInput);
    await this.waitForElement(this.lastNameInput);
    await this.waitForElement(this.emailInput);
    await this.waitForElement(this.submitButton);
  }

  /**
   * Check if submit button is enabled
   */
  async isSubmitButtonEnabled(): Promise<boolean> {
    return await this.submitButton.isEnabled();
  }

  /**
   * Fill only required fields
   */
  async fillRequiredFields(firstName: string, lastName: string, email: string): Promise<void> {
    await this.fillInput(this.firstNameInput, firstName);
    await this.fillInput(this.lastNameInput, lastName);
    await this.fillInput(this.emailInput, email);
  }
}
