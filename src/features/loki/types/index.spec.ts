import { describe, it, expect } from 'vitest';

import { LokiLoadingState, LokiErrorType } from './index';

import type { LokiError, LokiState } from './index';

describe('loki types', () => {
  describe('LokiLoadingState', () => {
    it('should have IDLE state', () => {
      expect(LokiLoadingState.IDLE).toBe('idle');
    });

    it('should have LOADING state', () => {
      expect(LokiLoadingState.LOADING).toBe('loading');
    });

    it('should have LOADED state', () => {
      expect(LokiLoadingState.LOADED).toBe('loaded');
    });

    it('should have ERROR state', () => {
      expect(LokiLoadingState.ERROR).toBe('error');
    });

    it('should have exactly 4 states', () => {
      const states = Object.values(LokiLoadingState);
      expect(states.length).toBe(4);
    });
  });

  describe('LokiErrorType', () => {
    it('should have NETWORK_ERROR type', () => {
      expect(LokiErrorType.NETWORK_ERROR).toBe('network_error');
    });

    it('should have TIMEOUT_ERROR type', () => {
      expect(LokiErrorType.TIMEOUT_ERROR).toBe('timeout_error');
    });

    it('should have IFRAME_ERROR type', () => {
      expect(LokiErrorType.IFRAME_ERROR).toBe('iframe_error');
    });

    it('should have UNKNOWN_ERROR type', () => {
      expect(LokiErrorType.UNKNOWN_ERROR).toBe('unknown_error');
    });

    it('should have exactly 4 error types', () => {
      const types = Object.values(LokiErrorType);
      expect(types.length).toBe(4);
    });
  });

  describe('LokiError', () => {
    it('should accept a valid error object', () => {
      const error: LokiError = {
        type: LokiErrorType.NETWORK_ERROR,
        message: 'Failed to load Loki',
        timestamp: new Date(),
      };

      expect(error.type).toBe(LokiErrorType.NETWORK_ERROR);
      expect(error.message).toBe('Failed to load Loki');
      expect(error.timestamp).toBeInstanceOf(Date);
    });

    it('should accept optional details property', () => {
      const error: LokiError = {
        type: LokiErrorType.TIMEOUT_ERROR,
        message: 'Request timed out',
        timestamp: new Date(),
        details: 'Connection timeout after 30 seconds',
      };

      expect(error.details).toBe('Connection timeout after 30 seconds');
    });

    it('should work without details property', () => {
      const error: LokiError = {
        type: LokiErrorType.IFRAME_ERROR,
        message: 'Iframe failed to load',
        timestamp: new Date(),
      };

      expect(error.details).toBeUndefined();
    });
  });

  describe('LokiState', () => {
    it('should accept a valid state object', () => {
      const state: LokiState = {
        loadingState: LokiLoadingState.IDLE,
        error: null,
        url: 'http://localhost/loki/',
        retryCount: 0,
      };

      expect(state.loadingState).toBe(LokiLoadingState.IDLE);
      expect(state.error).toBeNull();
      expect(state.url).toBe('http://localhost/loki/');
      expect(state.retryCount).toBe(0);
    });

    it('should accept state with error', () => {
      const error: LokiError = {
        type: LokiErrorType.NETWORK_ERROR,
        message: 'Network error',
        timestamp: new Date(),
      };

      const state: LokiState = {
        loadingState: LokiLoadingState.ERROR,
        error: error,
        url: 'http://localhost/loki/',
        retryCount: 1,
      };

      expect(state.loadingState).toBe(LokiLoadingState.ERROR);
      expect(state.error).toBe(error);
      expect(state.retryCount).toBe(1);
    });

    it('should track retry count', () => {
      const state: LokiState = {
        loadingState: LokiLoadingState.LOADING,
        error: null,
        url: 'http://localhost/loki/',
        retryCount: 3,
      };

      expect(state.retryCount).toBe(3);
    });

    it('should contain all required properties', () => {
      const state: LokiState = {
        loadingState: LokiLoadingState.LOADED,
        error: null,
        url: 'http://localhost/loki/',
        retryCount: 0,
      };

      expect(state).toHaveProperty('loadingState');
      expect(state).toHaveProperty('error');
      expect(state).toHaveProperty('url');
      expect(state).toHaveProperty('retryCount');
    });
  });

  describe('type relationships', () => {
    it('should use LokiLoadingState in LokiState', () => {
      const state: LokiState = {
        loadingState: LokiLoadingState.LOADING,
        error: null,
        url: 'http://localhost/loki/',
        retryCount: 0,
      };

      expect(Object.values(LokiLoadingState)).toContain(state.loadingState);
    });

    it('should use LokiErrorType in LokiError', () => {
      const error: LokiError = {
        type: LokiErrorType.UNKNOWN_ERROR,
        message: 'Unknown error',
        timestamp: new Date(),
      };

      expect(Object.values(LokiErrorType)).toContain(error.type);
    });

    it('should use LokiError in LokiState', () => {
      const error: LokiError = {
        type: LokiErrorType.IFRAME_ERROR,
        message: 'Iframe error',
        timestamp: new Date(),
      };

      const state: LokiState = {
        loadingState: LokiLoadingState.ERROR,
        error: error,
        url: 'http://localhost/loki/',
        retryCount: 1,
      };

      expect(state.error).toBe(error);
    });
  });
});
