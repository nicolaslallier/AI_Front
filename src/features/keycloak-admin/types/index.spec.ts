import { describe, it, expect } from 'vitest';

import { KeycloakAdminLoadingState, KeycloakAdminErrorType } from './index';

import type { KeycloakAdminError, KeycloakAdminState } from './index';

describe('keycloak-admin types', () => {
  describe('KeycloakAdminLoadingState', () => {
    it('should have IDLE state', () => {
      expect(KeycloakAdminLoadingState.IDLE).toBe('idle');
    });

    it('should have LOADING state', () => {
      expect(KeycloakAdminLoadingState.LOADING).toBe('loading');
    });

    it('should have LOADED state', () => {
      expect(KeycloakAdminLoadingState.LOADED).toBe('loaded');
    });

    it('should have ERROR state', () => {
      expect(KeycloakAdminLoadingState.ERROR).toBe('error');
    });

    it('should have exactly 4 states', () => {
      const states = Object.values(KeycloakAdminLoadingState);
      expect(states.length).toBe(4);
    });
  });

  describe('KeycloakAdminErrorType', () => {
    it('should have NETWORK_ERROR type', () => {
      expect(KeycloakAdminErrorType.NETWORK_ERROR).toBe('network_error');
    });

    it('should have TIMEOUT_ERROR type', () => {
      expect(KeycloakAdminErrorType.TIMEOUT_ERROR).toBe('timeout_error');
    });

    it('should have IFRAME_ERROR type', () => {
      expect(KeycloakAdminErrorType.IFRAME_ERROR).toBe('iframe_error');
    });

    it('should have UNKNOWN_ERROR type', () => {
      expect(KeycloakAdminErrorType.UNKNOWN_ERROR).toBe('unknown_error');
    });

    it('should have exactly 4 error types', () => {
      const types = Object.values(KeycloakAdminErrorType);
      expect(types.length).toBe(4);
    });
  });

  describe('KeycloakAdminError', () => {
    it('should accept a valid error object', () => {
      const error: KeycloakAdminError = {
        type: KeycloakAdminErrorType.NETWORK_ERROR,
        message: 'Failed to load Keycloak Admin',
        timestamp: new Date(),
      };

      expect(error.type).toBe(KeycloakAdminErrorType.NETWORK_ERROR);
      expect(error.message).toBe('Failed to load Keycloak Admin');
      expect(error.timestamp).toBeInstanceOf(Date);
    });

    it('should accept optional details property', () => {
      const error: KeycloakAdminError = {
        type: KeycloakAdminErrorType.TIMEOUT_ERROR,
        message: 'Request timed out',
        timestamp: new Date(),
        details: 'Connection timeout after 30 seconds',
      };

      expect(error.details).toBe('Connection timeout after 30 seconds');
    });

    it('should work without details property', () => {
      const error: KeycloakAdminError = {
        type: KeycloakAdminErrorType.IFRAME_ERROR,
        message: 'Iframe failed to load',
        timestamp: new Date(),
      };

      expect(error.details).toBeUndefined();
    });
  });

  describe('KeycloakAdminState', () => {
    it('should accept a valid state object', () => {
      const state: KeycloakAdminState = {
        loadingState: KeycloakAdminLoadingState.IDLE,
        error: null,
        url: 'http://localhost/keycloak-admin/',
        retryCount: 0,
      };

      expect(state.loadingState).toBe(KeycloakAdminLoadingState.IDLE);
      expect(state.error).toBeNull();
      expect(state.url).toBe('http://localhost/keycloak-admin/');
      expect(state.retryCount).toBe(0);
    });

    it('should accept state with error', () => {
      const error: KeycloakAdminError = {
        type: KeycloakAdminErrorType.NETWORK_ERROR,
        message: 'Network error',
        timestamp: new Date(),
      };

      const state: KeycloakAdminState = {
        loadingState: KeycloakAdminLoadingState.ERROR,
        error: error,
        url: 'http://localhost/keycloak-admin/',
        retryCount: 1,
      };

      expect(state.loadingState).toBe(KeycloakAdminLoadingState.ERROR);
      expect(state.error).toBe(error);
      expect(state.retryCount).toBe(1);
    });

    it('should track retry count', () => {
      const state: KeycloakAdminState = {
        loadingState: KeycloakAdminLoadingState.LOADING,
        error: null,
        url: 'http://localhost/keycloak-admin/',
        retryCount: 3,
      };

      expect(state.retryCount).toBe(3);
    });

    it('should contain all required properties', () => {
      const state: KeycloakAdminState = {
        loadingState: KeycloakAdminLoadingState.LOADED,
        error: null,
        url: 'http://localhost/keycloak-admin/',
        retryCount: 0,
      };

      expect(state).toHaveProperty('loadingState');
      expect(state).toHaveProperty('error');
      expect(state).toHaveProperty('url');
      expect(state).toHaveProperty('retryCount');
    });
  });

  describe('type relationships', () => {
    it('should use KeycloakAdminLoadingState in KeycloakAdminState', () => {
      const state: KeycloakAdminState = {
        loadingState: KeycloakAdminLoadingState.LOADING,
        error: null,
        url: 'http://localhost/keycloak-admin/',
        retryCount: 0,
      };

      expect(Object.values(KeycloakAdminLoadingState)).toContain(state.loadingState);
    });

    it('should use KeycloakAdminErrorType in KeycloakAdminError', () => {
      const error: KeycloakAdminError = {
        type: KeycloakAdminErrorType.UNKNOWN_ERROR,
        message: 'Unknown error',
        timestamp: new Date(),
      };

      expect(Object.values(KeycloakAdminErrorType)).toContain(error.type);
    });

    it('should use KeycloakAdminError in KeycloakAdminState', () => {
      const error: KeycloakAdminError = {
        type: KeycloakAdminErrorType.IFRAME_ERROR,
        message: 'Iframe error',
        timestamp: new Date(),
      };

      const state: KeycloakAdminState = {
        loadingState: KeycloakAdminLoadingState.ERROR,
        error: error,
        url: 'http://localhost/keycloak-admin/',
        retryCount: 1,
      };

      expect(state.error).toBe(error);
    });
  });
});
