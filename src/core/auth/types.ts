/**
 * Authentication types and interfaces for Keycloak OIDC integration
 *
 * This module defines all type definitions for authentication state management,
 * user profiles, roles, and Keycloak configuration.
 */

/**
 * User profile information extracted from Keycloak tokens
 * Contains minimal PII in compliance with Loi 25 requirements
 */
export interface UserProfile {
  /** Technical user identifier (sub claim from token) */
  sub: string;
  /** Preferred username for display */
  preferredUsername: string;
  /** User email (optional, only if needed) */
  email?: string;
  /** User's full name (optional) */
  name?: string;
  /** Array of roles assigned to the user */
  roles: string[];
}

/**
 * Authentication state enumeration
 */
export enum AuthStatus {
  /** Authentication is being initialized */
  INITIALIZING = 'initializing',
  /** User is authenticated */
  AUTHENTICATED = 'authenticated',
  /** User is not authenticated */
  UNAUTHENTICATED = 'unauthenticated',
  /** Authentication is in progress (redirecting to Keycloak) */
  AUTHENTICATING = 'authenticating',
  /** Authentication error occurred */
  ERROR = 'error',
}

/**
 * Complete authentication state
 */
export interface AuthState {
  /** Current authentication status */
  status: AuthStatus;
  /** Current user profile (null if not authenticated) */
  user: UserProfile | null;
  /** Array of user roles */
  roles: string[];
  /** Authentication error message (if any) */
  error: string | null;
  /** Whether auth state is being loaded/refreshed */
  loading: boolean;
  /** Timestamp of last successful authentication */
  lastAuthenticated: number | null;
}

/**
 * Keycloak token set
 */
export interface TokenSet {
  /** JWT access token for API calls */
  accessToken: string;
  /** JWT ID token with user information */
  idToken: string;
  /** Refresh token for silent token renewal */
  refreshToken?: string;
  /** Token expiration time in seconds */
  expiresIn: number;
  /** Refresh token expiration time in seconds */
  refreshExpiresIn?: number;
}

/**
 * Keycloak initialization options
 */
export interface KeycloakInitOptions {
  /** Check SSO on initialization */
  checkLoginIframe?: boolean;
  /** Check SSO silently on initialization */
  checkLoginIframeInterval?: number;
  /** Enable PKCE (Proof Key for Code Exchange) - REQUIRED for public clients */
  pkceMethod?: 'S256';
  /** Token to use on initialization */
  token?: string;
  /** Refresh token to use on initialization */
  refreshToken?: string;
  /** ID token to use on initialization */
  idToken?: string;
  /** Restore session from storage on init */
  onLoad?: 'check-sso' | 'login-required';
  /** Enable silent check SSO redirect */
  silentCheckSsoRedirectUri?: string;
}

/**
 * Keycloak login options
 */
export interface KeycloakLoginOptions {
  /** Redirect URI after login */
  redirectUri?: string;
  /** Prompt user for re-authentication */
  prompt?: 'none' | 'login';
  /** Maximum age of authentication */
  maxAge?: number;
  /** Login hint (e.g., username) */
  loginHint?: string;
  /** UI locales */
  uiLocales?: string;
  /** Identity provider hint */
  idpHint?: string;
}

/**
 * Keycloak logout options
 */
export interface KeycloakLogoutOptions {
  /** Redirect URI after logout */
  redirectUri?: string;
}

/**
 * Token storage strategy
 */
export enum TokenStorage {
  /** In-memory only (most secure, lost on refresh) */
  MEMORY = 'memory',
  /** Session storage (persists in tab, cleared on tab close) */
  SESSION = 'session',
  /** Hybrid: memory with sessionStorage backup */
  HYBRID = 'hybrid',
}

/**
 * Stored session data for hybrid storage strategy
 */
export interface StoredSession {
  /** Stored access token */
  accessToken: string;
  /** Stored refresh token */
  refreshToken?: string;
  /** Stored ID token */
  idToken: string;
  /** Timestamp when tokens were stored */
  storedAt: number;
  /** Token expiration timestamp */
  expiresAt: number;
}

/**
 * Role check logic type
 */
export enum RoleMatchMode {
  /** User must have ALL specified roles */
  ALL = 'all',
  /** User must have ANY of the specified roles */
  ANY = 'any',
}

/**
 * Authentication event types
 */
export enum AuthEvent {
  /** User logged in */
  LOGIN = 'auth:login',
  /** User logged out */
  LOGOUT = 'auth:logout',
  /** Token was refreshed */
  TOKEN_REFRESH = 'auth:token-refresh',
  /** Authentication error occurred */
  ERROR = 'auth:error',
  /** Session expired */
  SESSION_EXPIRED = 'auth:session-expired',
}

/**
 * Authentication event payload
 */
export interface AuthEventPayload {
  /** Event type */
  type: AuthEvent;
  /** Event timestamp */
  timestamp: number;
  /** User profile (if available) */
  user?: UserProfile;
  /** Error message (for error events) */
  error?: string;
}
