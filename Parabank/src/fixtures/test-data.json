// src/fixtures/test-data.json
{
  "adminCredentials": {
    "valid": {
      "username": "admin",
      "password": "admin"
    },
    "invalid": {
      "username": "wronguser",
      "password": "wrongpass"
    }
  },
  "testUsers": [
    {
      "firstName": "John",
      "lastName": "Doe",
      "address": {
        "street": "123 Main St",
        "city": "Anytown",
        "state": "CA",
        "zipCode": "12345"
      },
      "phoneNumber": "555-1234",
      "ssn": "123-45-6789",
      "username": "johndoe123",
      "password": "password123"
    },
    {
      "firstName": "Jane",
      "lastName": "Smith",
      "address": {
        "street": "456 Oak Ave",
        "city": "Somewhere",
        "state": "NY",
        "zipCode": "67890"
      },
      "phoneNumber": "555-5678",
      "ssn": "987-65-4321",
      "username": "janesmith456",
      "password": "password456"
    }
  ],
  "databaseConfigs": {
    "default": {
      "loanProvider": "funds",
      "dataAccessMode": "jdbc",
      "initialBalance": 515.50,
      "minimumBalance": 100.00
    },
    "alternative": {
      "loanProvider": "combined",
      "dataAccessMode": "jpa",
      "initialBalance": 1000.00,
      "minimumBalance": 50.00
    }
  },
  "apiEndpoints": {
    "database": "/services/bank/database",
    "initialize": "/services/bank/initializeDB",
    "clean": "/services/bank/cleanDB",
    "customers": "/services/bank/customers",
    "accounts": "/services/bank/accounts"
  },
  "selectors": {
    "admin": {
      "usernameInput": "input[name='username']",
      "passwordInput": "input[name='password']",
      "loginButton": "input[type='submit'], button[type='submit']",
      "initializeButton": "input[value='Initialize']",
      "cleanButton": "input[value='Clean']",
      "loanProviderSelect": "select[name='loanProvider']",
      "dataAccessModeSelect": "select[name='accessMode']",
      "initialBalanceInput": "input[name='initialBalance']",
      "minimumBalanceInput": "input[name='minimumBalance']",
      "submitButton": "input[type='submit'][value='Submit']",
      "successMessage": ".success, .message",
      "errorMessage": ".error, .alert"
    },
    "registration": {
      "firstNameInput": "input[name='customer.firstName']",
      "lastNameInput": "input[name='customer.lastName']",
      "addressInput": "input[name='customer.address.street']",
      "cityInput": "input[name='customer.address.city']",
      "stateInput": "input[name='customer.address.state']",
      "zipCodeInput": "input[name='customer.address.zipCode']",
      "phoneInput": "input[name='customer.phoneNumber']",
      "ssnInput": "input[name='customer.ssn']",
      "usernameInput": "input[name='customer.username']",
      "passwordInput": "input[name='customer.password']",
      "confirmPasswordInput": "input[name='repeatedPassword']",
      "registerButton": "input[type='submit'][value='Register']"
    }
  },
  "urls": {
    "admin": "/admin.htm",
    "login": "/login.htm",
    "register": "/register.htm",
    "home": "/",
    "services": "/services"
  },
  "timeouts": {
    "short": 5000,
    "medium": 10000,
    "long": 30000
  },
  "testCategories": {
    "smoke": ["admin-login", "database-initialize"],
    "regression": ["configuration-change", "user-management"],
    "api": ["database-status", "customer-operations"]
  }
}
