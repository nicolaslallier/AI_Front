import { ref, computed, type Ref } from 'vue';

import {
  KeycloakAdminLoadingState,
  KeycloakAdminErrorType,
  type KeycloakAdminState,
  type KeycloakAdminError,
} from '../types/index';

import { config } from '@/core/config';

/**
 * Composable return type for useKeycloakAdmin
 */
export interface UseKeycloakAdminReturn {
  state: Ref<KeycloakAdminState>;
  isLoading: Ref<boolean>;
  hasError: Ref<boolean>;
  isLoaded: Ref<boolean>;
  setLoading: () => void;
  setLoaded: () => void;
  setError: (type: KeycloakAdminErrorType, message: string, details?: string) => void;
  reset: () => void;
  incrementRetryCount: () => void;
}

/**
 * Creates computed properties for Keycloak Admin state
 *
 * @param state - Reactive Keycloak Admin state reference
 * @returns Computed properties for loading, error, and loaded states
 */
function createComputedProperties(state: Ref<KeycloakAdminState>): {
  isLoading: Ref<boolean>;
  hasError: Ref<boolean>;
  isLoaded: Ref<boolean>;
} {
  const isLoading = computed((): boolean => {
    return state.value.loadingState === KeycloakAdminLoadingState.LOADING;
  });

  const hasError = computed((): boolean => {
    return state.value.error !== null;
  });

  const isLoaded = computed((): boolean => {
    return state.value.loadingState === KeycloakAdminLoadingState.LOADED;
  });

  return { isLoading, hasError, isLoaded };
}

/**
 * Creates state management functions for Keycloak Admin
 *
 * @param state - Reactive Keycloak Admin state reference
 * @returns State management functions
 */
function createStateFunctions(state: Ref<KeycloakAdminState>): {
  setLoading: () => void;
  setLoaded: () => void;
  setError: (type: KeycloakAdminErrorType, message: string, details?: string) => void;
  reset: () => void;
  incrementRetryCount: () => void;
} {
  /**
   * Sets the state to loading and clears any existing errors
   */
  function setLoading(): void {
    state.value.loadingState = KeycloakAdminLoadingState.LOADING;
    state.value.error = null;
  }

  /**
   * Sets the state to loaded successfully and clears any existing errors
   */
  function setLoaded(): void {
    state.value.loadingState = KeycloakAdminLoadingState.LOADED;
    state.value.error = null;
  }

  /**
   * Sets an error state with the provided error information
   *
   * @param type - The type of error that occurred
   * @param message - Human-readable error message
   * @param details - Optional technical details for debugging
   */
  function setError(type: KeycloakAdminErrorType, message: string, details?: string): void {
    const error: KeycloakAdminError = {
      type,
      message,
      timestamp: new Date(),
      details,
    };

    state.value.loadingState = KeycloakAdminLoadingState.ERROR;
    state.value.error = error;
  }

  /**
   * Resets the state to initial values
   */
  function reset(): void {
    state.value.loadingState = KeycloakAdminLoadingState.IDLE;
    state.value.error = null;
    state.value.retryCount = 0;
  }

  /**
   * Increments the retry count
   */
  function incrementRetryCount(): void {
    state.value.retryCount += 1;
  }

  return { setLoading, setLoaded, setError, reset, incrementRetryCount };
}

/**
 * Keycloak Admin composable
 * Manages state and operations for Keycloak Admin integration
 *
 * Follows the Single Responsibility Principle by focusing on Keycloak Admin state management
 * Separates business logic from UI components for better testability
 *
 * @param url - Optional Keycloak Admin URL override
 * @returns Keycloak Admin state and control functions
 *
 * @example
 * const { state, isLoading, setLoading, setLoaded, setError } = useKeycloakAdmin();
 *
 * // Set loading state
 * setLoading();
 *
 * // Set loaded state
 * setLoaded();
 *
 * // Set error state
 * setError(KeycloakAdminErrorType.NETWORK_ERROR, 'Failed to load Keycloak Admin');
 */
export function useKeycloakAdmin(url?: string): UseKeycloakAdminReturn {
  const state = ref<KeycloakAdminState>({
    loadingState: KeycloakAdminLoadingState.IDLE,
    error: null,
    url: url || config.keycloakAdminUrl,
    retryCount: 0,
  });

  const computedProperties = createComputedProperties(state);
  const stateFunctions = createStateFunctions(state);

  return {
    state,
    ...computedProperties,
    ...stateFunctions,
  };
}
