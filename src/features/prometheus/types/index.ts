/**
 * Prometheus loading state enumeration
 * Represents the different states of Prometheus content loading
 */
export enum PrometheusLoadingState {
  IDLE = 'idle',
  LOADING = 'loading',
  LOADED = 'loaded',
  ERROR = 'error',
}

/**
 * Prometheus error type enumeration
 * Categorizes different types of errors that can occur
 */
export enum PrometheusErrorType {
  NETWORK_ERROR = 'network_error',
  TIMEOUT_ERROR = 'timeout_error',
  IFRAME_ERROR = 'iframe_error',
  UNKNOWN_ERROR = 'unknown_error',
}

/**
 * Prometheus error interface
 * Represents an error that occurred while loading or displaying Prometheus
 */
export interface PrometheusError {
  /**
   * Type of error that occurred
   */
  type: PrometheusErrorType;

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
 * Prometheus state interface
 * Represents the complete state of the Prometheus integration
 */
export interface PrometheusState {
  /**
   * Current loading state
   */
  loadingState: PrometheusLoadingState;

  /**
   * Current error, if any
   */
  error: PrometheusError | null;

  /**
   * Prometheus URL being loaded
   */
  url: string;

  /**
   * Number of retry attempts made
   */
  retryCount: number;
}
