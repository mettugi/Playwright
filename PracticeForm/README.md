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
