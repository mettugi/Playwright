import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';

export class ContactDetailsPage extends BasePage {
  // Locators
  readonly editButton: Locator;
  readonly deleteButton: Locator;
  readonly returnToContactListButton: Locator;
  readonly contactName: Locator;
  readonly contactBirthdate: Locator;
  readonly contactEmail: Locator;
  readonly contactPhone: Locator;
  readonly contactAddress: Locator;
  readonly contactCity: Locator;
  readonly contactStateProvince: Locator;
  readonly contactPostalCode: Locator;
  readonly contactCountry: Locator;
  readonly confirmDeleteButton: Locator;
  readonly cancelDeleteButton: Locator;
  readonly deleteModal: Locator;

  constructor(page: Page) {
    super(page);
    this.editButton = page.locator('#edit-contact');
    this.deleteButton = page.locator('#delete');
    this.returnToContactListButton = page.locator('#return');
    this.contactName = page.locator('#firstName, #lastName');
    this.contactBirthdate = page.locator('#birthdate');
    this.contactEmail = page.locator('#email');
    this.contactPhone = page.locator('#phone');
    this.contactAddress = page.locator('#street1, #street2');
    this.contactCity = page.locator('#city');
    this.contactStateProvince = page.locator('#stateProvince');
    this.contactPostalCode = page.locator('#postalCode');
    this.contactCountry = page.locator('#country');
    this.confirmDeleteButton = page.locator('#delete-confirm');
    this.cancelDeleteButton = page.locator('#delete-cancel');
    this.deleteModal = page.locator('.delete-modal');
  }

  /**
   * Click edit contact button
   */
  async clickEditContact(): Promise<void> {
    await this.clickElement(this.editButton);
  }

  /**
   * Click delete contact button
   */
  async clickDeleteContact(): Promise<void> {
    await this.clickElement(this.deleteButton);
  }

  /**
   * Confirm delete action
   */
  async confirmDelete(): Promise<void> {
    await this.clickElement(this.confirmDeleteButton);
  }

  /**
   * Cancel delete action
   */
  async cancelDelete(): Promise<void> {
    await this.clickElement(this.cancelDeleteButton);
  }

  /**
   * Return to contact list
   */
  async returnToContactList(): Promise<void> {
    await this.clickElement(this.returnToContactListButton);
  }

  /**
   * Get contact full name
   */
  async getContactFullName(): Promise<string> {
    const firstName = await this.page.locator('#firstName').textContent() || '';
    const lastName = await this.page.locator('#lastName').textContent() || '';
    return `${firstName} ${lastName}`.trim();
  }

  /**
   * Get contact email
   */
  async getContactEmail(): Promise<string> {
    return await this.getTextContent(this.contactEmail);
  }

  /**
   * Get contact phone
   */
  async getContactPhone(): Promise<string> {
    return await this.getTextContent(this.contactPhone);
  }

  /**
   * Get contact birthdate
   */
  async getContactBirthdate(): Promise<string> {
    return await this.getTextContent(this.contactBirthdate);
  }

  /**
   * Get complete contact details
   */
  async getContactDetails(): Promise<{
    name: string;
    birthdate: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    stateProvince: string;
    postalCode: string;
    country: string;
  }> {
    return {
      name: await this.getContactFullName(),
      birthdate: await this.getContactBirthdate(),
      email: await this.getContactEmail(),
      phone: await this.getContactPhone(),
      address: await this.getTextContent(this.contactAddress),
      city: await this.getTextContent(this.contactCity),
      stateProvince: await this.getTextContent(this.contactStateProvince),
      postalCode: await this.getTextContent(this.contactPostalCode),
      country: await this.getTextContent(this.contactCountry)
    };
  }

  /**
   * Verify contact details page is displayed
   */
  async verifyContactDetailsPageDisplayed(): Promise<void> {
    await this.waitForElement(this.editButton);
    await this.waitForElement(this.deleteButton);
    await this.waitForElement(this.returnToContactListButton);
  }

  /**
   * Verify delete modal is displayed
   */
  async verifyDeleteModalDisplayed(): Promise<void> {
    await this.waitForElement(this.deleteModal);
    await this.waitForElement(this.confirmDeleteButton);
    await this.waitForElement(this.cancelDeleteButton);
  }

  /**
   * Check if edit button is visible
   */
  async isEditButtonVisible(): Promise<boolean> {
    return await this.isElementVisible(this.editButton);
  }

  /**
   * Check if delete button is visible
   */
  async isDeleteButtonVisible(): Promise<boolean> {
    return await this.isElementVisible(this.deleteButton);
  }
}
