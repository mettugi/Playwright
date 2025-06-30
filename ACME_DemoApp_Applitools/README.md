# Applitools Demo Site Automation

This project contains a comprehensive Playwright TypeScript automation suite for the Applitools demo site (https://demo.applitools.com/).

## Project Structure

```
applitools-automation/
├── package.json           # Project dependencies and scripts
├── playwright.config.ts   # Playwright configuration
├── tsconfig.json         # TypeScript configuration
├── .env                  # Environment variables
├── pages/                # Page Object Models
│   ├── BasePage.ts
│   ├── LoginPage.ts
│   └── DashboardPage.ts
├── tests/                # Test specifications
│   ├── login.spec.ts
│   ├── dashboard.spec.ts
│   └── visual.spec.ts
├── utils/                # Utility functions and data
│   ├── TestData.ts
│   ├── Helpers.ts
│   └── Constants.ts
├── fixtures/             # Test fixtures
│   └── testFixtures.ts
└── reports/              # Generated reports
```

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   npx playwright install
   ```

2. **Environment Configuration**
   - Copy `.env.example` to `.env`
   - Update environment variables as needed

3. **Run Tests**
   ```bash
   # Run all tests
   npm test

   # Run with browser visible
   npm run test:headed

   # Run specific test suite
   npm run test:login
   npm run test:dashboard
   npm run test:visual

   # Debug tests
   npm run test:debug
   ```

## Features

- **Page Object Model**: Clean separation of test logic and page interactions
- **TypeScript**: Full type safety and IntelliSense support
- **Cross-browser Testing**: Chrome, Firefox, Safari, and mobile browsers
- **Visual Regression**: Screenshot comparison testing
- **Data-driven Tests**: Parameterized test execution
- **Comprehensive Reporting**: HTML, JSON, and JUnit reports
- **CI/CD Ready**: Configured for continuous integration

## Test Categories

1. **Login Tests** (`login.spec.ts`)
   - Form validation
   - Successful/unsuccessful login attempts
   - Remember Me functionality
   - Social media integration

2. **Dashboard Tests** (`dashboard.spec.ts`)
   - Dashboard loading verification
   - Navigation functionality
   - Logout functionality

3. **Visual Tests** (`visual.spec.ts`)
   - Cross-browser visual consistency
   - Responsive design validation
   - Screenshot comparisons

## Best Practices

- Page Object Model for maintainability
- Explicit waits for reliability
- Proper error handling
- Clean test data management
- Comprehensive assertions
- Visual regression testing
  
