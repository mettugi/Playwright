import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';

export class ContactsPage extends BasePage {
  // Locators
  readonly addContactButton: Locator;
  readonly logoutButton: Locator;
  readonly contactsList: Locator;
  readonly contactItems: Locator;
  readonly searchInput: Locator;
  readonly noContactsMessage: Locator;
  readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.addContactButton = page.locator('#add-contact');
    this.logoutButton = page.locator('#logout');
    this.contactsList = page.locator('#myTable');
    this.contactItems = page.locator('.contactTableBodyRow');
    this.searchInput = page.locator('#search');
    this.noContactsMessage = page.locator('text=No contacts found');
    this.pageTitle = page.locator('h1');
  }

  /**
   * Navigate to contacts page
   */
  async navigateToContacts(): Promise<void> {
    await this.navigateTo('/contactList');
    await this.waitForPageLoad();
  }

  /**
   * Click add contact button
   */
  async clickAddContact(): Promise<void> {
    await this.clickElement(this.addContactButton);
  }

  /**
   * Click logout button
   */
  async logout(): Promise<void> {
    await this.clickElement(this.logoutButton);
  }

  /**
   * Get contacts count
   */
  async getContactsCount(): Promise<number> {
    const contacts = await this.contactItems.count();
    return contacts;
  }

  /**
   * Get all contact names
   */
  async getAllContactNames(): Promise<string[]> {
    const contacts = await this.contactItems.all();
    const names: string[] = [];
    
    for (const contact of contacts) {
      const nameCell = contact.locator('td').first();
      const name = await nameCell.textContent();
      if (name) names.push(name.trim());
    }
    
    return names;
  }

  /**
   * Click on specific contact by name
   */
  async clickContactByName(name: string): Promise<void> {
    const contactRow = this.page.locator('.contactTableBodyRow', { hasText: name });
    await this.clickElement(contactRow);
  }

  /**
   * Search for contacts
   */
  async searchContacts(searchTerm: string): Promise<void> {
    await this.fillInput(this.searchInput, searchTerm);
  }

  /**
   * Verify contacts page is displayed
   */
  async verifyContactsPageDisplayed(): Promise<void> {
    await this.waitForElement(this.addContactButton);
    await this.waitForElement(this.logoutButton);
  }

  /**
   * Check if contact exists by name
   */
  async isContactPresent(name: string): Promise<boolean> {
    const contactRow = this.page.locator('.contactTableBodyRow', { hasText: name });
    return await this.isElementVisible(contactRow);
  }

  /**
   * Get contact details by name
   */
  async getContactDetails(name: string): Promise<{
    name: string;
    birthdate: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
  }> {
    const contactRow = this.page.locator('.contactTableBodyRow', { hasText: name });
    const cells = contactRow.locator('td');
    
    return {
      name: await cells.nth(0).textContent() || '',
      birthdate: await cells.nth(1).textContent() || '',
      email: await cells.nth(2).textContent() || '',
      phone: await cells.nth(3).textContent() || '',
      address: await cells.nth(4).textContent() || '',
      city: await cells.nth(5).textContent() || '',
      country: await cells.nth(6).textContent() || ''
    };
  }

  /**
   * Verify no contacts message is displayed
   */
  async verifyNoContactsMessage(): Promise<void> {
    await this.waitForElement(this.noContactsMessage);
  }

  /**
   * Wait for contacts to load
   */
  async waitForContactsToLoad(): Promise<void> {
    await this.page.waitForSelector('.contactTableBodyRow, text=No contacts found', { timeout: 10000 });
  }

  /**
   * Get page title text
   */
  async getPageTitleText(): Promise<string> {
    return await this.getTextContent(this.pageTitle);
  }
}
