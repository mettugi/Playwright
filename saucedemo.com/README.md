# SauceDemo Automation Testing Suite

A comprehensive Playwright TypeScript automation testing suite for SauceDemo.com login scenarios, designed as a portfolio showcase for QA automation skills.

## 🚀 Features

- **Complete Login Scenario Coverage**: Tests for all user types including edge cases
- **Page Object Model**: Clean, maintainable code architecture
- **Cross-Browser Testing**: Chrome, Firefox, Safari, and mobile browsers
- **Data-Driven Tests**: Parameterized tests for efficient coverage
- **Security Testing**: SQL injection, XSS, and other security scenarios
- **Performance Testing**: Load time and response time validation
- **Visual Testing**: Screenshot comparison capabilities
- **CI/CD Ready**: GitHub Actions integration
- **Comprehensive Reporting**: HTML, JSON, and JUnit reports

## 📋 Test Coverage

### Successful Login Tests
- Standard user login
- Problem user login (with known issues)
- Performance glitch user (slower response)
- Error user login
- Visual user login

### Failed Login Tests
- Locked out user
- Invalid username/password combinations
- Empty field validations
- SQL injection attempts
- XSS prevention testing

### UI Interaction Tests
- Error message handling
- Form field clearing
- Keyboard navigation (Enter key)
- Session management

## 🛠 Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   npm run install:browsers
   ```

2. **Run Tests**
   ```bash
   # Run all tests
   npm test
   
   # Run in headed mode
   npm run test:headed
   
   # Run specific browser
   npm run test:chrome
   
   # Run with UI mode
   npm run test:ui
   
   # Debug mode
   npm run test:debug
   ```

3. **View Reports**
   ```bash
   npm run report
   ```

## 📊 Test Results

- **HTML Report**: Interactive test results with screenshots and videos
- **JSON Report**: Machine-readable results for CI/CD integration
- **JUnit Report**: Compatible with most CI/CD platforms

## 🏗 Architecture

- **Page Object Model**: Separate classes for each page (LoginPage, ProductsPage)
- **Test Data Management**: Centralized test data configuration
- **Custom Utilities**: Helper functions for common operations
- **Type Safety**: Full TypeScript implementation

## 🎯 Portfolio Highlights

This project demonstrates:
- Advanced Playwright testing techniques
- Clean code architecture and best practices
- Comprehensive test coverage strategies
- Cross-browser and mobile testing
- Security testing awareness
- Performance testing implementation
- Professional documentation and setup

## 📈 Metrics

- **Test Cases**: 25+ comprehensive scenarios
- **Browser Coverage**: 5 different browsers/devices
- **Code Coverage**: Login flow and error handling
- **Execution Time**: Optimized for CI/CD pipelines
