import { Locator, expect } from '@playwright/test';
import { BasePage } from './base/BasePage';
import { FormData } from '../data/interfaces/FormData';
import { URLS, GENDER_MAP, HOBBY_MAP, VALIDATION_COLORS } from '../utils/constants';

export class PracticeFormPage extends BasePage {
  // Locators
  get firstNameInput(): Locator { return this.page.locator('#firstName'); }
  get lastNameInput(): Locator { return this.page.locator('#lastName'); }
  get emailInput(): Locator { return this.page.locator('#userEmail'); }
  get mobileInput(): Locator { return this.page.locator('#userNumber'); }
  get dateOfBirthInput(): Locator { return this.page.locator('#dateOfBirthInput'); }
  get subjectsInput(): Locator { return this.page.locator('#subjectsInput'); }
  get addressInput(): Locator { return this.page.locator('#currentAddress'); }
  get stateDropdown(): Locator { return this.page.locator('#state'); }
  get cityDropdown(): Locator { return this.page.locator('#city'); }
  get submitButton(): Locator { return this.page.locator('#submit'); }
  get confirmationModal(): Locator { return this.page.locator('.modal-content'); }
  get confirmationTitle(): Locator { return this.page.locator('#example-modal-sizes-title-lg'); }
  get closeButton(): Locator { return this.page.locator('#closeLargeModal'); }
  get uploadPictureInput(): Locator { return this.page.locator('#uploadPicture'); }

  // Dynamic locators
  genderRadioLabel(gender: string): Locator {
    const genderNumber = GENDER_MAP[gender as keyof typeof GENDER_MAP];
    return this.page.locator(`label[for="gender-radio-${genderNumber}"]`);
  }

  hobbyCheckboxLabel(hobby: string): Locator {
    const hobbyNumber = HOBBY_MAP[hobby as keyof typeof HOBBY_MAP];
    return this.page.locator(`label[for="hobbies-checkbox-${hobbyNumber}"]`);
  }

  get subjectsAutoCompleteOption(): Locator {
    return this.page.locator('.subjects-auto-complete__option');
  }

  get subjectsSelectedValue(): Locator {
    return this.page.locator('.subjects-auto-complete__multi-value');
  }

  reactSelectOption(text: string): Locator {
    return this.page.locator(`div[id*="react-select"][id*="option"]:has-text("${text}")`);
  }

  // Page methods
  async navigateToForm(): Promise<void> {
    await this.navigateTo(URLS.BASE_URL + URLS.PRACTICE_FORM);
  }

  async fillPersonalInfo(data: FormData): Promise<void> {
    await this.fillInput(this.firstNameInput, data.firstName);
    await this.fillInput(this.lastNameInput, data.lastName);
    await this.fillInput(this.emailInput, data.email);
    await this.clickElement(this.genderRadioLabel(data.gender));
    await this.fillInput(this.mobileInput, data.mobile);
  }

  async fillDateOfBirth(dateData: FormData['dateOfBirth']): Promise<void> {
    await this.clickElement(this.dateOfBirthInput);
    
    // Select month
    await this.selectOption(this.page.locator('.react-datepicker__month-select'), dateData.month);
    
    // Select year
    await this.selectOption(this.page.locator('.react-datepicker__year-select'), dateData.year);
    
    // Select day
    const dayLocator = this.page.locator(`.react-datepicker__day--0${dateData.day}:not(.react-datepicker__day--outside-month)`);
    await this.clickElement(dayLocator);
  }

  async fillSubjects(subjects: string[]): Promise<void> {
    for (const subject of subjects) {
      await this.fillInput(this.subjectsInput, subject);
      await this.waitForElement(this.subjectsAutoCompleteOption);
      await this.clickElement(this.subjectsAutoCompleteOption.first());
    }
  }

  async selectHobbies(hobbies: string[]): Promise<void> {
    for (const hobby of hobbies) {
      await this.clickElement(this.hobbyCheckboxLabel(hobby));
    }
  }

  async uploadPicture(filePath: string): Promise<void> {
    if (filePath) {
      await this.uploadPictureInput.setInputFiles(filePath);
    }
  }

  async fillAddress(address: string): Promise<void> {
    await this.fillInput(this.addressInput, address);
  }

  async selectStateAndCity(state: string, city: string): Promise<void> {
    // Select state
    await this.clickElement(this.stateDropdown);
    await this.clickElement(this.reactSelectOption(state));
    
    // Select city
    await this.clickElement(this.cityDropdown);
    await this.clickElement(this.reactSelectOption(city));
  }

  async submitForm(): Promise<void> {
    await this.scrollToElement(this.submitButton);
    await this.clickElement(this.submitButton);
  }

  async verifySubmissionSuccess(): Promise<void> {
    await this.waitForElement(this.confirmationModal);
    await expect(this.confirmationModal).toBeVisible();
    await expect(this.confirmationTitle).toHaveText('Thanks for submitting the form');
  }

  async closeConfirmationModal(): Promise<void> {
    await this.clickElement(this.closeButton);
  }

  async verifyFieldValidation(field: Locator, shouldHaveError: boolean = true): Promise<void> {
    const expectedColor = shouldHaveError ? VALIDATION_COLORS.ERROR : VALIDATION_COLORS.SUCCESS;
    await expect(field).toHaveCSS('border-color', expectedColor);
  }

  async fillCompleteForm(data: FormData): Promise<void> {
    await this.fillPersonalInfo(data);
    await this.fillDateOfBirth(data.dateOfBirth);
    
    await this.scrollToElement(this.subjectsInput);
    await this.fillSubjects(data.subjects);
    
    await this.selectHobbies(data.hobbies);
    
    await this.scrollToElement(this.addressInput);
    await this.fillAddress(data.address);
    
    await this.selectStateAndCity(data.state, data.city);
  }
}
