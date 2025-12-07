import { describe, it, expect } from 'vitest';

import { MinioLoadingState, MinioErrorType, type MinioError, type MinioState } from './index';

describe('MinIO Types', () => {
  describe('MinioLoadingState', () => {
    it('should have IDLE state', () => {
      expect(MinioLoadingState.IDLE).toBe('idle');
    });

    it('should have LOADING state', () => {
      expect(MinioLoadingState.LOADING).toBe('loading');
    });

    it('should have LOADED state', () => {
      expect(MinioLoadingState.LOADED).toBe('loaded');
    });

    it('should have ERROR state', () => {
      expect(MinioLoadingState.ERROR).toBe('error');
    });

    it('should have exactly 4 states', () => {
      const states = Object.values(MinioLoadingState);
      expect(states).toHaveLength(4);
    });
  });

  describe('MinioErrorType', () => {
    it('should have NETWORK_ERROR type', () => {
      expect(MinioErrorType.NETWORK_ERROR).toBe('network_error');
    });

    it('should have TIMEOUT_ERROR type', () => {
      expect(MinioErrorType.TIMEOUT_ERROR).toBe('timeout_error');
    });

    it('should have IFRAME_ERROR type', () => {
      expect(MinioErrorType.IFRAME_ERROR).toBe('iframe_error');
    });

    it('should have UNKNOWN_ERROR type', () => {
      expect(MinioErrorType.UNKNOWN_ERROR).toBe('unknown_error');
    });

    it('should have exactly 4 error types', () => {
      const errorTypes = Object.values(MinioErrorType);
      expect(errorTypes).toHaveLength(4);
    });
  });

  describe('MinioError', () => {
    it('should allow creating a valid MinioError object', () => {
      const error: MinioError = {
        type: MinioErrorType.NETWORK_ERROR,
        message: 'Failed to load MinIO console',
        timestamp: new Date(),
      };

      expect(error.type).toBe(MinioErrorType.NETWORK_ERROR);
      expect(error.message).toBe('Failed to load MinIO console');
      expect(error.timestamp).toBeInstanceOf(Date);
    });

    it('should allow optional details field', () => {
      const errorWithDetails: MinioError = {
        type: MinioErrorType.IFRAME_ERROR,
        message: 'Iframe failed to load',
        timestamp: new Date(),
        details: 'CORS policy blocked the request',
      };

      expect(errorWithDetails.details).toBe('CORS policy blocked the request');
    });

    it('should allow error without details field', () => {
      const errorWithoutDetails: MinioError = {
        type: MinioErrorType.TIMEOUT_ERROR,
        message: 'Request timed out',
        timestamp: new Date(),
      };

      expect(errorWithoutDetails.details).toBeUndefined();
    });
  });

  describe('MinioState', () => {
    it('should allow creating a valid MinioState object', () => {
      const state: MinioState = {
        loadingState: MinioLoadingState.IDLE,
        error: null,
        url: 'http://localhost/minio/',
        retryCount: 0,
      };

      expect(state.loadingState).toBe(MinioLoadingState.IDLE);
      expect(state.error).toBeNull();
      expect(state.url).toBe('http://localhost/minio/');
      expect(state.retryCount).toBe(0);
    });

    it('should allow state with error', () => {
      const error: MinioError = {
        type: MinioErrorType.NETWORK_ERROR,
        message: 'Network error occurred',
        timestamp: new Date(),
      };

      const state: MinioState = {
        loadingState: MinioLoadingState.ERROR,
        error,
        url: 'http://localhost/minio/',
        retryCount: 1,
      };

      expect(state.loadingState).toBe(MinioLoadingState.ERROR);
      expect(state.error).toBe(error);
      expect(state.retryCount).toBe(1);
    });

    it('should track retry count', () => {
      const state: MinioState = {
        loadingState: MinioLoadingState.LOADING,
        error: null,
        url: 'http://localhost/minio/',
        retryCount: 3,
      };

      expect(state.retryCount).toBe(3);
    });

    it('should store console URL', () => {
      const testUrl = 'https://storage.example.com/minio/';
      const state: MinioState = {
        loadingState: MinioLoadingState.LOADED,
        error: null,
        url: testUrl,
        retryCount: 0,
      };

      expect(state.url).toBe(testUrl);
    });
  });

  describe('Type Relationships', () => {
    it('should allow MinioError to use all MinioErrorType values', () => {
      const errorTypes = Object.values(MinioErrorType);

      errorTypes.forEach((errorType) => {
        const error: MinioError = {
          type: errorType as MinioErrorType,
          message: 'Test error',
          timestamp: new Date(),
        };

        expect(error.type).toBe(errorType);
      });
    });

    it('should allow MinioState to use all MinioLoadingState values', () => {
      const loadingStates = Object.values(MinioLoadingState);

      loadingStates.forEach((loadingState) => {
        const state: MinioState = {
          loadingState: loadingState as MinioLoadingState,
          error: null,
          url: 'http://localhost/minio/',
          retryCount: 0,
        };

        expect(state.loadingState).toBe(loadingState);
      });
    });
  });
});
