import { ref, computed, type Ref } from 'vue';

import { PgAdminLoadingState, PgAdminErrorType, type PgAdminState, type PgAdminError } from '../types/index';

import { config } from '@/core/config';

/**
 * Composable return type for usePgAdmin
 */
export interface UsePgAdminReturn {
  state: Ref<PgAdminState>;
  isLoading: Ref<boolean>;
  hasError: Ref<boolean>;
  isLoaded: Ref<boolean>;
  setLoading: () => void;
  setLoaded: () => void;
  setError: (type: PgAdminErrorType, message: string, details?: string) => void;
  reset: () => void;
  incrementRetryCount: () => void;
}

/**
 * Creates computed properties for pgAdmin state
 *
 * @param state - Reactive pgAdmin state reference
 * @returns Computed properties for loading, error, and loaded states
 */
function createComputedProperties(state: Ref<PgAdminState>): {
  isLoading: Ref<boolean>;
  hasError: Ref<boolean>;
  isLoaded: Ref<boolean>;
} {
  const isLoading = computed((): boolean => {
    return state.value.loadingState === PgAdminLoadingState.LOADING;
  });

  const hasError = computed((): boolean => {
    return state.value.error !== null;
  });

  const isLoaded = computed((): boolean => {
    return state.value.loadingState === PgAdminLoadingState.LOADED;
  });

  return { isLoading, hasError, isLoaded };
}

/**
 * Creates state management functions for pgAdmin
 *
 * @param state - Reactive pgAdmin state reference
 * @returns State management functions
 */
function createStateFunctions(state: Ref<PgAdminState>): {
  setLoading: () => void;
  setLoaded: () => void;
  setError: (type: PgAdminErrorType, message: string, details?: string) => void;
  reset: () => void;
  incrementRetryCount: () => void;
} {
  /**
   * Sets the state to loading and clears any existing errors
   */
  function setLoading(): void {
    state.value.loadingState = PgAdminLoadingState.LOADING;
    state.value.error = null;
  }

  /**
   * Sets the state to loaded successfully and clears any existing errors
   */
  function setLoaded(): void {
    state.value.loadingState = PgAdminLoadingState.LOADED;
    state.value.error = null;
  }

  /**
   * Sets an error state with the provided error information
   *
   * @param type - The type of error that occurred
   * @param message - Human-readable error message
   * @param details - Optional technical details for debugging
   */
  function setError(type: PgAdminErrorType, message: string, details?: string): void {
    const error: PgAdminError = {
      type,
      message,
      timestamp: new Date(),
      details,
    };

    state.value.loadingState = PgAdminLoadingState.ERROR;
    state.value.error = error;
  }

  /**
   * Resets the state to initial values
   */
  function reset(): void {
    state.value.loadingState = PgAdminLoadingState.IDLE;
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
 * pgAdmin composable
 * Manages state and operations for pgAdmin integration
 *
 * Follows the Single Responsibility Principle by focusing on pgAdmin state management
 * Separates business logic from UI components for better testability
 *
 * @param url - Optional pgAdmin URL override
 * @returns pgAdmin state and control functions
 *
 * @example
 * const { state, isLoading, setLoading, setLoaded, setError } = usePgAdmin();
 *
 * // Set loading state
 * setLoading();
 *
 * // Set loaded state
 * setLoaded();
 *
 * // Set error state
 * setError(PgAdminErrorType.NETWORK_ERROR, 'Failed to load pgAdmin');
 */
export function usePgAdmin(url?: string): UsePgAdminReturn {
  const state = ref<PgAdminState>({
    loadingState: PgAdminLoadingState.IDLE,
    error: null,
    url: url || config.pgAdminUrl,
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
