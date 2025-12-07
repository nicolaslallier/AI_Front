import { describe, it, expect, vi } from 'vitest';

import { useMinio } from './use-minio';
import { MinioLoadingState, MinioErrorType } from '../types/index';

// Mock the config module
vi.mock('@/core/config', () => ({
  config: {
    minioUrl: 'http://localhost/minio/',
  },
}));

describe('useMinio', () => {
  describe('initialization', () => {
    it('should initialize with IDLE state', () => {
      const { state } = useMinio();

      expect(state.value.loadingState).toBe(MinioLoadingState.IDLE);
      expect(state.value.error).toBeNull();
      expect(state.value.retryCount).toBe(0);
    });

    it('should use default URL from config', () => {
      const { state } = useMinio();

      expect(state.value.url).toBe('http://localhost/minio/');
    });

    it('should allow custom URL override', () => {
      const customUrl = 'https://custom.minio.url/';
      const { state } = useMinio(customUrl);

      expect(state.value.url).toBe(customUrl);
    });

    it('should initialize computed properties as false', () => {
      const { isLoading, hasError, isLoaded } = useMinio();

      expect(isLoading.value).toBe(false);
      expect(hasError.value).toBe(false);
      expect(isLoaded.value).toBe(false);
    });
  });

  describe('setLoading', () => {
    it('should set state to LOADING', () => {
      const { state, setLoading } = useMinio();

      setLoading();

      expect(state.value.loadingState).toBe(MinioLoadingState.LOADING);
    });

    it('should clear existing error when setting loading', () => {
      const { state, setError, setLoading } = useMinio();

      setError(MinioErrorType.NETWORK_ERROR, 'Test error');
      expect(state.value.error).not.toBeNull();

      setLoading();
      expect(state.value.error).toBeNull();
    });

    it('should set isLoading computed to true', () => {
      const { isLoading, setLoading } = useMinio();

      setLoading();

      expect(isLoading.value).toBe(true);
    });
  });

  describe('setLoaded', () => {
    it('should set state to LOADED', () => {
      const { state, setLoaded } = useMinio();

      setLoaded();

      expect(state.value.loadingState).toBe(MinioLoadingState.LOADED);
    });

    it('should clear existing error when setting loaded', () => {
      const { state, setError, setLoaded } = useMinio();

      setError(MinioErrorType.NETWORK_ERROR, 'Test error');
      expect(state.value.error).not.toBeNull();

      setLoaded();
      expect(state.value.error).toBeNull();
    });

    it('should set isLoaded computed to true', () => {
      const { isLoaded, setLoaded } = useMinio();

      setLoaded();

      expect(isLoaded.value).toBe(true);
    });
  });

  describe('setError', () => {
    it('should set error state with message', () => {
      const { state, setError } = useMinio();

      setError(MinioErrorType.NETWORK_ERROR, 'Network failed');

      expect(state.value.loadingState).toBe(MinioLoadingState.ERROR);
      expect(state.value.error).not.toBeNull();
      expect(state.value.error?.type).toBe(MinioErrorType.NETWORK_ERROR);
      expect(state.value.error?.message).toBe('Network failed');
    });

    it('should set error with optional details', () => {
      const { state, setError } = useMinio();

      setError(MinioErrorType.IFRAME_ERROR, 'Iframe failed', 'CORS policy blocked');

      expect(state.value.error?.details).toBe('CORS policy blocked');
    });

    it('should set error timestamp', () => {
      const { state, setError } = useMinio();
      const beforeTime = new Date();

      setError(MinioErrorType.TIMEOUT_ERROR, 'Timeout');

      const afterTime = new Date();
      expect(state.value.error?.timestamp).toBeInstanceOf(Date);
      expect(state.value.error?.timestamp.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
      expect(state.value.error?.timestamp.getTime()).toBeLessThanOrEqual(afterTime.getTime());
    });

    it('should set hasError computed to true', () => {
      const { hasError, setError } = useMinio();

      setError(MinioErrorType.UNKNOWN_ERROR, 'Unknown error');

      expect(hasError.value).toBe(true);
    });
  });

  describe('reset', () => {
    it('should reset state to IDLE', () => {
      const { state, setLoading, reset } = useMinio();

      setLoading();
      reset();

      expect(state.value.loadingState).toBe(MinioLoadingState.IDLE);
    });

    it('should clear error', () => {
      const { state, setError, reset } = useMinio();

      setError(MinioErrorType.NETWORK_ERROR, 'Test error');
      reset();

      expect(state.value.error).toBeNull();
    });

    it('should reset retry count', () => {
      const { state, incrementRetryCount, reset } = useMinio();

      incrementRetryCount();
      incrementRetryCount();
      expect(state.value.retryCount).toBe(2);

      reset();
      expect(state.value.retryCount).toBe(0);
    });

    it('should not change URL', () => {
      const customUrl = 'https://custom.url/';
      const { state, setLoading, reset } = useMinio(customUrl);

      setLoading();
      reset();

      expect(state.value.url).toBe(customUrl);
    });
  });

  describe('incrementRetryCount', () => {
    it('should increment retry count from 0 to 1', () => {
      const { state, incrementRetryCount } = useMinio();

      incrementRetryCount();

      expect(state.value.retryCount).toBe(1);
    });

    it('should increment multiple times', () => {
      const { state, incrementRetryCount } = useMinio();

      incrementRetryCount();
      incrementRetryCount();
      incrementRetryCount();

      expect(state.value.retryCount).toBe(3);
    });
  });

  describe('computed properties', () => {
    it('should update isLoading reactively', () => {
      const { isLoading, setLoading, setLoaded } = useMinio();

      expect(isLoading.value).toBe(false);

      setLoading();
      expect(isLoading.value).toBe(true);

      setLoaded();
      expect(isLoading.value).toBe(false);
    });

    it('should update hasError reactively', () => {
      const { hasError, setError, setLoaded } = useMinio();

      expect(hasError.value).toBe(false);

      setError(MinioErrorType.NETWORK_ERROR, 'Error');
      expect(hasError.value).toBe(true);

      setLoaded();
      expect(hasError.value).toBe(false);
    });

    it('should update isLoaded reactively', () => {
      const { isLoaded, setLoading, setLoaded } = useMinio();

      expect(isLoaded.value).toBe(false);

      setLoading();
      expect(isLoaded.value).toBe(false);

      setLoaded();
      expect(isLoaded.value).toBe(true);
    });
  });

  describe('state transitions', () => {
    it('should handle typical loading flow', () => {
      const { state, isLoading, isLoaded, hasError, setLoading, setLoaded } = useMinio();

      // Initial state
      expect(state.value.loadingState).toBe(MinioLoadingState.IDLE);
      expect(isLoading.value).toBe(false);
      expect(isLoaded.value).toBe(false);
      expect(hasError.value).toBe(false);

      // Start loading
      setLoading();
      expect(state.value.loadingState).toBe(MinioLoadingState.LOADING);
      expect(isLoading.value).toBe(true);
      expect(isLoaded.value).toBe(false);
      expect(hasError.value).toBe(false);

      // Finish loading
      setLoaded();
      expect(state.value.loadingState).toBe(MinioLoadingState.LOADED);
      expect(isLoading.value).toBe(false);
      expect(isLoaded.value).toBe(true);
      expect(hasError.value).toBe(false);
    });

    it('should handle error flow with retry', () => {
      const { state, hasError, setLoading, setError, incrementRetryCount } = useMinio();

      // Start loading
      setLoading();
      expect(state.value.retryCount).toBe(0);

      // Error occurs
      setError(MinioErrorType.NETWORK_ERROR, 'Failed');
      expect(hasError.value).toBe(true);

      // Retry
      incrementRetryCount();
      setLoading();
      expect(state.value.retryCount).toBe(1);
      expect(hasError.value).toBe(false);
    });
  });

  describe('multiple instances', () => {
    it('should create independent instances', () => {
      const instance1 = useMinio();
      const instance2 = useMinio();

      instance1.setLoading();
      instance2.setLoaded();

      expect(instance1.isLoading.value).toBe(true);
      expect(instance2.isLoaded.value).toBe(true);
      expect(instance1.state.value.loadingState).not.toBe(instance2.state.value.loadingState);
    });
  });
});
