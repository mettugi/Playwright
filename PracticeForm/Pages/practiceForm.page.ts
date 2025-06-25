import { Page, Locator } from '@playwright/test';

export class PracticeFormPage {
  readonly page: Page;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly email: Locator;
  readonly gender: Locator;
  readonly mobile: Locator;
  readonly dateOfBirthInput: Locator;
  readonly subjectsInput: Locator;
  readonly hobbies: Locator;
  readonly uploadPicture: Locator;
  readonly address: Locator;
  readonly stateDropdown: Locator;
  readonly cityDropdown: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstName = page.locator('#firstName');
    this.lastName = page.locator('#lastName');
    this.email = page.locator('#userEmail');
    this.gender = page.locator('label[for^="gender-radio"]');
    this.mobile = page.locator('#userNumber');
    this.dateOfBirthInput = page.locator('#dateOfBirthInput');
    this.subjectsInput = page.locator('#subjectsInput');
    this.hobbies = page.locator('label[for^="hobbies-checkbox"]');
    this.uploadPicture = page.locator('#uploadPicture');
    this.address = page.locator('#currentAddress');
    this.stateDropdown = page.locator('#state');
    this.cityDropdown = page.locator('#city');
    this.submitButton = page.locator('#submit');
  }

  async open() {
    await this.page.goto('https://demoqa.com/automation-practice-form');
    await this.page.waitForLoadState('networkidle');
  }

  async fillForm(data: {
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
    mobile: string;
    dob: string;
    subjects: string[];
    hobbies: string[];
    picturePath: string;
    address: string;
    state: string;
    city: string;
  }) {
    await this.firstName.fill(data.firstName);
    await this.lastName.fill(data.lastName);
    await this.email.fill(data.email);
    await this.page.locator(`label[for="gender-radio-${data.gender}"]`).click();
    await this.mobile.fill(data.mobile);

    // Date Picker
    await this.dateOfBirthInput.click();
    await this.page.keyboard.press('Control+A');
    await this.page.keyboard.type(data.dob);
    await this.page.keyboard.press('Enter');

    for (const subject of data.subjects) {
      await this.subjectsInput.fill(subject);
      await this.page.keyboard.press('Enter');
    }

    for (const hobby of data.hobbies) {
      await this.page.locator(`label[for="hobbies-checkbox-${hobby}"]`).click();
    }

    await this.uploadPicture.setInputFiles(data.picturePath);
    await this.address.fill(data.address);

    await this.stateDropdown.click();
    await this.page.locator(`div[id^="react-select-3-option-"]`, { hasText: data.state }).click();

    await this.cityDropdown.click();
    await this.page.locator(`div[id^="react-select-4-option-"]`, { hasText: data.city }).click();

    await this.submitButton.click();
  }
}
