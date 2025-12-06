import { describe, it, expect } from 'vitest';

import { PgAdminLoadingState, PgAdminErrorType } from './index';

import type { PgAdminError, PgAdminState } from './index';

describe('pgadmin types', () => {
  describe('PgAdminLoadingState', () => {
    it('should have IDLE state', () => {
      expect(PgAdminLoadingState.IDLE).toBe('idle');
    });

    it('should have LOADING state', () => {
      expect(PgAdminLoadingState.LOADING).toBe('loading');
    });

    it('should have LOADED state', () => {
      expect(PgAdminLoadingState.LOADED).toBe('loaded');
    });

    it('should have ERROR state', () => {
      expect(PgAdminLoadingState.ERROR).toBe('error');
    });

    it('should have exactly 4 states', () => {
      const states = Object.values(PgAdminLoadingState);
      expect(states.length).toBe(4);
    });
  });

  describe('PgAdminErrorType', () => {
    it('should have NETWORK_ERROR type', () => {
      expect(PgAdminErrorType.NETWORK_ERROR).toBe('network_error');
    });

    it('should have TIMEOUT_ERROR type', () => {
      expect(PgAdminErrorType.TIMEOUT_ERROR).toBe('timeout_error');
    });

    it('should have IFRAME_ERROR type', () => {
      expect(PgAdminErrorType.IFRAME_ERROR).toBe('iframe_error');
    });

    it('should have UNKNOWN_ERROR type', () => {
      expect(PgAdminErrorType.UNKNOWN_ERROR).toBe('unknown_error');
    });

    it('should have exactly 4 error types', () => {
      const types = Object.values(PgAdminErrorType);
      expect(types.length).toBe(4);
    });
  });

  describe('PgAdminError', () => {
    it('should accept a valid error object', () => {
      const error: PgAdminError = {
        type: PgAdminErrorType.NETWORK_ERROR,
        message: 'Failed to load pgAdmin',
        timestamp: new Date(),
      };

      expect(error.type).toBe(PgAdminErrorType.NETWORK_ERROR);
      expect(error.message).toBe('Failed to load pgAdmin');
      expect(error.timestamp).toBeInstanceOf(Date);
    });

    it('should accept optional details property', () => {
      const error: PgAdminError = {
        type: PgAdminErrorType.TIMEOUT_ERROR,
        message: 'Request timed out',
        timestamp: new Date(),
        details: 'Connection timeout after 30 seconds',
      };

      expect(error.details).toBe('Connection timeout after 30 seconds');
    });

    it('should work without details property', () => {
      const error: PgAdminError = {
        type: PgAdminErrorType.IFRAME_ERROR,
        message: 'Iframe failed to load',
        timestamp: new Date(),
      };

      expect(error.details).toBeUndefined();
    });
  });

  describe('PgAdminState', () => {
    it('should accept a valid state object', () => {
      const state: PgAdminState = {
        loadingState: PgAdminLoadingState.IDLE,
        error: null,
        url: 'http://localhost/pgadmin/',
        retryCount: 0,
      };

      expect(state.loadingState).toBe(PgAdminLoadingState.IDLE);
      expect(state.error).toBeNull();
      expect(state.url).toBe('http://localhost/pgadmin/');
      expect(state.retryCount).toBe(0);
    });

    it('should accept state with error', () => {
      const error: PgAdminError = {
        type: PgAdminErrorType.NETWORK_ERROR,
        message: 'Network error',
        timestamp: new Date(),
      };

      const state: PgAdminState = {
        loadingState: PgAdminLoadingState.ERROR,
        error: error,
        url: 'http://localhost/pgadmin/',
        retryCount: 1,
      };

      expect(state.loadingState).toBe(PgAdminLoadingState.ERROR);
      expect(state.error).toBe(error);
      expect(state.retryCount).toBe(1);
    });

    it('should track retry count', () => {
      const state: PgAdminState = {
        loadingState: PgAdminLoadingState.LOADING,
        error: null,
        url: 'http://localhost/pgadmin/',
        retryCount: 3,
      };

      expect(state.retryCount).toBe(3);
    });

    it('should contain all required properties', () => {
      const state: PgAdminState = {
        loadingState: PgAdminLoadingState.LOADED,
        error: null,
        url: 'http://localhost/pgadmin/',
        retryCount: 0,
      };

      expect(state).toHaveProperty('loadingState');
      expect(state).toHaveProperty('error');
      expect(state).toHaveProperty('url');
      expect(state).toHaveProperty('retryCount');
    });
  });

  describe('type relationships', () => {
    it('should use PgAdminLoadingState in PgAdminState', () => {
      const state: PgAdminState = {
        loadingState: PgAdminLoadingState.LOADING,
        error: null,
        url: 'http://localhost/pgadmin/',
        retryCount: 0,
      };

      expect(Object.values(PgAdminLoadingState)).toContain(state.loadingState);
    });

    it('should use PgAdminErrorType in PgAdminError', () => {
      const error: PgAdminError = {
        type: PgAdminErrorType.UNKNOWN_ERROR,
        message: 'Unknown error',
        timestamp: new Date(),
      };

      expect(Object.values(PgAdminErrorType)).toContain(error.type);
    });

    it('should use PgAdminError in PgAdminState', () => {
      const error: PgAdminError = {
        type: PgAdminErrorType.IFRAME_ERROR,
        message: 'Iframe error',
        timestamp: new Date(),
      };

      const state: PgAdminState = {
        loadingState: PgAdminLoadingState.ERROR,
        error: error,
        url: 'http://localhost/pgadmin/',
        retryCount: 1,
      };

      expect(state.error).toBe(error);
    });
  });
});
