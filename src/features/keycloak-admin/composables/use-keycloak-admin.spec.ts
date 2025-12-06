import { describe, it, expect, beforeEach, vi } from 'vitest';

import { useKeycloakAdmin } from './use-keycloak-admin';
import { KeycloakAdminLoadingState, KeycloakAdminErrorType } from '../types/index';

describe('useKeycloakAdmin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    it('should initialize with IDLE state', () => {
      const { state } = useKeycloakAdmin();
      expect(state.value.loadingState).toBe(KeycloakAdminLoadingState.IDLE);
    });

    it('should initialize with null error', () => {
      const { state } = useKeycloakAdmin();
      expect(state.value.error).toBeNull();
    });

    it('should initialize with zero retry count', () => {
      const { state } = useKeycloakAdmin();
      expect(state.value.retryCount).toBe(0);
    });

    it('should initialize with provided URL', () => {
      const testUrl = 'http://test.com/keycloak-admin/';
      const { state } = useKeycloakAdmin(testUrl);
      expect(state.value.url).toBe(testUrl);
    });

    it('should use default URL when not provided', () => {
      const { state } = useKeycloakAdmin();
      expect(state.value.url).toBe('http://localhost/keycloak-admin/');
    });
  });

  describe('setLoading', () => {
    it('should set loading state to LOADING', () => {
      const { state, setLoading } = useKeycloakAdmin();
      setLoading();
      expect(state.value.loadingState).toBe(KeycloakAdminLoadingState.LOADING);
    });

    it('should clear error when setting loading', () => {
      const { state, setError, setLoading } = useKeycloakAdmin();
      setError(KeycloakAdminErrorType.NETWORK_ERROR, 'Test error');
      setLoading();
      expect(state.value.error).toBeNull();
    });
  });

  describe('setLoaded', () => {
    it('should set loading state to LOADED', () => {
      const { state, setLoaded } = useKeycloakAdmin();
      setLoaded();
      expect(state.value.loadingState).toBe(KeycloakAdminLoadingState.LOADED);
    });

    it('should clear error when setting loaded', () => {
      const { state, setError, setLoaded } = useKeycloakAdmin();
      setError(KeycloakAdminErrorType.NETWORK_ERROR, 'Test error');
      setLoaded();
      expect(state.value.error).toBeNull();
    });
  });

  describe('setError', () => {
    it('should set loading state to ERROR', () => {
      const { state, setError } = useKeycloakAdmin();
      setError(KeycloakAdminErrorType.NETWORK_ERROR, 'Network failed');
      expect(state.value.loadingState).toBe(KeycloakAdminLoadingState.ERROR);
    });

    it('should create error object with correct type', () => {
      const { state, setError } = useKeycloakAdmin();
      setError(KeycloakAdminErrorType.TIMEOUT_ERROR, 'Timeout occurred');
      expect(state.value.error?.type).toBe(KeycloakAdminErrorType.TIMEOUT_ERROR);
    });

    it('should create error object with correct message', () => {
      const { state, setError } = useKeycloakAdmin();
      const message = 'Custom error message';
      setError(KeycloakAdminErrorType.IFRAME_ERROR, message);
      expect(state.value.error?.message).toBe(message);
    });

    it('should create error object with timestamp', () => {
      const { state, setError } = useKeycloakAdmin();
      const beforeTime = new Date();
      setError(KeycloakAdminErrorType.UNKNOWN_ERROR, 'Unknown error');
      const afterTime = new Date();

      expect(state.value.error?.timestamp).toBeInstanceOf(Date);
      expect(state.value.error?.timestamp.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
      expect(state.value.error?.timestamp.getTime()).toBeLessThanOrEqual(afterTime.getTime());
    });

    it('should include optional details when provided', () => {
      const { state, setError } = useKeycloakAdmin();
      const details = 'Additional error details';
      setError(KeycloakAdminErrorType.NETWORK_ERROR, 'Error message', details);
      expect(state.value.error?.details).toBe(details);
    });

    it('should not have details when not provided', () => {
      const { state, setError } = useKeycloakAdmin();
      setError(KeycloakAdminErrorType.NETWORK_ERROR, 'Error message');
      expect(state.value.error?.details).toBeUndefined();
    });
  });

  describe('reset', () => {
    it('should reset to IDLE state', () => {
      const { state, setLoading, reset } = useKeycloakAdmin();
      setLoading();
      reset();
      expect(state.value.loadingState).toBe(KeycloakAdminLoadingState.IDLE);
    });

    it('should clear error', () => {
      const { state, setError, reset } = useKeycloakAdmin();
      setError(KeycloakAdminErrorType.NETWORK_ERROR, 'Error');
      reset();
      expect(state.value.error).toBeNull();
    });

    it('should reset retry count to zero', () => {
      const { state, incrementRetryCount, reset } = useKeycloakAdmin();
      incrementRetryCount();
      incrementRetryCount();
      reset();
      expect(state.value.retryCount).toBe(0);
    });

    it('should preserve URL', () => {
      const testUrl = 'http://test.com/keycloak-admin/';
      const { state, setLoading, reset } = useKeycloakAdmin(testUrl);
      setLoading();
      reset();
      expect(state.value.url).toBe(testUrl);
    });
  });

  describe('incrementRetryCount', () => {
    it('should increment retry count from zero', () => {
      const { state, incrementRetryCount } = useKeycloakAdmin();
      incrementRetryCount();
      expect(state.value.retryCount).toBe(1);
    });

    it('should increment retry count multiple times', () => {
      const { state, incrementRetryCount } = useKeycloakAdmin();
      incrementRetryCount();
      incrementRetryCount();
      incrementRetryCount();
      expect(state.value.retryCount).toBe(3);
    });
  });

  describe('computed properties', () => {
    it('should compute isLoading as true when state is LOADING', () => {
      const { isLoading, setLoading } = useKeycloakAdmin();
      setLoading();
      expect(isLoading.value).toBe(true);
    });

    it('should compute isLoading as false when state is not LOADING', () => {
      const { isLoading, setLoaded } = useKeycloakAdmin();
      setLoaded();
      expect(isLoading.value).toBe(false);
    });

    it('should compute hasError as true when error exists', () => {
      const { hasError, setError } = useKeycloakAdmin();
      setError(KeycloakAdminErrorType.NETWORK_ERROR, 'Error');
      expect(hasError.value).toBe(true);
    });

    it('should compute hasError as false when no error', () => {
      const { hasError } = useKeycloakAdmin();
      expect(hasError.value).toBe(false);
    });

    it('should compute isLoaded as true when state is LOADED', () => {
      const { isLoaded, setLoaded } = useKeycloakAdmin();
      setLoaded();
      expect(isLoaded.value).toBe(true);
    });

    it('should compute isLoaded as false when state is not LOADED', () => {
      const { isLoaded, setLoading } = useKeycloakAdmin();
      setLoading();
      expect(isLoaded.value).toBe(false);
    });
  });

  describe('state transitions', () => {
    it('should transition from IDLE to LOADING', () => {
      const { state, setLoading } = useKeycloakAdmin();
      expect(state.value.loadingState).toBe(KeycloakAdminLoadingState.IDLE);
      setLoading();
      expect(state.value.loadingState).toBe(KeycloakAdminLoadingState.LOADING);
    });

    it('should transition from LOADING to LOADED', () => {
      const { state, setLoading, setLoaded } = useKeycloakAdmin();
      setLoading();
      setLoaded();
      expect(state.value.loadingState).toBe(KeycloakAdminLoadingState.LOADED);
    });

    it('should transition from LOADING to ERROR', () => {
      const { state, setLoading, setError } = useKeycloakAdmin();
      setLoading();
      setError(KeycloakAdminErrorType.NETWORK_ERROR, 'Failed');
      expect(state.value.loadingState).toBe(KeycloakAdminLoadingState.ERROR);
    });

    it('should transition from ERROR to LOADING on retry', () => {
      const { state, setError, setLoading } = useKeycloakAdmin();
      setError(KeycloakAdminErrorType.NETWORK_ERROR, 'Failed');
      setLoading();
      expect(state.value.loadingState).toBe(KeycloakAdminLoadingState.LOADING);
    });
  });
});
