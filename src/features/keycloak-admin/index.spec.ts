import { describe, it, expect } from 'vitest';

import { KeycloakAdminLoadingState, KeycloakAdminErrorType } from './index';

import type { KeycloakAdminError, KeycloakAdminState } from './index';

describe('keycloak-admin feature exports', () => {
  it('should export KeycloakAdminLoadingState enum', () => {
    expect(KeycloakAdminLoadingState).toBeDefined();
    expect(KeycloakAdminLoadingState.IDLE).toBe('idle');
  });

  it('should export KeycloakAdminErrorType enum', () => {
    expect(KeycloakAdminErrorType).toBeDefined();
    expect(KeycloakAdminErrorType.NETWORK_ERROR).toBe('network_error');
  });

  it('should export KeycloakAdminError type', () => {
    const error: KeycloakAdminError = {
      type: KeycloakAdminErrorType.UNKNOWN_ERROR,
      message: 'Test error',
      timestamp: new Date(),
    };

    expect(error).toBeDefined();
  });

  it('should export KeycloakAdminState type', () => {
    const state: KeycloakAdminState = {
      loadingState: KeycloakAdminLoadingState.IDLE,
      error: null,
      url: 'http://localhost/keycloak-admin/',
      retryCount: 0,
    };

    expect(state).toBeDefined();
  });
});
