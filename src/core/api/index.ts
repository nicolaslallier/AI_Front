/**
 * API module public exports
 *
 * Centralized export point for HTTP client and API service base class.
 */

export { httpClient, HttpClient, HttpError } from './http-client';
export type { HttpRequestOptions } from './http-client';

export { ApiService } from './api-service';
