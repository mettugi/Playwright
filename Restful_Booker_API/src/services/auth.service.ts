import { APIRequestContext } from '@playwright/test';
import { AuthRequest, AuthResponse } from '../types/booking.types';
import { ApiUtils } from '../utils/api.utils';
import { Logger } from '../utils/logger.utils';

export class AuthService {
  private apiUtils: ApiUtils;

  constructor(private request: APIRequestContext) {
    this.apiUtils = new ApiUtils(request);
  }

  async createToken(credentials: AuthRequest): Promise<string> {
    Logger.info('Creating authentication token');
    
    const response = await this.apiUtils.makeRequest('POST', '/auth', {
      data: credentials
    });

    await this.apiUtils.validateResponse(response, 200);
    const authResponse: AuthResponse = await this.apiUtils.getResponseBody(response);
    
    Logger.info('Token created successfully');
    return authResponse.token;
  }

  async getDefaultToken(): Promise<string> {
    const defaultCredentials: AuthRequest = {
      username: process.env.DEFAULT_USERNAME || 'admin',
      password: process.env.DEFAULT_PASSWORD || 'password123'
    };

    return await this.createToken(defaultCredentials);
  }
}
