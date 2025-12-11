/**
 * HTTP Client
 * Handles all API requests with token management and error handling
 */

import { API_BASE_URL, getStoredToken } from './config';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  status?: number;
}

export interface ApiRequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

class HttpClient {
  private baseUrl: string;
  private defaultTimeout: number = 30000; // 30 seconds

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Make HTTP request with automatic token injection
   */
  async request<T>(
    endpoint: string,
    config: ApiRequestConfig = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = this.buildUrl(endpoint, config);
      const headers = this.buildHeaders(config.headers);
      const timeout = config.timeout || this.defaultTimeout;
      const method = config.method || 'GET';

      console.log(`\n[API-REQUEST-START] ${new Date().toISOString()}`);
      console.log(`  Method: ${method}`);
      console.log(`  URL: ${url}`);
      console.log(`  Headers:`, JSON.stringify(headers, null, 2));
      if (config.body) {
        console.log(`  Body:`, JSON.stringify(config.body, null, 2));
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        method,
        headers,
        body: config.body ? JSON.stringify(config.body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log(`[API-RESPONSE] Status: ${response.status} ${response.statusText}`);
      console.log(`  Content-Type: ${response.headers.get('content-type')}`);

      if (!response.ok) {
        console.error(`[API-ERROR] HTTP ${response.status}`);
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
        };
      }

      const data = (await response.json()) as T;

      console.log(`[API-DATA-RECEIVED]`);
      console.log(`  Type: ${typeof data}`);
      console.log(`  Is Array: ${Array.isArray(data)}`);
      if (Array.isArray(data)) {
        console.log(`  Array Length: ${data.length}`);
        if (data.length > 0) {
          console.log(`  First Item:`, JSON.stringify(data[0], null, 2));
        }
      } else {
        console.log(`  Data:`, JSON.stringify(data, null, 2));
      }
      console.log(`[API-REQUEST-END]\n`);

      return {
        success: true,
        data,
        status: response.status,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[API-EXCEPTION]`);
      console.error(`  Error: ${errorMessage}`);
      console.error(`  Stack:`, error);
      console.log(`[API-REQUEST-END]\n`);
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * GET request
   */
  async get<T>(
    endpoint: string,
    params?: Record<string, string | number>,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'GET',
    });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    body: any,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body,
    });
  }

  /**
   * Build complete URL with query parameters and token
   */
  private buildUrl(endpoint: string, config: ApiRequestConfig): string {
    const token = getStoredToken();
    const baseUrlWithEndpoint = `${this.baseUrl}${endpoint}`;
    console.log(`[URL-BUILD]`);
    console.log(`  Base URL: ${this.baseUrl}`);
    console.log(`  Endpoint: ${endpoint}`);
    console.log(`  Token: ${token || 'MISSING'}`);

    // Extract query parameters from config or create new URLSearchParams
    const urlParams = new URLSearchParams();
    urlParams.append('token', token);

    // Add token to URL
    const hasExistingParams = endpoint.includes('?');
    const separator = hasExistingParams ? '&' : '?';
    const finalUrl = `${baseUrlWithEndpoint}${separator}${urlParams.toString()}`;
    console.log(`  Final URL: ${finalUrl}`);

    return finalUrl;
  }

  /**
   * Build headers with authorization
   */
  private buildHeaders(additionalHeaders?: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/x-www-form-urlencoded',
      ...additionalHeaders,
    };
    console.log(`[HEADERS-BUILD]`, JSON.stringify(headers, null, 2));
    return headers;
  }
}

// Export singleton instance
export const httpClient = new HttpClient(API_BASE_URL);
