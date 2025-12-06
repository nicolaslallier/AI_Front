/**
 * Authentication module public API
 *
 * Central export point for all authentication functionality.
 * This module can be shared with micro front-ends via module federation.
 *
 * Implements FR-FE-KC-013 (session partagée) and FR-FE-KC-014 (propagation d'identité).
 */

// Service
export { keycloakService, KeycloakService } from './keycloak-service';

// Store
export { useAuthStore } from './auth-store';

// Composable
export { useAuth, requiresAuth, getRequiredRoles } from './use-auth';
export type { UseAuthReturn } from './use-auth';

// Types
export type {
  UserProfile,
  AuthState,
  TokenSet,
  KeycloakInitOptions,
  KeycloakLoginOptions,
  KeycloakLogoutOptions,
  StoredSession,
  AuthEventPayload,
} from './types';

export { AuthStatus, TokenStorage, RoleMatchMode, AuthEvent } from './types';

// Errors
export {
  AuthError,
  AuthenticationError,
  TokenExpiredError,
  TokenRefreshError,
  InsufficientPermissionsError,
  KeycloakUnavailableError,
  KeycloakInitializationError,
  SessionStorageError,
  isAuthError,
  getErrorMessage,
} from './errors';

// Events
export {
  authEvents,
  emitLoginEvent,
  emitLogoutEvent,
  emitTokenRefreshEvent,
  emitErrorEvent,
  emitSessionExpiredEvent,
} from './auth-events';

// Guards
export { authGuard, storeIntendedRoute, getAndClearIntendedRoute } from './guards/auth-guard';
export { roleGuard, createRoleGuard } from './guards/role-guard';
