import { describe, it, expect } from 'vitest';

import { useMinio, MinioLoadingState, MinioErrorType } from './index';

import type { UseMinioReturn, MinioState, MinioError } from './index';

describe('MinIO module exports', () => {
  describe('composable exports', () => {
    it('should export useMinio composable', () => {
      expect(useMinio).toBeDefined();
      expect(typeof useMinio).toBe('function');
    });

    it('should create functional composable instance', () => {
      const instance: UseMinioReturn = useMinio();
      expect(instance).toBeDefined();
      expect(instance.state).toBeDefined();
      expect(instance.setLoading).toBeDefined();
    });
  });

  describe('type exports', () => {
    it('should export MinioLoadingState enum', () => {
      expect(MinioLoadingState).toBeDefined();
      expect(MinioLoadingState.IDLE).toBe('idle');
      expect(MinioLoadingState.LOADING).toBe('loading');
      expect(MinioLoadingState.LOADED).toBe('loaded');
      expect(MinioLoadingState.ERROR).toBe('error');
    });

    it('should export MinioErrorType enum', () => {
      expect(MinioErrorType).toBeDefined();
      expect(MinioErrorType.NETWORK_ERROR).toBe('network_error');
      expect(MinioErrorType.TIMEOUT_ERROR).toBe('timeout_error');
      expect(MinioErrorType.IFRAME_ERROR).toBe('iframe_error');
      expect(MinioErrorType.UNKNOWN_ERROR).toBe('unknown_error');
    });
  });

  describe('type interfaces', () => {
    it('should allow creating MinioState objects', () => {
      const state: MinioState = {
        loadingState: MinioLoadingState.IDLE,
        error: null,
        url: 'http://localhost/minio/',
        retryCount: 0,
      };
      expect(state).toBeDefined();
    });

    it('should allow creating MinioError objects', () => {
      const error: MinioError = {
        type: MinioErrorType.NETWORK_ERROR,
        message: 'Test error',
        timestamp: new Date(),
      };
      expect(error).toBeDefined();
    });

    it('should allow UseMinioReturn type', () => {
      const composableReturn: UseMinioReturn = useMinio();
      expect(composableReturn.state).toBeDefined();
      expect(composableReturn.isLoading).toBeDefined();
      expect(composableReturn.hasError).toBeDefined();
      expect(composableReturn.isLoaded).toBeDefined();
      expect(typeof composableReturn.setLoading).toBe('function');
      expect(typeof composableReturn.setLoaded).toBe('function');
      expect(typeof composableReturn.setError).toBe('function');
      expect(typeof composableReturn.reset).toBe('function');
      expect(typeof composableReturn.incrementRetryCount).toBe('function');
    });
  });

  describe('module structure', () => {
    it('should provide clean API surface', () => {
      const module = { useMinio, MinioLoadingState, MinioErrorType };

      expect(Object.keys(module)).toHaveLength(3);
      expect(module.useMinio).toBeDefined();
      expect(module.MinioLoadingState).toBeDefined();
      expect(module.MinioErrorType).toBeDefined();
    });
  });
});
