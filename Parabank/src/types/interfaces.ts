// src/types/interfaces.ts

export interface AdminCredentials {
  username: string;
  password: string;
}

export interface UserData {
  firstName: string;
  lastName: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  phoneNumber: string;
  ssn: string;
  username: string;
  password: string;
}

export interface DatabaseConfig {
  loanProvider: 'funds' | 'combined' | 'wsapi';
  dataAccessMode: 'jdbc' | 'jpa';
  initialBalance: number;
  minimumBalance: number;
}

export interface TestResult {
  testName: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: string;
  screenshots?: string[];
}

export interface AdminPageElements {
  // Login elements
  usernameInput: string;
  passwordInput: string;
  loginButton: string;
  
  // Database management
  initializeButton: string;
  cleanButton: string;
  
  // Configuration
  loanProviderSelect: string;
  dataAccessModeSelect: string;
  
  // Settings
  initialBalanceInput: string;
  minimumBalanceInput: string;
  
  // Messages
  successMessage: string;
  errorMessage: string;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode: number;
}

export interface DatabaseStatus {
  initialized: boolean;
  recordCount: number;
  lastModified: string;
}

export interface LoanProviderConfig {
  provider: string;
  enabled: boolean;
  endpoint?: string;
  timeout?: number;
}

export interface TestConfiguration {
  browser: 'chromium' | 'firefox' | 'webkit';
  headless: boolean;
  viewport: {
    width: number;
    height: number;
  };
  timeout: number;
  retries: number;
}
