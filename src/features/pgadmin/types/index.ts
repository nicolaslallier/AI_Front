/**
 * pgAdmin loading state enumeration
 * Represents the different states of pgAdmin content loading
 */
export enum PgAdminLoadingState {
  IDLE = 'idle',
  LOADING = 'loading',
  LOADED = 'loaded',
  ERROR = 'error',
}

/**
 * pgAdmin error type enumeration
 * Categorizes different types of errors that can occur
 */
export enum PgAdminErrorType {
  NETWORK_ERROR = 'network_error',
  TIMEOUT_ERROR = 'timeout_error',
  IFRAME_ERROR = 'iframe_error',
  UNKNOWN_ERROR = 'unknown_error',
}

/**
 * pgAdmin error interface
 * Represents an error that occurred while loading or displaying pgAdmin
 */
export interface PgAdminError {
  /**
   * Type of error that occurred
   */
  type: PgAdminErrorType;

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
 * pgAdmin state interface
 * Represents the complete state of the pgAdmin integration
 */
export interface PgAdminState {
  /**
   * Current loading state
   */
  loadingState: PgAdminLoadingState;

  /**
   * Current error, if any
   */
  error: PgAdminError | null;

  /**
   * pgAdmin URL being loaded
   */
  url: string;

  /**
   * Number of retry attempts made
   */
  retryCount: number;
}
