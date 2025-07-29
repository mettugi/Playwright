```markdown
# Sauce Demo Playwright Automation

This project contains automated tests for the Sauce Demo website using Playwright and TypeScript.

## Project Structure

- **src/pages/**: Page Object Model classes
- **src/utils/**: Utility classes and test data
- **src/types/**: TypeScript type definitions
- **tests/**: Test specification files
- **test-results/**: Generated test reports and artifacts

## Setup Instructions

1. **Clone and install dependencies:**
   ```bash
   npm install
   npx playwright install
   ```

2. **Run tests:**
   ```bash
   # Run all tests
   npm test

   # Run with UI mode
   npm run test:ui

   # Run specific test suite
   npm run test:cart
   npm run test:login
   npm run test:navigation

   # Run in headed mode
   npm run test:headed
   ```

3. **View test reports:**
   ```bash
   npm run test:report
   ```

## Test Cases Covered

### Cart Tests
- **Test Case 1**: Login and add Sauce Labs Backpack to cart
- **Test Case 2**: Login and add Sauce Labs Fleece Jacket to cart
- Multiple items cart test

### Navigation Tests
- **Test Case 3**: Navigate to About page via hamburger menu
- Logout functionality test

### Login Tests
- Valid credential login
- Invalid credential error handling

## Features

- **Page Object Model**: Organized and maintainable code structure
- **TypeScript**: Type safety and better IDE support
- **Parallel Execution**: Tests run in parallel for faster execution
- **Multiple Browsers**: Chrome, Firefox, and Safari support
- **Test Reports**: HTML, JSON, and JUnit reports
- **Screenshots & Videos**: Captured on test failures
- **Environment Configuration**: Configurable via environment variables

## Configuration

The project uses `playwright.config.ts` for configuration and `.env` for environment variables.

Key configurations:
- Base URL: https://www.saucedemo.com
- Multiple browser support
- Automatic screenshots and videos on failure
- Parallel test execution
