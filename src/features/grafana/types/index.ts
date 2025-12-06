/**
 * Grafana loading state enumeration
 * Represents the different states of Grafana content loading
 */
export enum GrafanaLoadingState {
  IDLE = 'idle',
  LOADING = 'loading',
  LOADED = 'loaded',
  ERROR = 'error',
}

/**
 * Grafana error type enumeration
 * Categorizes different types of errors that can occur
 */
export enum GrafanaErrorType {
  NETWORK_ERROR = 'network_error',
  TIMEOUT_ERROR = 'timeout_error',
  IFRAME_ERROR = 'iframe_error',
  UNKNOWN_ERROR = 'unknown_error',
}

/**
 * Grafana error interface
 * Represents an error that occurred while loading or displaying Grafana
 */
export interface GrafanaError {
  /**
   * Type of error that occurred
   */
  type: GrafanaErrorType;

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
 * Grafana state interface
 * Represents the complete state of the Grafana integration
 */
export interface GrafanaState {
  /**
   * Current loading state
   */
  loadingState: GrafanaLoadingState;

  /**
   * Current error, if any
   */
  error: GrafanaError | null;

  /**
   * Grafana URL being loaded
   */
  url: string;

  /**
   * Number of retry attempts made
   */
  retryCount: number;
}
