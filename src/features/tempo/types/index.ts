/**
 * Tempo loading state enumeration
 * Represents the different states of Tempo content loading
 */
export enum TempoLoadingState {
  IDLE = 'idle',
  LOADING = 'loading',
  LOADED = 'loaded',
  ERROR = 'error',
}

/**
 * Tempo error type enumeration
 * Categorizes different types of errors that can occur
 */
export enum TempoErrorType {
  NETWORK_ERROR = 'network_error',
  TIMEOUT_ERROR = 'timeout_error',
  IFRAME_ERROR = 'iframe_error',
  UNKNOWN_ERROR = 'unknown_error',
}

/**
 * Tempo error interface
 * Represents an error that occurred while loading or displaying Tempo
 */
export interface TempoError {
  /**
   * Type of error that occurred
   */
  type: TempoErrorType;

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
 * Tempo state interface
 * Represents the complete state of the Tempo integration
 */
export interface TempoState {
  /**
   * Current loading state
   */
  loadingState: TempoLoadingState;

  /**
   * Current error, if any
   */
  error: TempoError | null;

  /**
   * Tempo URL being loaded
   */
  url: string;

  /**
   * Number of retry attempts made
   */
  retryCount: number;
}
