/**
 * Keycloak Admin loading state enumeration
 * Represents the different states of Keycloak Admin content loading
 */
export enum KeycloakAdminLoadingState {
  IDLE = 'idle',
  LOADING = 'loading',
  LOADED = 'loaded',
  ERROR = 'error',
}

/**
 * Keycloak Admin error type enumeration
 * Categorizes different types of errors that can occur
 */
export enum KeycloakAdminErrorType {
  NETWORK_ERROR = 'network_error',
  TIMEOUT_ERROR = 'timeout_error',
  IFRAME_ERROR = 'iframe_error',
  UNKNOWN_ERROR = 'unknown_error',
}

/**
 * Keycloak Admin error interface
 * Represents an error that occurred while loading or displaying Keycloak Admin
 */
export interface KeycloakAdminError {
  /**
   * Type of error that occurred
   */
  type: KeycloakAdminErrorType;

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
 * Keycloak Admin state interface
 * Represents the complete state of the Keycloak Admin integration
 */
export interface KeycloakAdminState {
  /**
   * Current loading state
   */
  loadingState: KeycloakAdminLoadingState;

  /**
   * Current error, if any
   */
  error: KeycloakAdminError | null;

  /**
   * Keycloak Admin URL being loaded
   */
  url: string;

  /**
   * Number of retry attempts made
   */
  retryCount: number;
}
