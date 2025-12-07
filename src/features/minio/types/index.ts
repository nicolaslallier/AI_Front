/**
 * MinIO loading state enumeration
 * Represents the different states of MinIO console content loading
 */
export enum MinioLoadingState {
  IDLE = 'idle',
  LOADING = 'loading',
  LOADED = 'loaded',
  ERROR = 'error',
}

/**
 * MinIO error type enumeration
 * Categorizes different types of errors that can occur
 */
export enum MinioErrorType {
  NETWORK_ERROR = 'network_error',
  TIMEOUT_ERROR = 'timeout_error',
  IFRAME_ERROR = 'iframe_error',
  UNKNOWN_ERROR = 'unknown_error',
}

/**
 * MinIO error interface
 * Represents an error that occurred while loading or displaying MinIO console
 */
export interface MinioError {
  /**
   * Type of error that occurred
   */
  type: MinioErrorType;

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
 * MinIO state interface
 * Represents the complete state of the MinIO console integration
 */
export interface MinioState {
  /**
   * Current loading state
   */
  loadingState: MinioLoadingState;

  /**
   * Current error, if any
   */
  error: MinioError | null;

  /**
   * MinIO console URL being loaded
   */
  url: string;

  /**
   * Number of retry attempts made
   */
  retryCount: number;
}
