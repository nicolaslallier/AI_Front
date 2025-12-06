/**
 * Custom error classes for authentication
 *
 * Provides specific error types for different authentication failure scenarios
 * to enable proper error handling and user-friendly messaging.
 */

/**
 * Base authentication error class
 */
export class AuthError extends Error {
  public readonly timestamp: number;
  public readonly originalError?: Error;

  /**
   * Creates a new authentication error
   *
   * @param message - Error message
   * @param cause - Original error that caused this error (optional)
   */
  constructor(message: string, cause?: Error) {
    super(message);
    this.name = 'AuthError';
    this.timestamp = Date.now();
    if (cause) {
      this.originalError = cause;
    }
    // Maintains proper stack trace for where our error was thrown (V8 only)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Error thrown when authentication fails
 */
export class AuthenticationError extends AuthError {
  /**
   * Creates a new authentication failure error
   *
   * @param message - Error message
   * @param cause - Original error (optional)
   */
  constructor(message: string, cause?: Error) {
    super(message, cause);
    this.name = 'AuthenticationError';
  }
}

/**
 * Error thrown when a token has expired
 */
export class TokenExpiredError extends AuthError {
  /**
   * Creates a new token expired error
   *
   * @param message - Error message (default: 'Token has expired')
   * @param cause - Original error (optional)
   */
  constructor(message: string = 'Token has expired', cause?: Error) {
    super(message, cause);
    this.name = 'TokenExpiredError';
  }
}

/**
 * Error thrown when token refresh fails
 */
export class TokenRefreshError extends AuthError {
  /**
   * Creates a new token refresh error
   *
   * @param message - Error message
   * @param cause - Original error (optional)
   */
  constructor(message: string, cause?: Error) {
    super(message, cause);
    this.name = 'TokenRefreshError';
  }
}

/**
 * Error thrown when user lacks required permissions/roles
 */
export class InsufficientPermissionsError extends AuthError {
  public readonly requiredRoles: string[];
  public readonly userRoles: string[];

  /**
   * Creates a new insufficient permissions error
   *
   * @param requiredRoles - Roles required for the action
   * @param userRoles - Roles the user currently has
   * @param message - Custom error message (optional)
   */
  constructor(requiredRoles: string[], userRoles: string[], message?: string) {
    const defaultMessage =
      message ||
      `Insufficient permissions. Required: [${requiredRoles.join(', ')}], User has: [${userRoles.join(', ')}]`;
    super(defaultMessage);
    this.name = 'InsufficientPermissionsError';
    this.requiredRoles = requiredRoles;
    this.userRoles = userRoles;
  }
}

/**
 * Error thrown when Keycloak server is unavailable
 */
export class KeycloakUnavailableError extends AuthError {
  public readonly keycloakUrl: string;

  /**
   * Creates a new Keycloak unavailable error
   *
   * @param keycloakUrl - URL of the Keycloak server
   * @param message - Custom error message (optional)
   * @param cause - Original error (optional)
   */
  constructor(keycloakUrl: string, message?: string, cause?: Error) {
    const defaultMessage = message || `Keycloak server is unavailable at ${keycloakUrl}. Please try again later.`;
    super(defaultMessage, cause);
    this.name = 'KeycloakUnavailableError';
    this.keycloakUrl = keycloakUrl;
  }
}

/**
 * Error thrown when Keycloak initialization fails
 */
export class KeycloakInitializationError extends AuthError {
  /**
   * Creates a new Keycloak initialization error
   *
   * @param message - Error message
   * @param cause - Original error (optional)
   */
  constructor(message: string, cause?: Error) {
    super(message, cause);
    this.name = 'KeycloakInitializationError';
  }
}

/**
 * Error thrown when session storage operations fail
 */
export class SessionStorageError extends AuthError {
  /**
   * Creates a new session storage error
   *
   * @param message - Error message
   * @param cause - Original error (optional)
   */
  constructor(message: string, cause?: Error) {
    super(message, cause);
    this.name = 'SessionStorageError';
  }
}

/**
 * Checks if an error is an authentication-related error
 *
 * @param error - Error to check
 * @returns True if error is an AuthError instance
 */
export function isAuthError(error: unknown): error is AuthError {
  return error instanceof AuthError;
}

/**
 * Extracts a user-friendly error message from any error
 *
 * @param error - Error to extract message from
 * @returns User-friendly error message
 */
export function getErrorMessage(error: unknown): string {
  if (isAuthError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
}
