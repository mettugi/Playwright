// Project Structure:
// 
// demoqa-playwright-automation/
// ├── src/
// │   ├── pages/
// │   │   ├── base/
// │   │   │   └── BasePage.ts
// │   │   └── PracticeFormPage.ts
// │   ├── data/
// │   │   ├── interfaces/
// │   │   │   └── FormData.ts
// │   │   └── testData.ts
// │   ├── utils/
// │   │   ├── helpers.ts
// │   │   └── constants.ts
// │   └── fixtures/
// │       └── pageFixtures.ts
// ├── tests/
// │   ├── practice-form/
// │   │   ├── form-submission.spec.ts
// │   │   ├── form-validation.spec.ts
// │   │   └── form-components.spec.ts
// │   └── global-setup.ts
// ├── test-results/
// ├── screenshots/
// ├── videos/
// ├── reports/
// ├── config/
// │   ├── playwright.config.ts
// │   └── test-environments.ts
// ├── package.json
// ├── tsconfig.json
// └── README.md

// ===========================================
// File: src/data/interfaces/FormData.ts
// ===========================================

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

// ===========================================
// File: src/data/testData.ts
// ===========================================

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

// ===========================================
// File: src/utils/constants.ts
// ===========================================

export const URLS = {
  BASE_URL: 'https://demoqa.com',
  PRACTICE_FORM: '/automation-practice-form'
};

export const TIMEOUTS = {
  SHORT: 5000,
  MEDIUM: 10000,
  LONG: 30000
};

export const GENDER_MAP = {
  Male: '1',
  Female: '2',
  Other: '3'
};

export const HOBBY_MAP = {
  Sports: '1',
  Reading: '2',
  Music: '3'
};

export const VALIDATION_COLORS = {
  ERROR: 'rgb(220, 53, 69)',
  SUCCESS: 'rgb(40, 167, 69)'
};

// ===========================================
// File: src/utils/helpers.ts
// ===========================================

import { Page } from '@playwright/test';

export class TestHelpers {
  static async waitForPageLoad(page: Page) {
    await page.waitForLoadState('networkidle');
  }

  static async scrollToElement(page: Page, locator: any) {
    await locator.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500); // Small delay after scrolling
  }

  static async takeScreenshot(page: Page, name: string) {
    await page.screenshot({ 
      path: `screenshots/${name}-${Date.now()}.png`,
      fullPage: true 
    });
  }

  static generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  static generateRandomEmail(): string {
    const username = this.generateRandomString(8);
    const domain = this.generateRandomString(5);
    return `${username}@${domain}.com`;
  }

  static generateRandomMobile(): string {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
  }
}

// ===========================================
// File: src/pages/base/BasePage.ts
// ===========================================

import { Page, Locator } from '@playwright/test';
import { TestHelpers } from '../../utils/helpers';
import { TIMEOUTS } from '../../utils/constants';

export abstract class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(url: string) {
    await this.page.goto(url);
    await TestHelpers.waitForPageLoad(this.page);
  }

  async clickElement(locator: Locator) {
    await locator.click();
  }

  async fillInput(locator: Locator, text: string) {
    await locator.clear();
    await locator.fill(text);
  }

  async selectOption(locator: Locator, option: string) {
    await locator.selectOption(option);
  }

  async waitForElement(locator: Locator, timeout: number = TIMEOUTS.MEDIUM) {
    await locator.waitFor({ timeout });
  }

  async isElementVisible(locator: Locator): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
      return true;
    } catch {
      return false;
    }
  }

  async scrollToElement(locator: Locator) {
    await TestHelpers.scrollToElement(this.page, locator);
  }

  async takeScreenshot(name: string) {
    await TestHelpers.takeScreenshot(this.page, name);
  }
}

// ===========================================
// File: src/pages/PracticeFormPage.ts
// ===========================================

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

// ===========================================
// File: src/fixtures/pageFixtures.ts
// ===========================================

import { test as base } from '@playwright/test';
import { PracticeFormPage } from '../pages/PracticeFormPage';

type PageFixtures = {
  practiceFormPage: PracticeFormPage;
};

export const test = base.extend<PageFixtures>({
  practiceFormPage: async ({ page }, use) => {
    const practiceFormPage = new PracticeFormPage(page);
    await use(practiceFormPage);
  },
});

export { expect } from '@playwright/test';

// ===========================================
// File: tests/practice-form/form-submission.spec.ts
// ===========================================

import { test, expect } from '../../src/fixtures/pageFixtures';
import { validFormData, femaleUserData } from '../../src/data/testData';

test.describe('Practice Form Submission Tests', () => {
  test.beforeEach(async ({ practiceFormPage }) => {
    await practiceFormPage.navigateToForm();
  });

  test('Submit complete form with valid data - Male user', async ({ practiceFormPage }) => {
    await practiceFormPage.fillCompleteForm(validFormData);
    await practiceFormPage.submitForm();
    await practiceFormPage.verifySubmissionSuccess();
    await practiceFormPage.closeConfirmationModal();
  });

  test('Submit complete form with valid data - Female user', async ({ practiceFormPage }) => {
    await practiceFormPage.fillCompleteForm(femaleUserData);
    await practiceFormPage.submitForm();
    await practiceFormPage.verifySubmissionSuccess();
    await practiceFormPage.closeConfirmationModal();
  });

  test('Submit form with only required fields', async ({ practiceFormPage }) => {
    const minimalData = {
      ...validFormData,
      subjects: [],
      hobbies: [],
      address: '',
      state: '',
      city: ''
    };

    await practiceFormPage.fillPersonalInfo(minimalData);
    await practiceFormPage.submitForm();
    await practiceFormPage.verifySubmissionSuccess();
    await practiceFormPage.closeConfirmationModal();
  });
});

// ===========================================
// File: tests/practice-form/form-validation.spec.ts
// ===========================================

import { test, expect } from '../../src/fixtures/pageFixtures';
import { invalidFormData } from '../../src/data/testData';

test.describe('Practice Form Validation Tests', () => {
  test.beforeEach(async ({ practiceFormPage }) => {
    await practiceFormPage.navigateToForm();
  });

  test('Validate required fields on empty form submission', async ({ practiceFormPage }) => {
    await practiceFormPage.submitForm();
    
    // Check required field validations
    await practiceFormPage.verifyFieldValidation(practiceFormPage.firstNameInput);
    await practiceFormPage.verifyFieldValidation(practiceFormPage.lastNameInput);
    await practiceFormPage.verifyFieldValidation(practiceFormPage.mobileInput);
  });

  test('Validate email format', async ({ practiceFormPage }) => {
    await practiceFormPage.fillInput(practiceFormPage.emailInput, 'invalid-email');
    await practiceFormPage.submitForm();
    
    await practiceFormPage.verifyFieldValidation(practiceFormPage.emailInput);
  });

  test('Validate mobile number format', async ({ practiceFormPage }) => {
    await practiceFormPage.fillInput(practiceFormPage.mobileInput, '123');
    await practiceFormPage.submitForm();
    
    await practiceFormPage.verifyFieldValidation(practiceFormPage.mobileInput);
  });

  test('Validate mobile number length', async ({ practiceFormPage }) => {
    await practiceFormPage.fillInput(practiceFormPage.mobileInput, '12345678901'); // 11 digits
    await practiceFormPage.submitForm();
    
    await practiceFormPage.verifyFieldValidation(practiceFormPage.mobileInput);
  });
});

// ===========================================
// File: tests/practice-form/form-components.spec.ts
// ===========================================

import { test, expect } from '../../src/fixtures/pageFixtures';
import { validFormData } from '../../src/data/testData';

test.describe('Practice Form Components Tests', () => {
  test.beforeEach(async ({ practiceFormPage }) => {
    await practiceFormPage.navigateToForm();
  });

  test('Test date picker functionality', async ({ practiceFormPage }) => {
    await practiceFormPage.fillDateOfBirth(validFormData.dateOfBirth);
    await expect(practiceFormPage.dateOfBirthInput).not.toHaveValue('');
  });

  test('Test subjects autocomplete', async ({ practiceFormPage }) => {
    await practiceFormPage.scrollToElement(practiceFormPage.subjectsInput);
    
    await practiceFormPage.fillInput(practiceFormPage.subjectsInput, 'Math');
    await expect(practiceFormPage.subjectsAutoCompleteOption).toBeVisible();
    await practiceFormPage.clickElement(practiceFormPage.subjectsAutoCompleteOption.first());
    
    await expect(practiceFormPage.subjectsSelectedValue).toContainText('Maths');
  });

  test('Test gender radio buttons', async ({ practiceFormPage }) => {
    await practiceFormPage.clickElement(practiceFormPage.genderRadioLabel('Male'));
    await expect(practiceFormPage.page.locator('input[name="gender"][value="Male"]')).toBeChecked();
    
    await practiceFormPage.clickElement(practiceFormPage.genderRadioLabel('Female'));
    await expect(practiceFormPage.page.locator('input[name="gender"][value="Female"]')).toBeChecked();
    await expect(practiceFormPage.page.locator('input[name="gender"][value="Male"]')).not.toBeChecked();
  });

  test('Test hobby checkboxes', async ({ practiceFormPage }) => {
    await practiceFormPage.clickElement(practiceFormPage.hobbyCheckboxLabel('Sports'));
    await practiceFormPage.clickElement(practiceFormPage.hobbyCheckboxLabel('Reading'));
    
    await expect(practiceFormPage.page.locator('input[id="hobbies-checkbox-1"]')).toBeChecked();
    await expect(practiceFormPage.page.locator('input[id="hobbies-checkbox-2"]')).toBeChecked();
  });

  test('Test state and city dropdown dependency', async ({ practiceFormPage }) => {
    await practiceFormPage.scrollToElement(practiceFormPage.stateDropdown);
    
    await practiceFormPage.clickElement(practiceFormPage.stateDropdown);
    await practiceFormPage.clickElement(practiceFormPage.reactSelectOption('NCR'));
    
    await expect(practiceFormPage.cityDropdown).toBeEnabled();
    
    await practiceFormPage.clickElement(practiceFormPage.cityDropdown);
    await practiceFormPage.clickElement(practiceFormPage.reactSelectOption('Delhi'));
    
    await expect(practiceFormPage.stateDropdown).toContainText('NCR');
    await expect(practiceFormPage.cityDropdown).toContainText('Delhi');
  });
});

// ===========================================
// File: config/playwright.config.ts
// ===========================================

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'reports/html-report' }],
    ['json', { outputFile: 'reports/test-results.json' }],
    ['junit', { outputFile: 'reports/test-results.xml' }],
  ],
  use: {
    baseURL: 'https://demoqa.com',
    headless: process.env.CI ? true : false,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  outputDir: 'test-results/',
});

// ===========================================
// File: package.json
// ===========================================

{
  "name": "demoqa-playwright-automation",
  "version": "1.0.0",
  "description": "Playwright automation tests for DemoQA practice form",
  "main": "index.js",
  "scripts": {
    "test": "playwright test",
    "test:headed": "playwright test --headed",
    "test:ui": "playwright test --ui",
    "test:chrome": "playwright test --project=chromium",
    "test:firefox": "playwright test --project=firefox",
    "test:safari": "playwright test --project=webkit",
    "test:mobile": "playwright test --project=mobile-chrome",
    "test:debug": "playwright test --debug",
    "test:report": "playwright show-report reports/html-report",
    "test:trace": "playwright show-trace",
    "install:browsers": "playwright install",
    "lint": "eslint src tests --ext .ts",
    "format": "prettier --write src tests"
  },
  "keywords": ["playwright", "automation", "testing", "demoqa"],
  "author": "Your Name",
  "license": "MIT",
  "devDependencies": {
    "@playwright/test": "^1.40.0",
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "eslint": "^8.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "prettier": "^3.0.0"
  }
}

// ===========================================
// File: tsconfig.json
// ===========================================

{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./",
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"],
      "@pages/*": ["src/pages/*"],
      "@data/*": ["src/data/*"],
      "@utils/*": ["src/utils/*"],
      "@fixtures/*": ["src/fixtures/*"]
    }
  },
  "include": [
    "src/**/*",
    "tests/**/*",
    "config/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "test-results",
    "reports"
  ]
}

// ===========================================
// File: README.md
// ===========================================

# DemoQA Playwright Automation

A comprehensive Playwright TypeScript automation framework for testing the DemoQA practice form.

## 📁 Project Structure

```
demoqa-playwright-automation/
├── src/
│   ├── pages/              # Page Object Models
│   ├── data/               # Test data and interfaces
│   ├── utils/              # Utility functions and constants
│   └── fixtures/           # Playwright fixtures
├── tests/                  # Test specifications
├── config/                 # Configuration files
├── reports/                # Test reports
└── test-results/           # Test execution results
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Install Playwright browsers:
   ```bash
   npm run install:browsers
   ```

## 🧪 Running Tests

### All Tests
```bash
npm test
```

### Specific Browser
```bash
npm run test:chrome
npm run test:firefox
npm run test:safari
```

### With UI Mode
```bash
npm run test:ui
```

### Debug Mode
```bash
npm run test:debug
```

### Mobile Testing
```bash
npm run test:mobile
```

## 📊 Reports

### View HTML Report
```bash
npm run test:report
```

### View Trace
```bash
npm run test:trace
```

## 🏗️ Architecture

### Page Object Model
- **BasePage**: Common page functionality
- **PracticeFormPage**: Form-specific methods and locators

### Data Management
- **Interfaces**: Type definitions for form data
- **Test Data**: Predefined test datasets
- **Constants**: Application constants and mappings

### Utilities
- **Helpers**: Common utility functions
- **Fixtures**: Playwright test fixtures

## 📋 Test Coverage

### Form Submission Tests
- Complete form submission with valid data
- Minimal required fields submission
- Different user personas (Male/Female)

### Validation Tests
- Required field validation
- Email format validation
- Mobile number validation

### Component Tests
- Date picker functionality
- Subjects autocomplete
- Gender radio buttons
- Hobby checkboxes
- State/City dropdown dependency

## 🔧 Configuration

The project supports multiple environments and browsers:
- **Browsers**: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari
- **Reporting**: HTML, JSON, JUnit
- **Screenshots**: On failure
- **Videos**: On failure
- **Traces**: On retry

## 🎯 Best Practices

- Page Object Model for maintainability
- TypeScript for type safety
- Fixtures for test setup
- Proper error handling
- Comprehensive reporting
- Cross-browser testing
- Mobile responsive testing

## 📝 Contributing

1. Follow the existing code structure
2. Add appropriate tests for new features
3. Update documentation as needed
4. Run tests before submitting changes

## 📞 Support

For questions or issues, please refer to the Playwright documentation or create an issue in the repository.
