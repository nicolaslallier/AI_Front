/**
 * Loki loading state enumeration
 * Represents the different states of Loki content loading
 */
export enum LokiLoadingState {
  IDLE = 'idle',
  LOADING = 'loading',
  LOADED = 'loaded',
  ERROR = 'error',
}

/**
 * Loki error type enumeration
 * Categorizes different types of errors that can occur
 */
export enum LokiErrorType {
  NETWORK_ERROR = 'network_error',
  TIMEOUT_ERROR = 'timeout_error',
  IFRAME_ERROR = 'iframe_error',
  UNKNOWN_ERROR = 'unknown_error',
}

/**
 * Loki error interface
 * Represents an error that occurred while loading or displaying Loki
 */
export interface LokiError {
  /**
   * Type of error that occurred
   */
  type: LokiErrorType;

  /**
   * Human-readable error message
   */
  message: string;

  /**
   * Timestamp when the error occurred
   */
  timestamp: Date;

  /**
   * Optional technical details for debugging
   */
  details?: string;
}

/**
 * Loki state interface
 * Represents the complete state of the Loki integration
 */
export interface LokiState {
  /**
   * Current loading state
   */
  loadingState: LokiLoadingState;

  /**
   * Current error, if any
   */
  error: LokiError | null;

  /**
   * Loki URL being loaded
   */
  url: string;

  /**
   * Number of retry attempts made
   */
  retryCount: number;
}
