import { APIRequestContext, expect } from '@playwright/test';

export class ApiUtils {
  constructor(private request: APIRequestContext) {}

  async makeRequest(method: 'GET' | 'POST' | 'PUT' | 'DELETE', endpoint: string, options?: any) {
    const response = await this.request[method.toLowerCase()](endpoint, options);
    return response;
  }

  async validateResponse(response: any, expectedStatus: number) {
    expect(response.status()).toBe(expectedStatus);
    return response;
  }

  async getResponseBody(response: any) {
    const body = await response.json();
    return body;
  }

  async validateSchema(data: any, requiredFields: string[]) {
    requiredFields.forEach(field => {
      expect(data).toHaveProperty(field);
    });
  }
}
