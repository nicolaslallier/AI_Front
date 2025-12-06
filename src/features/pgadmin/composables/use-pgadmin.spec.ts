import { describe, it, expect, beforeEach, vi } from 'vitest';

import { usePgAdmin } from './use-pgadmin';
import { PgAdminLoadingState, PgAdminErrorType } from '../types/index';

describe('usePgAdmin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    it('should initialize with IDLE state', () => {
      const { state } = usePgAdmin();
      expect(state.value.loadingState).toBe(PgAdminLoadingState.IDLE);
    });

    it('should initialize with null error', () => {
      const { state } = usePgAdmin();
      expect(state.value.error).toBeNull();
    });

    it('should initialize with zero retry count', () => {
      const { state } = usePgAdmin();
      expect(state.value.retryCount).toBe(0);
    });

    it('should initialize with provided URL', () => {
      const testUrl = 'http://test.com/pgadmin/';
      const { state } = usePgAdmin(testUrl);
      expect(state.value.url).toBe(testUrl);
    });

    it('should use default URL when not provided', () => {
      const { state } = usePgAdmin();
      expect(state.value.url).toBe('http://localhost/pgadmin/');
    });
  });

  describe('setLoading', () => {
    it('should set loading state to LOADING', () => {
      const { state, setLoading } = usePgAdmin();
      setLoading();
      expect(state.value.loadingState).toBe(PgAdminLoadingState.LOADING);
    });

    it('should clear error when setting loading', () => {
      const { state, setError, setLoading } = usePgAdmin();
      setError(PgAdminErrorType.NETWORK_ERROR, 'Test error');
      setLoading();
      expect(state.value.error).toBeNull();
    });
  });

  describe('setLoaded', () => {
    it('should set loading state to LOADED', () => {
      const { state, setLoaded } = usePgAdmin();
      setLoaded();
      expect(state.value.loadingState).toBe(PgAdminLoadingState.LOADED);
    });

    it('should clear error when setting loaded', () => {
      const { state, setError, setLoaded } = usePgAdmin();
      setError(PgAdminErrorType.NETWORK_ERROR, 'Test error');
      setLoaded();
      expect(state.value.error).toBeNull();
    });
  });

  describe('setError', () => {
    it('should set loading state to ERROR', () => {
      const { state, setError } = usePgAdmin();
      setError(PgAdminErrorType.NETWORK_ERROR, 'Network failed');
      expect(state.value.loadingState).toBe(PgAdminLoadingState.ERROR);
    });

    it('should create error object with correct type', () => {
      const { state, setError } = usePgAdmin();
      setError(PgAdminErrorType.TIMEOUT_ERROR, 'Timeout occurred');
      expect(state.value.error?.type).toBe(PgAdminErrorType.TIMEOUT_ERROR);
    });

    it('should create error object with correct message', () => {
      const { state, setError } = usePgAdmin();
      const message = 'Custom error message';
      setError(PgAdminErrorType.IFRAME_ERROR, message);
      expect(state.value.error?.message).toBe(message);
    });

    it('should create error object with timestamp', () => {
      const { state, setError } = usePgAdmin();
      const beforeTime = new Date();
      setError(PgAdminErrorType.UNKNOWN_ERROR, 'Unknown error');
      const afterTime = new Date();

      expect(state.value.error?.timestamp).toBeInstanceOf(Date);
      expect(state.value.error?.timestamp.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
      expect(state.value.error?.timestamp.getTime()).toBeLessThanOrEqual(afterTime.getTime());
    });

    it('should include optional details when provided', () => {
      const { state, setError } = usePgAdmin();
      const details = 'Additional error details';
      setError(PgAdminErrorType.NETWORK_ERROR, 'Error message', details);
      expect(state.value.error?.details).toBe(details);
    });

    it('should not have details when not provided', () => {
      const { state, setError } = usePgAdmin();
      setError(PgAdminErrorType.NETWORK_ERROR, 'Error message');
      expect(state.value.error?.details).toBeUndefined();
    });
  });

  describe('reset', () => {
    it('should reset to IDLE state', () => {
      const { state, setLoading, reset } = usePgAdmin();
      setLoading();
      reset();
      expect(state.value.loadingState).toBe(PgAdminLoadingState.IDLE);
    });

    it('should clear error', () => {
      const { state, setError, reset } = usePgAdmin();
      setError(PgAdminErrorType.NETWORK_ERROR, 'Error');
      reset();
      expect(state.value.error).toBeNull();
    });

    it('should reset retry count to zero', () => {
      const { state, incrementRetryCount, reset } = usePgAdmin();
      incrementRetryCount();
      incrementRetryCount();
      reset();
      expect(state.value.retryCount).toBe(0);
    });

    it('should preserve URL', () => {
      const testUrl = 'http://test.com/pgadmin/';
      const { state, setLoading, reset } = usePgAdmin(testUrl);
      setLoading();
      reset();
      expect(state.value.url).toBe(testUrl);
    });
  });

  describe('incrementRetryCount', () => {
    it('should increment retry count from zero', () => {
      const { state, incrementRetryCount } = usePgAdmin();
      incrementRetryCount();
      expect(state.value.retryCount).toBe(1);
    });

    it('should increment retry count multiple times', () => {
      const { state, incrementRetryCount } = usePgAdmin();
      incrementRetryCount();
      incrementRetryCount();
      incrementRetryCount();
      expect(state.value.retryCount).toBe(3);
    });
  });

  describe('computed properties', () => {
    it('should compute isLoading as true when state is LOADING', () => {
      const { isLoading, setLoading } = usePgAdmin();
      setLoading();
      expect(isLoading.value).toBe(true);
    });

    it('should compute isLoading as false when state is not LOADING', () => {
      const { isLoading, setLoaded } = usePgAdmin();
      setLoaded();
      expect(isLoading.value).toBe(false);
    });

    it('should compute hasError as true when error exists', () => {
      const { hasError, setError } = usePgAdmin();
      setError(PgAdminErrorType.NETWORK_ERROR, 'Error');
      expect(hasError.value).toBe(true);
    });

    it('should compute hasError as false when no error', () => {
      const { hasError } = usePgAdmin();
      expect(hasError.value).toBe(false);
    });

    it('should compute isLoaded as true when state is LOADED', () => {
      const { isLoaded, setLoaded } = usePgAdmin();
      setLoaded();
      expect(isLoaded.value).toBe(true);
    });

    it('should compute isLoaded as false when state is not LOADED', () => {
      const { isLoaded, setLoading } = usePgAdmin();
      setLoading();
      expect(isLoaded.value).toBe(false);
    });
  });

  describe('state transitions', () => {
    it('should transition from IDLE to LOADING', () => {
      const { state, setLoading } = usePgAdmin();
      expect(state.value.loadingState).toBe(PgAdminLoadingState.IDLE);
      setLoading();
      expect(state.value.loadingState).toBe(PgAdminLoadingState.LOADING);
    });

    it('should transition from LOADING to LOADED', () => {
      const { state, setLoading, setLoaded } = usePgAdmin();
      setLoading();
      setLoaded();
      expect(state.value.loadingState).toBe(PgAdminLoadingState.LOADED);
    });

    it('should transition from LOADING to ERROR', () => {
      const { state, setLoading, setError } = usePgAdmin();
      setLoading();
      setError(PgAdminErrorType.NETWORK_ERROR, 'Failed');
      expect(state.value.loadingState).toBe(PgAdminLoadingState.ERROR);
    });

    it('should transition from ERROR to LOADING on retry', () => {
      const { state, setError, setLoading } = usePgAdmin();
      setError(PgAdminErrorType.NETWORK_ERROR, 'Failed');
      setLoading();
      expect(state.value.loadingState).toBe(PgAdminLoadingState.LOADING);
    });
  });
});
