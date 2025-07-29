export interface User {
  username: string;
  password: string;
}

export interface Product {
  name: string;
  dataTestId: string;
  price?: string;
  description?: string;
}

export interface TestConfig {
  baseUrl: string;
  timeout: number;
}
