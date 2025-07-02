// src/config/environment.ts
import * as dotenv from 'dotenv';

dotenv.config();

export interface EnvironmentConfig {
  baseUrl: string;
  adminCredentials: {
    username: string;
    password: string;
  };
  timeouts: {
    default: number;
    navigation: number;
    assertion: number;
  };
  browser: {
    headless: boolean;
    slowMo: number;
  };
  database: {
    host: string;
    port: number;
    name: string;
  };
  features: {
    enableTrace: boolean;
    enableVideo: boolean;
    enableScreenshots: boolean;
  };
}

export const environment: EnvironmentConfig = {
  baseUrl: process.env.BASE_URL || 'https://parabank.parasoft.com/parabank',
  adminCredentials: {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD || 'admin',
  },
  timeouts: {
    default: parseInt(process.env.TIMEOUT || '30000'),
    navigation: 30000,
    assertion: 10000,
  },
  browser: {
    headless: process.env.HEADLESS === 'true',
    slowMo: parseInt(process.env.SLOW_MO || '0'),
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    name: process.env.DB_NAME || 'parabank_test',
  },
  features: {
    enableTrace: process.env.ENABLE_TRACE === 'true',
    enableVideo: process.env.ENABLE_VIDEO === 'true',
    enableScreenshots: process.env.ENABLE_SCREENSHOTS === 'true',
  },
};

export const getEnvironment = (): EnvironmentConfig => environment;
