import { describe, it, expect } from 'vitest';

import { GrafanaLoadingState, GrafanaErrorType } from './index';

import type { GrafanaError, GrafanaState } from './index';

describe('grafana types', () => {
  describe('GrafanaLoadingState', () => {
    it('should have IDLE state', () => {
      expect(GrafanaLoadingState.IDLE).toBe('idle');
    });

    it('should have LOADING state', () => {
      expect(GrafanaLoadingState.LOADING).toBe('loading');
    });

    it('should have LOADED state', () => {
      expect(GrafanaLoadingState.LOADED).toBe('loaded');
    });

    it('should have ERROR state', () => {
      expect(GrafanaLoadingState.ERROR).toBe('error');
    });

    it('should have exactly 4 states', () => {
      const states = Object.values(GrafanaLoadingState);
      expect(states.length).toBe(4);
    });
  });

  describe('GrafanaErrorType', () => {
    it('should have NETWORK_ERROR type', () => {
      expect(GrafanaErrorType.NETWORK_ERROR).toBe('network_error');
    });

    it('should have TIMEOUT_ERROR type', () => {
      expect(GrafanaErrorType.TIMEOUT_ERROR).toBe('timeout_error');
    });

    it('should have IFRAME_ERROR type', () => {
      expect(GrafanaErrorType.IFRAME_ERROR).toBe('iframe_error');
    });

    it('should have UNKNOWN_ERROR type', () => {
      expect(GrafanaErrorType.UNKNOWN_ERROR).toBe('unknown_error');
    });

    it('should have exactly 4 error types', () => {
      const types = Object.values(GrafanaErrorType);
      expect(types.length).toBe(4);
    });
  });

  describe('GrafanaError', () => {
    it('should accept a valid error object', () => {
      const error: GrafanaError = {
        type: GrafanaErrorType.NETWORK_ERROR,
        message: 'Failed to load Grafana',
        timestamp: new Date(),
      };

      expect(error.type).toBe(GrafanaErrorType.NETWORK_ERROR);
      expect(error.message).toBe('Failed to load Grafana');
      expect(error.timestamp).toBeInstanceOf(Date);
    });

    it('should accept optional details property', () => {
      const error: GrafanaError = {
        type: GrafanaErrorType.TIMEOUT_ERROR,
        message: 'Request timed out',
        timestamp: new Date(),
        details: 'Connection timeout after 30 seconds',
      };

      expect(error.details).toBe('Connection timeout after 30 seconds');
    });

    it('should work without details property', () => {
      const error: GrafanaError = {
        type: GrafanaErrorType.IFRAME_ERROR,
        message: 'Iframe failed to load',
        timestamp: new Date(),
      };

      expect(error.details).toBeUndefined();
    });
  });

  describe('GrafanaState', () => {
    it('should accept a valid state object', () => {
      const state: GrafanaState = {
        loadingState: GrafanaLoadingState.IDLE,
        error: null,
        url: 'http://localhost/grafana/',
        retryCount: 0,
      };

      expect(state.loadingState).toBe(GrafanaLoadingState.IDLE);
      expect(state.error).toBeNull();
      expect(state.url).toBe('http://localhost/grafana/');
      expect(state.retryCount).toBe(0);
    });

    it('should accept state with error', () => {
      const error: GrafanaError = {
        type: GrafanaErrorType.NETWORK_ERROR,
        message: 'Network error',
        timestamp: new Date(),
      };

      const state: GrafanaState = {
        loadingState: GrafanaLoadingState.ERROR,
        error: error,
        url: 'http://localhost/grafana/',
        retryCount: 1,
      };

      expect(state.loadingState).toBe(GrafanaLoadingState.ERROR);
      expect(state.error).toBe(error);
      expect(state.retryCount).toBe(1);
    });

    it('should track retry count', () => {
      const state: GrafanaState = {
        loadingState: GrafanaLoadingState.LOADING,
        error: null,
        url: 'http://localhost/grafana/',
        retryCount: 3,
      };

      expect(state.retryCount).toBe(3);
    });

    it('should contain all required properties', () => {
      const state: GrafanaState = {
        loadingState: GrafanaLoadingState.LOADED,
        error: null,
        url: 'http://localhost/grafana/',
        retryCount: 0,
      };

      expect(state).toHaveProperty('loadingState');
      expect(state).toHaveProperty('error');
      expect(state).toHaveProperty('url');
      expect(state).toHaveProperty('retryCount');
    });
  });

  describe('type relationships', () => {
    it('should use GrafanaLoadingState in GrafanaState', () => {
      const state: GrafanaState = {
        loadingState: GrafanaLoadingState.LOADING,
        error: null,
        url: 'http://localhost/grafana/',
        retryCount: 0,
      };

      expect(Object.values(GrafanaLoadingState)).toContain(state.loadingState);
    });

    it('should use GrafanaErrorType in GrafanaError', () => {
      const error: GrafanaError = {
        type: GrafanaErrorType.UNKNOWN_ERROR,
        message: 'Unknown error',
        timestamp: new Date(),
      };

      expect(Object.values(GrafanaErrorType)).toContain(error.type);
    });

    it('should use GrafanaError in GrafanaState', () => {
      const error: GrafanaError = {
        type: GrafanaErrorType.IFRAME_ERROR,
        message: 'Iframe error',
        timestamp: new Date(),
      };

      const state: GrafanaState = {
        loadingState: GrafanaLoadingState.ERROR,
        error: error,
        url: 'http://localhost/grafana/',
        retryCount: 1,
      };

      expect(state.error).toBe(error);
    });
  });
});
