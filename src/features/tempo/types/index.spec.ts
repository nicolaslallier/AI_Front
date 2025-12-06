import { describe, it, expect } from 'vitest';

import { TempoLoadingState, TempoErrorType } from './index';

import type { TempoError, TempoState } from './index';

describe('tempo types', () => {
  describe('TempoLoadingState', () => {
    it('should have IDLE state', () => {
      expect(TempoLoadingState.IDLE).toBe('idle');
    });

    it('should have LOADING state', () => {
      expect(TempoLoadingState.LOADING).toBe('loading');
    });

    it('should have LOADED state', () => {
      expect(TempoLoadingState.LOADED).toBe('loaded');
    });

    it('should have ERROR state', () => {
      expect(TempoLoadingState.ERROR).toBe('error');
    });

    it('should have exactly 4 states', () => {
      const states = Object.values(TempoLoadingState);
      expect(states.length).toBe(4);
    });
  });

  describe('TempoErrorType', () => {
    it('should have NETWORK_ERROR type', () => {
      expect(TempoErrorType.NETWORK_ERROR).toBe('network_error');
    });

    it('should have TIMEOUT_ERROR type', () => {
      expect(TempoErrorType.TIMEOUT_ERROR).toBe('timeout_error');
    });

    it('should have IFRAME_ERROR type', () => {
      expect(TempoErrorType.IFRAME_ERROR).toBe('iframe_error');
    });

    it('should have UNKNOWN_ERROR type', () => {
      expect(TempoErrorType.UNKNOWN_ERROR).toBe('unknown_error');
    });

    it('should have exactly 4 error types', () => {
      const types = Object.values(TempoErrorType);
      expect(types.length).toBe(4);
    });
  });

  describe('TempoError', () => {
    it('should accept a valid error object', () => {
      const error: TempoError = {
        type: TempoErrorType.NETWORK_ERROR,
        message: 'Failed to load Tempo',
        timestamp: new Date(),
      };

      expect(error.type).toBe(TempoErrorType.NETWORK_ERROR);
      expect(error.message).toBe('Failed to load Tempo');
      expect(error.timestamp).toBeInstanceOf(Date);
    });

    it('should accept optional details property', () => {
      const error: TempoError = {
        type: TempoErrorType.TIMEOUT_ERROR,
        message: 'Request timed out',
        timestamp: new Date(),
        details: 'Connection timeout after 30 seconds',
      };

      expect(error.details).toBe('Connection timeout after 30 seconds');
    });

    it('should work without details property', () => {
      const error: TempoError = {
        type: TempoErrorType.IFRAME_ERROR,
        message: 'Iframe failed to load',
        timestamp: new Date(),
      };

      expect(error.details).toBeUndefined();
    });
  });

  describe('TempoState', () => {
    it('should accept a valid state object', () => {
      const state: TempoState = {
        loadingState: TempoLoadingState.IDLE,
        error: null,
        url: 'http://localhost/tempo/',
        retryCount: 0,
      };

      expect(state.loadingState).toBe(TempoLoadingState.IDLE);
      expect(state.error).toBeNull();
      expect(state.url).toBe('http://localhost/tempo/');
      expect(state.retryCount).toBe(0);
    });

    it('should accept state with error', () => {
      const error: TempoError = {
        type: TempoErrorType.NETWORK_ERROR,
        message: 'Network error',
        timestamp: new Date(),
      };

      const state: TempoState = {
        loadingState: TempoLoadingState.ERROR,
        error: error,
        url: 'http://localhost/tempo/',
        retryCount: 1,
      };

      expect(state.loadingState).toBe(TempoLoadingState.ERROR);
      expect(state.error).toBe(error);
      expect(state.retryCount).toBe(1);
    });

    it('should track retry count', () => {
      const state: TempoState = {
        loadingState: TempoLoadingState.LOADING,
        error: null,
        url: 'http://localhost/tempo/',
        retryCount: 3,
      };

      expect(state.retryCount).toBe(3);
    });

    it('should contain all required properties', () => {
      const state: TempoState = {
        loadingState: TempoLoadingState.LOADED,
        error: null,
        url: 'http://localhost/tempo/',
        retryCount: 0,
      };

      expect(state).toHaveProperty('loadingState');
      expect(state).toHaveProperty('error');
      expect(state).toHaveProperty('url');
      expect(state).toHaveProperty('retryCount');
    });
  });

  describe('type relationships', () => {
    it('should use TempoLoadingState in TempoState', () => {
      const state: TempoState = {
        loadingState: TempoLoadingState.LOADING,
        error: null,
        url: 'http://localhost/tempo/',
        retryCount: 0,
      };

      expect(Object.values(TempoLoadingState)).toContain(state.loadingState);
    });

    it('should use TempoErrorType in TempoError', () => {
      const error: TempoError = {
        type: TempoErrorType.UNKNOWN_ERROR,
        message: 'Unknown error',
        timestamp: new Date(),
      };

      expect(Object.values(TempoErrorType)).toContain(error.type);
    });

    it('should use TempoError in TempoState', () => {
      const error: TempoError = {
        type: TempoErrorType.IFRAME_ERROR,
        message: 'Iframe error',
        timestamp: new Date(),
      };

      const state: TempoState = {
        loadingState: TempoLoadingState.ERROR,
        error: error,
        url: 'http://localhost/tempo/',
        retryCount: 1,
      };

      expect(state.error).toBe(error);
    });
  });
});
