/**
 * Base API service class
 *
 * Provides a foundation for creating type-safe API service classes
 * with centralized error handling and HTTP client usage.
 *
 * Following the Open/Closed Principle - services extend this base class.
 */

import { httpClient, type HttpRequestOptions } from './http-client';

/**
 * Base API service class
 *
 * Extend this class to create specific API services for your features.
 *
 * @example
 * class UserService extends ApiService {
 *   constructor() {
 *     super('/users');
 *   }
 *
 *   async getUser(id: string): Promise<User> {
 *     return this.get<User>(`/${id}`);
 *   }
 *
 *   async createUser(data: CreateUserDto): Promise<User> {
 *     return this.post<User>('/', data);
 *   }
 * }
 */
export abstract class ApiService {
  protected baseEndpoint: string;

  /**
   * Creates a new API service instance
   *
   * @param baseEndpoint - Base endpoint for this service (e.g., '/users', '/products')
   */
  constructor(baseEndpoint: string) {
    this.baseEndpoint = baseEndpoint;
  }

  /**
   * Builds the full endpoint path
   *
   * @param path - Relative path to append to base endpoint
   * @returns Full endpoint path
   */
  protected buildEndpoint(path: string): string {
    // Remove leading slash from path if present
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    // Ensure baseEndpoint doesn't end with slash
    const cleanBase = this.baseEndpoint.endsWith('/') ? this.baseEndpoint.slice(0, -1) : this.baseEndpoint;

    return `${cleanBase}${cleanPath}`;
  }

  /**
   * Makes a GET request
   *
   * @param path - Endpoint path (relative to base endpoint)
   * @param options - Request options
   * @returns Promise resolving to typed response data
   */
  protected async get<T>(path: string, options?: HttpRequestOptions): Promise<T> {
    return httpClient.get<T>(this.buildEndpoint(path), options);
  }

  /**
   * Makes a POST request
   *
   * @param path - Endpoint path (relative to base endpoint)
   * @param data - Request body data
   * @param options - Request options
   * @returns Promise resolving to typed response data
   */
  protected async post<T>(path: string, data?: unknown, options?: HttpRequestOptions): Promise<T> {
    return httpClient.post<T>(this.buildEndpoint(path), data, options);
  }

  /**
   * Makes a PUT request
   *
   * @param path - Endpoint path (relative to base endpoint)
   * @param data - Request body data
   * @param options - Request options
   * @returns Promise resolving to typed response data
   */
  protected async put<T>(path: string, data?: unknown, options?: HttpRequestOptions): Promise<T> {
    return httpClient.put<T>(this.buildEndpoint(path), data, options);
  }

  /**
   * Makes a PATCH request
   *
   * @param path - Endpoint path (relative to base endpoint)
   * @param data - Request body data
   * @param options - Request options
   * @returns Promise resolving to typed response data
   */
  protected async patch<T>(path: string, data?: unknown, options?: HttpRequestOptions): Promise<T> {
    return httpClient.patch<T>(this.buildEndpoint(path), data, options);
  }

  /**
   * Makes a DELETE request
   *
   * @param path - Endpoint path (relative to base endpoint)
   * @param options - Request options
   * @returns Promise resolving to typed response data
   */
  protected async delete<T>(path: string, options?: HttpRequestOptions): Promise<T> {
    return httpClient.delete<T>(this.buildEndpoint(path), options);
  }
}
