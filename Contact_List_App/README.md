API Doc 
```
https://documenter.getpostman.com/view/4012288/TzK2bEa8
```
# Contact List Automation - Folder Structure

```
contact-list-automation/
├── package.json
├── playwright.config.ts
├── tsconfig.json
├── .env
├── .gitignore
├── README.md
│
├── tests/
│   ├── auth/
│   │   ├── login.spec.ts
│   │   ├── signup.spec.ts
│   │   └── logout.spec.ts
│   │
│   ├── contacts/
│   │   ├── create-contact.spec.ts
│   │   ├── edit-contact.spec.ts
│   │   ├── delete-contact.spec.ts
│   │   └── view-contacts.spec.ts
│   │
│   ├── api/
│   │   ├── auth-api.spec.ts
│   │   └── contacts-api.spec.ts
│   │
│   └── e2e/
│       ├── full-user-journey.spec.ts
│       └── contact-management-flow.spec.ts
│
├── pages/
│   ├── base-page.ts
│   ├── login-page.ts
│   ├── signup-page.ts
│   ├── contacts-page.ts
│   ├── add-contact-page.ts
│   └── contact-details-page.ts
│
├── fixtures/
│   ├── auth-fixture.ts
│   ├── contact-fixture.ts
│   └── api-fixture.ts
│
├── utils/
│   ├── global-setup.ts
│   ├── global-teardown.ts
│   ├── test-data.ts
│   ├── helpers.ts
│   └── constants.ts
│
├── data/
│   ├── test-users.json
│   └── test-contacts.json
│
└── test-results/
    ├── html-report/
    ├── screenshots/
    ├── videos/
    └── traces/
```

## Key Components:

### Tests Organization:
- **auth/**: Authentication related tests (login, signup, logout)
- **contacts/**: Contact management tests (CRUD operations)
- **api/**: API testing for backend validation
- **e2e/**: End-to-end user journey tests

### Page Objects:
- **pages/**: Page Object Model implementation for maintainable tests

### Fixtures:
- **fixtures/**: Reusable test fixtures for authentication and data setup

### Utilities:
- **utils/**: Helper functions, test data, and global setup/teardown

### Data:
- **data/**: Test data files in JSON format

### Reports:
- **test-results/**: Test execution results, screenshots, videos, and traces
