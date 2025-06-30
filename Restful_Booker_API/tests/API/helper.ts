// tests/api/helpers.ts
import { request as playwrightRequest, APIRequestContext } from '@playwright/test';

export async function createRequestContext(): Promise<APIRequestContext> {
  return await playwrightRequest.newContext({
    baseURL: 'https://restful-booker.herokuapp.com',
    extraHTTPHeaders: { 'Content-Type': 'application/json' },
  });
}
