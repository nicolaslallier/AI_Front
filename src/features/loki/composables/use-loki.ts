import { ref, computed, type Ref } from 'vue';

import { LokiLoadingState, LokiErrorType, type LokiState, type LokiError } from '../types/index';

import { config } from '@/core/config';

/**
 * Composable return type for useLoki
 */
export interface UseLokiReturn {
  state: Ref<LokiState>;
  isLoading: Ref<boolean>;
  hasError: Ref<boolean>;
  isLoaded: Ref<boolean>;
  setLoading: () => void;
  setLoaded: () => void;
  setError: (type: LokiErrorType, message: string, details?: string) => void;
  reset: () => void;
  incrementRetryCount: () => void;
}

/**
 * Creates computed properties for Loki state
 *
 * @param state - Reactive Loki state reference
 * @returns Computed properties for loading, error, and loaded states
 */
function createComputedProperties(state: Ref<LokiState>): {
  isLoading: Ref<boolean>;
  hasError: Ref<boolean>;
  isLoaded: Ref<boolean>;
} {
  const isLoading = computed((): boolean => {
    return state.value.loadingState === LokiLoadingState.LOADING;
  });

  const hasError = computed((): boolean => {
    return state.value.error !== null;
  });

  const isLoaded = computed((): boolean => {
    return state.value.loadingState === LokiLoadingState.LOADED;
  });

  return { isLoading, hasError, isLoaded };
}

/**
 * Creates state management functions for Loki
 *
 * @param state - Reactive Loki state reference
 * @returns State management functions
 */
function createStateFunctions(state: Ref<LokiState>): {
  setLoading: () => void;
  setLoaded: () => void;
  setError: (type: LokiErrorType, message: string, details?: string) => void;
  reset: () => void;
  incrementRetryCount: () => void;
} {
  /**
   * Sets the state to loading and clears any existing errors
   */
  function setLoading(): void {
    state.value.loadingState = LokiLoadingState.LOADING;
    state.value.error = null;
  }

  /**
   * Sets the state to loaded successfully and clears any existing errors
   */
  function setLoaded(): void {
    state.value.loadingState = LokiLoadingState.LOADED;
    state.value.error = null;
  }

  /**
   * Sets an error state with the provided error information
   *
   * @param type - The type of error that occurred
   * @param message - Human-readable error message
   * @param details - Optional technical details for debugging
   */
  function setError(type: LokiErrorType, message: string, details?: string): void {
    const error: LokiError = {
      type,
      message,
      timestamp: new Date(),
      details,
    };

    state.value.loadingState = LokiLoadingState.ERROR;
    state.value.error = error;
  }

  /**
   * Resets the state to initial values
   */
  function reset(): void {
    state.value.loadingState = LokiLoadingState.IDLE;
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
 * Loki composable
 * Manages state and operations for Loki integration
 *
 * Follows the Single Responsibility Principle by focusing on Loki state management
 * Separates business logic from UI components for better testability
 *
 * @param url - Optional Loki URL override
 * @returns Loki state and control functions
 *
 * @example
 * const { state, isLoading, setLoading, setLoaded, setError } = useLoki();
 *
 * // Set loading state
 * setLoading();
 *
 * // Set loaded state
 * setLoaded();
 *
 * // Set error state
 * setError(LokiErrorType.NETWORK_ERROR, 'Failed to load Loki');
 */
export function useLoki(url?: string): UseLokiReturn {
  const state = ref<LokiState>({
    loadingState: LokiLoadingState.IDLE,
    error: null,
    url: url || config.lokiUrl,
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
