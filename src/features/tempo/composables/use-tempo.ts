import { ref, computed, type Ref } from 'vue';

import { TempoLoadingState, TempoErrorType, type TempoState, type TempoError } from '../types/index';

import { config } from '@/core/config';

/**
 * Composable return type for useTempo
 */
export interface UseTempoReturn {
  state: Ref<TempoState>;
  isLoading: Ref<boolean>;
  hasError: Ref<boolean>;
  isLoaded: Ref<boolean>;
  setLoading: () => void;
  setLoaded: () => void;
  setError: (type: TempoErrorType, message: string, details?: string) => void;
  reset: () => void;
  incrementRetryCount: () => void;
}

/**
 * Creates computed properties for Tempo state
 *
 * @param state - Reactive Tempo state reference
 * @returns Computed properties for loading, error, and loaded states
 */
function createComputedProperties(state: Ref<TempoState>): {
  isLoading: Ref<boolean>;
  hasError: Ref<boolean>;
  isLoaded: Ref<boolean>;
} {
  const isLoading = computed((): boolean => {
    return state.value.loadingState === TempoLoadingState.LOADING;
  });

  const hasError = computed((): boolean => {
    return state.value.error !== null;
  });

  const isLoaded = computed((): boolean => {
    return state.value.loadingState === TempoLoadingState.LOADED;
  });

  return { isLoading, hasError, isLoaded };
}

/**
 * Creates state management functions for Tempo
 *
 * @param state - Reactive Tempo state reference
 * @returns State management functions
 */
function createStateFunctions(state: Ref<TempoState>): {
  setLoading: () => void;
  setLoaded: () => void;
  setError: (type: TempoErrorType, message: string, details?: string) => void;
  reset: () => void;
  incrementRetryCount: () => void;
} {
  /**
   * Sets the state to loading and clears any existing errors
   */
  function setLoading(): void {
    state.value.loadingState = TempoLoadingState.LOADING;
    state.value.error = null;
  }

  /**
   * Sets the state to loaded successfully and clears any existing errors
   */
  function setLoaded(): void {
    state.value.loadingState = TempoLoadingState.LOADED;
    state.value.error = null;
  }

  /**
   * Sets an error state with the provided error information
   *
   * @param type - The type of error that occurred
   * @param message - Human-readable error message
   * @param details - Optional technical details for debugging
   */
  function setError(type: TempoErrorType, message: string, details?: string): void {
    const error: TempoError = {
      type,
      message,
      timestamp: new Date(),
      details,
    };

    state.value.loadingState = TempoLoadingState.ERROR;
    state.value.error = error;
  }

  /**
   * Resets the state to initial values
   */
  function reset(): void {
    state.value.loadingState = TempoLoadingState.IDLE;
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
 * Tempo composable
 * Manages state and operations for Tempo integration
 *
 * Follows the Single Responsibility Principle by focusing on Tempo state management
 * Separates business logic from UI components for better testability
 *
 * @param url - Optional Tempo URL override
 * @returns Tempo state and control functions
 *
 * @example
 * const { state, isLoading, setLoading, setLoaded, setError } = useTempo();
 *
 * // Set loading state
 * setLoading();
 *
 * // Set loaded state
 * setLoaded();
 *
 * // Set error state
 * setError(TempoErrorType.NETWORK_ERROR, 'Failed to load Tempo');
 */
export function useTempo(url?: string): UseTempoReturn {
  const state = ref<TempoState>({
    loadingState: TempoLoadingState.IDLE,
    error: null,
    url: url || config.tempoUrl,
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
