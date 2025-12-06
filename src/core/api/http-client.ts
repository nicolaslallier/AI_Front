/**
 * HTTP client with authentication and error handling
 *
 * Provides a configured HTTP client (using fetch API) that automatically:
 * - Injects Bearer tokens into requests
 * - Handles 401/403 errors with token refresh
 * - Adds correlation IDs for request tracing
 * - Transforms and logs errors
 *
 * Implements FR-FE-KC-011 and FR-FE-KC-012.
 */

import { useAuthStore } from '../auth/auth-store';
import { TokenExpiredError } from '../auth/errors';

import { config } from '@/core/config';
import { Logger } from '@/shared/utils/logger';

/**
 * HTTP request options
 */
export interface HttpRequestOptions extends globalThis.RequestInit {
  /** Skip automatic auth token injection */
  skipAuth?: boolean;
  /** Custom headers to merge with defaults */
  headers?: globalThis.HeadersInit;
  /** Request timeout in milliseconds */
  timeout?: number;
}

/**
 * HTTP error response class
 *
 * Represents an HTTP error with status code and response details
 */
export class HttpError extends Error {
  public readonly status: number;
  public readonly statusText: string;
  public readonly response?: Response;
  public readonly data?: unknown;

  /**
   * Creates a new HTTP error
   *
   * @param status - HTTP status code
   * @param statusText - HTTP status text
   * @param message - Error message
   * @param response - Original response object
   * @param data - Response data
   */
  constructor(status: number, statusText: string, message?: string, response?: Response, data?: unknown) {
    super(message || `HTTP ${status}: ${statusText}`);
    this.name = 'HttpError';
    this.status = status;
    this.statusText = statusText;
    this.response = response;
    this.data = data;
  }
}

/**
 * Generates a unique correlation ID for request tracing
 *
 * @returns UUID v4 string
 */
function generateCorrelationId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * HTTP client class
 *
 * Wraps the native fetch API with authentication and error handling.
 */
class HttpClient {
  private baseUrl: string;
  private defaultTimeout: number = 30000; // 30 seconds

  /**
   * Creates a new HTTP client instance
   *
   * @param baseUrl - Base URL for API requests
   */
  constructor(baseUrl: string = config.apiBaseUrl) {
    this.baseUrl = baseUrl;
  }

  /**
   * Makes an HTTP request with authentication and error handling
   *
   * @param endpoint - API endpoint (will be appended to baseUrl)
   * @param options - Request options
   * @returns Promise resolving to response data
   * @throws {HttpError} If request fails
   */
  public async request<T = unknown>(endpoint: string, options: HttpRequestOptions = {}): Promise<T> {
    const url = this.buildUrl(endpoint);
    const requestOptions = await this.buildRequestOptions(options);

    // Add timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || this.defaultTimeout);

    try {
      const response = await fetch(url, {
        ...requestOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle authentication errors (FR-FE-KC-012)
      if (response.status === 401) {
        return await this.handleUnauthorized<T>(url, options);
      }

      // Handle forbidden errors
      if (response.status === 403) {
        throw new HttpError(403, 'Forbidden', 'You do not have permission to access this resource', response);
      }

      // Handle other error responses
      if (!response.ok) {
        const errorData = await this.parseResponseData(response);
        throw new HttpError(
          response.status,
          response.statusText,
          this.extractErrorMessage(errorData),
          response,
          errorData,
        );
      }

      // Parse and return success response
      return await this.parseResponseData<T>(response);
    } catch (error) {
      clearTimeout(timeoutId);

      // Re-throw HttpErrors
      if (error instanceof HttpError) {
        Logger.error('HTTP request failed', {
          url,
          status: error.status,
          message: error.message,
        });
        throw error;
      }

      // Handle abort/timeout
      if (error instanceof Error && error.name === 'AbortError') {
        Logger.error('HTTP request timed out', { url });
        throw new HttpError(408, 'Request Timeout', 'The request took too long to complete');
      }

      // Handle network errors
      Logger.error('HTTP request error', { url, error });
      throw new HttpError(0, 'Network Error', 'Network request failed. Please check your connection.');
    }
  }

  /**
   * Handles 401 Unauthorized responses
   *
   * Attempts to refresh the token and retry the request once.
   * Implements FR-FE-KC-012.
   *
   * @param url - Request URL
   * @param options - Original request options
   * @returns Promise resolving to response data
   * @throws {HttpError} If token refresh fails or retry fails
   */
  private async handleUnauthorized<T>(url: string, options: HttpRequestOptions): Promise<T> {
    const authStore = useAuthStore();

    Logger.warn('Received 401 response, attempting token refresh', { url });

    try {
      // Attempt to refresh the token
      const refreshed = await authStore.refreshToken();

      if (!refreshed) {
        throw new TokenExpiredError('Token refresh failed, user needs to re-authenticate');
      }

      // Retry the request with new token
      Logger.info('Token refreshed successfully, retrying request', { url });

      const retryOptions = await this.buildRequestOptions(options);
      const response = await fetch(url, retryOptions);

      if (!response.ok) {
        const errorData = await this.parseResponseData(response);
        throw new HttpError(
          response.status,
          response.statusText,
          this.extractErrorMessage(errorData),
          response,
          errorData,
        );
      }

      return await this.parseResponseData<T>(response);
    } catch (error) {
      Logger.error('Token refresh or retry failed', error);

      if (error instanceof HttpError) {
        throw error;
      }

      throw new HttpError(401, 'Unauthorized', 'Authentication failed. Please log in again.', undefined, error);
    }
  }

  /**
   * Builds the full request URL
   *
   * @param endpoint - API endpoint
   * @returns Full URL
   */
  private buildUrl(endpoint: string): string {
    // If endpoint is already a full URL, return it
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      return endpoint;
    }

    // Remove leading slash from endpoint if present
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;

    // Ensure baseUrl doesn't end with slash
    const cleanBaseUrl = this.baseUrl.endsWith('/') ? this.baseUrl.slice(0, -1) : this.baseUrl;

    return `${cleanBaseUrl}/${cleanEndpoint}`;
  }

  /**
   * Builds request options with authentication headers
   *
   * Implements FR-FE-KC-011 (Bearer token injection).
   *
   * @param options - Original request options
   * @returns Promise resolving to enhanced request options
   */
  private async buildRequestOptions(options: HttpRequestOptions): Promise<globalThis.RequestInit> {
    const headers = new Headers(options.headers);

    // Add correlation ID for tracing
    if (!headers.has('X-Correlation-ID')) {
      headers.set('X-Correlation-ID', generateCorrelationId());
    }

    // Add content type if not present and body exists
    if (options.body && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    // Add authentication token (FR-FE-KC-011)
    if (!options.skipAuth) {
      const authStore = useAuthStore();

      if (authStore.isAuthenticated) {
        const token = await authStore.getAccessToken();

        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
      }
    }

    return {
      ...options,
      headers,
    };
  }

  /**
   * Parses response data based on content type
   *
   * @param response - Fetch response
   * @returns Parsed response data
   */
  private async parseResponseData<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('Content-Type') || '';

    if (contentType.includes('application/json')) {
      return await response.json();
    }

    if (contentType.includes('text/')) {
      return (await response.text()) as T;
    }

    // For other types (binary, etc.), return as blob
    return (await response.blob()) as T;
  }

  /**
   * Extracts error message from error response data
   *
   * @param data - Error response data
   * @returns Error message string
   */
  private extractErrorMessage(data: unknown): string {
    if (!data) {
      return 'An error occurred';
    }

    if (typeof data === 'string') {
      return data;
    }

    if (typeof data === 'object' && data !== null) {
      const errorObj = data as Record<string, unknown>;

      // Try common error message fields
      if (typeof errorObj.message === 'string') {
        return errorObj.message;
      }

      if (typeof errorObj.error === 'string') {
        return errorObj.error;
      }

      if (typeof errorObj.detail === 'string') {
        return errorObj.detail;
      }
    }

    return 'An error occurred';
  }

  /**
   * Makes a GET request
   *
   * @param endpoint - API endpoint
   * @param options - Request options
   * @returns Promise resolving to response data
   */
  public async get<T = unknown>(endpoint: string, options?: HttpRequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  /**
   * Makes a POST request
   *
   * @param endpoint - API endpoint
   * @param data - Request body data
   * @param options - Request options
   * @returns Promise resolving to response data
   */
  public async post<T = unknown>(endpoint: string, data?: unknown, options?: HttpRequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * Makes a PUT request
   *
   * @param endpoint - API endpoint
   * @param data - Request body data
   * @param options - Request options
   * @returns Promise resolving to response data
   */
  public async put<T = unknown>(endpoint: string, data?: unknown, options?: HttpRequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * Makes a PATCH request
   *
   * @param endpoint - API endpoint
   * @param data - Request body data
   * @param options - Request options
   * @returns Promise resolving to response data
   */
  public async patch<T = unknown>(endpoint: string, data?: unknown, options?: HttpRequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * Makes a DELETE request
   *
   * @param endpoint - API endpoint
   * @param options - Request options
   * @returns Promise resolving to response data
   */
  public async delete<T = unknown>(endpoint: string, options?: HttpRequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

/**
 * Default HTTP client instance
 */
export const httpClient = new HttpClient();

/**
 * Export class for custom instances
 */
export { HttpClient };
