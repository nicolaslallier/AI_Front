/**
 * Keycloak authentication service
 *
 * Handles all Keycloak OIDC interactions including initialization, login, logout,
 * token management, and session persistence with hybrid storage strategy.
 *
 * This service implements FR-FE-KC-001 through FR-FE-KC-007 requirements from the specification.
 */

import Keycloak, { type KeycloakInstance } from 'keycloak-js';

import {
  AuthenticationError,
  KeycloakInitializationError,
  KeycloakUnavailableError,
  TokenRefreshError,
} from './errors';
import { TokenStorage } from './types';

import type {
  KeycloakInitOptions,
  KeycloakLoginOptions,
  KeycloakLogoutOptions,
  StoredSession,
  TokenSet,
  UserProfile,
} from './types';

import { config } from '@/core/config';
import { Logger } from '@/shared/utils/logger';

/**
 * Session storage key for persisting tokens
 */
const SESSION_STORAGE_KEY = 'kc_session';

/**
 * Keycloak service class implementing OIDC authentication with PKCE
 *
 * Uses hybrid storage strategy: in-memory with sessionStorage backup
 * for optimal security and user experience.
 */
export class KeycloakService {
  private keycloak: KeycloakInstance | null = null;
  private initialized: boolean = false;
  private refreshTimer: number | null = null;
  private readonly storageStrategy: TokenStorage = TokenStorage.HYBRID;

  /**
   * Gets the Keycloak instance
   *
   * @returns Keycloak instance
   * @throws {KeycloakInitializationError} If Keycloak is not initialized
   */
  private getKeycloak(): KeycloakInstance {
    if (!this.keycloak) {
      throw new KeycloakInitializationError('Keycloak is not initialized');
    }
    return this.keycloak;
  }

  /**
   * Initializes the Keycloak client with PKCE enabled
   *
   * Attempts to restore session from storage if available.
   * Implements FR-FE-KC-001 and FR-FE-KC-002.
   *
   * @param options - Initialization options
   * @returns Promise resolving to true if authenticated, false otherwise
   * @throws {KeycloakInitializationError} If initialization fails
   * @throws {KeycloakUnavailableError} If Keycloak server is unreachable
   */
  // eslint-disable-next-line max-lines-per-function, complexity -- Initialize method requires complex logic
  public async initialize(options: KeycloakInitOptions = {}): Promise<boolean> {
    try {
      // Create Keycloak instance with configuration
      this.keycloak = new Keycloak({
        url: config.keycloak.url,
        realm: config.keycloak.realm,
        clientId: config.keycloak.clientId,
      });

      if (config.keycloak.enableDebug) {
        Logger.info('Keycloak initialization started', {
          url: config.keycloak.url,
          realm: config.keycloak.realm,
          clientId: config.keycloak.clientId,
        });
      }

      // Attempt to restore session from storage
      const storedSession = this.restoreSession();

      // Merge initialization options
      const initOptions: KeycloakInitOptions = {
        pkceMethod: 'S256', // Enable PKCE for public clients (required)
        onLoad: 'check-sso', // Check for existing SSO session
        checkLoginIframe: false, // Disable iframe for SPA security
        ...options,
      };

      // If we have a stored session, provide tokens to Keycloak
      if (storedSession) {
        initOptions.token = storedSession.accessToken;
        initOptions.refreshToken = storedSession.refreshToken;
        initOptions.idToken = storedSession.idToken;
      }

      // Initialize Keycloak
      const authenticated = await this.keycloak.init(initOptions);

      this.initialized = true;

      if (authenticated) {
        // User is authenticated, persist session and start refresh timer
        this.persistSession();
        this.startTokenRefresh();

        if (config.keycloak.enableDebug) {
          Logger.info('Keycloak initialization successful - user authenticated');
        }
      } else {
        // No active session
        if (config.keycloak.enableDebug) {
          Logger.info('Keycloak initialization successful - user not authenticated');
        }
      }

      return authenticated;
    } catch (error) {
      this.initialized = false;

      if (error instanceof Error) {
        // Check if error is due to Keycloak server being unavailable
        if (error.message.includes('Network') || error.message.includes('Failed to fetch')) {
          throw new KeycloakUnavailableError(config.keycloak.url, undefined, error);
        }
        throw new KeycloakInitializationError(`Failed to initialize Keycloak: ${error.message}`, error);
      }

      throw new KeycloakInitializationError('Failed to initialize Keycloak');
    }
  }

  /**
   * Checks if Keycloak is initialized
   *
   * @returns True if initialized
   */
  public isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Checks if the user is currently authenticated
   *
   * @returns True if user is authenticated
   */
  public isAuthenticated(): boolean {
    return this.keycloak?.authenticated === true;
  }

  /**
   * Initiates login flow by redirecting to Keycloak
   *
   * Implements FR-FE-KC-003.
   *
   * @param options - Login options (redirect URI, etc.)
   * @returns Promise that resolves when redirect starts
   * @throws {AuthenticationError} If login fails
   */
  public async login(options: KeycloakLoginOptions = {}): Promise<void> {
    try {
      const kc = this.getKeycloak();

      const loginOptions: KeycloakLoginOptions = {
        redirectUri: window.location.origin + '/auth/callback',
        ...options,
      };

      if (config.keycloak.enableDebug) {
        Logger.info('Starting login redirect to Keycloak', loginOptions);
      }

      await kc.login(loginOptions);
    } catch (error) {
      if (error instanceof Error) {
        throw new AuthenticationError(`Login failed: ${error.message}`, error);
      }
      throw new AuthenticationError('Login failed');
    }
  }

  /**
   * Logs out the user and invalidates the session
   *
   * Clears local session, stops token refresh, and redirects to Keycloak logout.
   * Implements FR-FE-KC-004.
   *
   * @param options - Logout options (redirect URI, etc.)
   * @returns Promise that resolves when logout is complete
   */
  public async logout(options: KeycloakLogoutOptions = {}): Promise<void> {
    try {
      const kc = this.getKeycloak();

      // Stop token refresh timer
      this.stopTokenRefresh();

      // Clear stored session
      this.clearSession();

      const logoutOptions: KeycloakLogoutOptions = {
        redirectUri: window.location.origin,
        ...options,
      };

      if (config.keycloak.enableDebug) {
        Logger.info('Starting logout redirect to Keycloak', logoutOptions);
      }

      // Redirect to Keycloak logout endpoint (SSO logout)
      await kc.logout(logoutOptions);
    } catch (error) {
      // Even if Keycloak logout fails, we've cleared local session
      Logger.error('Logout error (local session cleared)', error);
    }
  }

  /**
   * Gets the current access token
   *
   * Automatically refreshes if token is about to expire.
   *
   * @returns Access token or null if not authenticated
   */
  public async getToken(): Promise<string | null> {
    const kc = this.getKeycloak();

    if (!kc.authenticated) {
      return null;
    }

    try {
      // Update token if it's about to expire (within minValidity seconds)
      await kc.updateToken(config.keycloak.minValidity);
      return kc.token || null;
    } catch (error) {
      Logger.error('Failed to get/refresh token', error);
      return null;
    }
  }

  /**
   * Gets the current token set (access, ID, refresh tokens)
   *
   * @returns Token set or null if not authenticated
   */
  public getTokenSet(): TokenSet | null {
    const kc = this.getKeycloak();

    if (!kc.authenticated || !kc.token || !kc.idToken) {
      return null;
    }

    return {
      accessToken: kc.token,
      idToken: kc.idToken,
      refreshToken: kc.refreshToken,
      expiresIn: kc.tokenParsed?.exp ? kc.tokenParsed.exp - Math.floor(Date.now() / 1000) : 0,
      refreshExpiresIn: kc.refreshTokenParsed?.exp
        ? kc.refreshTokenParsed.exp - Math.floor(Date.now() / 1000)
        : undefined,
    };
  }

  /**
   * Gets the current user profile from token claims
   *
   * Extracts minimal PII in compliance with Loi 25.
   * Implements FR-FE-KC-008 (role extraction).
   *
   * @returns User profile or null if not authenticated
   */
  public getUserProfile(): UserProfile | null {
    const kc = this.getKeycloak();

    if (!kc.authenticated || !kc.tokenParsed) {
      return null;
    }

    const token = kc.tokenParsed;
    const roles = this.extractRoles();

    return {
      sub: token.sub || '',
      preferredUsername: token.preferred_username || token.sub || '',
      email: token.email,
      name: token.name,
      roles,
    };
  }

  /**
   * Extracts roles from token claims
   *
   * Combines realm roles and client-specific roles.
   * Implements DATA-FE-KC-001.
   *
   * @returns Array of role strings
   */
  private extractRoles(): string[] {
    const kc = this.getKeycloak();

    if (!kc.tokenParsed) {
      return [];
    }

    const roles: string[] = [];
    const token = kc.tokenParsed as {
      realm_access?: { roles?: string[] };
      resource_access?: Record<string, { roles?: string[] }>;
    };

    // Extract realm roles
    if (token.realm_access?.roles) {
      roles.push(...token.realm_access.roles);
    }

    // Extract client-specific roles
    if (token.resource_access) {
      const clientId = config.keycloak.clientId;
      if (token.resource_access[clientId]?.roles) {
        roles.push(...token.resource_access[clientId].roles);
      }
    }

    return [...new Set(roles)]; // Remove duplicates
  }

  /**
   * Manually refreshes the access token
   *
   * Implements FR-FE-KC-007 (silent refresh).
   *
   * @returns Promise resolving to true if refresh succeeded
   * @throws {TokenRefreshError} If refresh fails
   */
  public async refreshToken(): Promise<boolean> {
    try {
      const kc = this.getKeycloak();

      if (!kc.authenticated) {
        return false;
      }

      const refreshed = await kc.updateToken(-1); // Force refresh

      if (refreshed) {
        this.persistSession();

        if (config.keycloak.enableDebug) {
          Logger.info('Token refreshed successfully');
        }
      }

      return refreshed;
    } catch (error) {
      this.clearSession();
      this.stopTokenRefresh();

      if (error instanceof Error) {
        throw new TokenRefreshError(`Token refresh failed: ${error.message}`, error);
      }
      throw new TokenRefreshError('Token refresh failed');
    }
  }

  /**
   * Starts automatic token refresh timer
   *
   * Periodically checks token validity and refreshes before expiration.
   * Implements NFR-FE-KC-001 (performance) and FR-FE-KC-007.
   */
  private startTokenRefresh(): void {
    // Clear any existing timer
    this.stopTokenRefresh();

    // Set up periodic token check
    this.refreshTimer = window.setInterval(async () => {
      try {
        const kc = this.getKeycloak();

        if (!kc.authenticated) {
          this.stopTokenRefresh();
          return;
        }

        // Check if token needs refresh (within minValidity threshold)
        await kc.updateToken(config.keycloak.minValidity);

        // Persist updated session
        this.persistSession();
      } catch (error) {
        Logger.error('Token refresh in timer failed', error);
        // Token refresh failed, user needs to re-authenticate
        this.clearSession();
        this.stopTokenRefresh();
      }
    }, config.keycloak.checkInterval * 1000);
  }

  /**
   * Stops the automatic token refresh timer
   */
  private stopTokenRefresh(): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  /**
   * Persists the current session to storage (hybrid strategy)
   *
   * Stores tokens in sessionStorage for persistence across page reloads
   * while keeping primary state in memory.
   * Implements FR-FE-KC-006 and NFR-FE-KC-002.
   */
  private persistSession(): void {
    if (this.storageStrategy === TokenStorage.MEMORY) {
      return; // Memory-only strategy, no persistence
    }

    try {
      const tokenSet = this.getTokenSet();

      if (!tokenSet) {
        return;
      }

      const session: StoredSession = {
        accessToken: tokenSet.accessToken,
        refreshToken: tokenSet.refreshToken,
        idToken: tokenSet.idToken,
        storedAt: Date.now(),
        expiresAt: Date.now() + tokenSet.expiresIn * 1000,
      };

      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } catch (error) {
      // SessionStorage might be disabled or full
      Logger.error('Failed to persist session', error);
    }
  }

  /**
   * Restores session from storage
   *
   * @returns Stored session or null if not available
   */
  private restoreSession(): StoredSession | null {
    if (this.storageStrategy === TokenStorage.MEMORY) {
      return null;
    }

    try {
      const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);

      if (!stored) {
        return null;
      }

      const session: StoredSession = JSON.parse(stored);

      // Check if session has expired
      if (session.expiresAt < Date.now()) {
        this.clearSession();
        return null;
      }

      if (config.keycloak.enableDebug) {
        Logger.info('Restored session from storage');
      }

      return session;
    } catch (error) {
      Logger.error('Failed to restore session', error);
      this.clearSession();
      return null;
    }
  }

  /**
   * Clears the stored session
   *
   * Removes tokens from sessionStorage.
   * Implements FR-FE-KC-006 and NFR-FE-KC-002.
   */
  private clearSession(): void {
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (error) {
      Logger.error('Failed to clear session storage', error);
    }
  }

  /**
   * Checks if the user has a specific role
   *
   * @param role - Role to check
   * @returns True if user has the role
   */
  public hasRole(role: string): boolean {
    const kc = this.getKeycloak();
    return kc.hasRealmRole(role) || kc.hasResourceRole(role, config.keycloak.clientId);
  }

  /**
   * Checks if the user has any of the specified roles
   *
   * @param roles - Array of roles to check
   * @returns True if user has at least one role
   */
  public hasAnyRole(roles: string[]): boolean {
    return roles.some((role) => this.hasRole(role));
  }

  /**
   * Checks if the user has all of the specified roles
   *
   * @param roles - Array of roles to check
   * @returns True if user has all roles
   */
  public hasAllRoles(roles: string[]): boolean {
    return roles.every((role) => this.hasRole(role));
  }

  /**
   * Gets the time remaining until token expiration (in seconds)
   *
   * @returns Seconds until expiration, or 0 if not authenticated
   */
  public getTokenExpiresIn(): number {
    const kc = this.getKeycloak();

    if (!kc.authenticated || !kc.tokenParsed?.exp) {
      return 0;
    }

    const expiresIn = kc.tokenParsed.exp - Math.floor(Date.now() / 1000);
    return Math.max(0, expiresIn);
  }

  /**
   * Cleans up the service (removes timers, clears session)
   *
   * Should be called when the application is unmounting.
   */
  public destroy(): void {
    this.stopTokenRefresh();
    this.clearSession();
    this.keycloak = null;
    this.initialized = false;
  }
}

// Export singleton instance
export const keycloakService = new KeycloakService();
