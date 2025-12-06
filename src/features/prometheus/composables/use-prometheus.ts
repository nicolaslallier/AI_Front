import { ref, computed, type Ref } from 'vue';

import {
  PrometheusLoadingState,
  PrometheusErrorType,
  type PrometheusState,
  type PrometheusError,
} from '../types/index';

import { config } from '@/core/config';

/**
 * Composable return type for usePrometheus
 */
export interface UsePrometheusReturn {
  state: Ref<PrometheusState>;
  isLoading: Ref<boolean>;
  hasError: Ref<boolean>;
  isLoaded: Ref<boolean>;
  setLoading: () => void;
  setLoaded: () => void;
  setError: (type: PrometheusErrorType, message: string, details?: string) => void;
  reset: () => void;
  incrementRetryCount: () => void;
}

/**
 * Creates computed properties for Prometheus state
 *
 * @param state - Reactive Prometheus state reference
 * @returns Computed properties for loading, error, and loaded states
 */
function createComputedProperties(state: Ref<PrometheusState>): {
  isLoading: Ref<boolean>;
  hasError: Ref<boolean>;
  isLoaded: Ref<boolean>;
} {
  const isLoading = computed((): boolean => {
    return state.value.loadingState === PrometheusLoadingState.LOADING;
  });

  const hasError = computed((): boolean => {
    return state.value.error !== null;
  });

  const isLoaded = computed((): boolean => {
    return state.value.loadingState === PrometheusLoadingState.LOADED;
  });

  return { isLoading, hasError, isLoaded };
}

/**
 * Creates state management functions for Prometheus
 *
 * @param state - Reactive Prometheus state reference
 * @returns State management functions
 */
function createStateFunctions(state: Ref<PrometheusState>): {
  setLoading: () => void;
  setLoaded: () => void;
  setError: (type: PrometheusErrorType, message: string, details?: string) => void;
  reset: () => void;
  incrementRetryCount: () => void;
} {
  /**
   * Sets the state to loading and clears any existing errors
   */
  function setLoading(): void {
    state.value.loadingState = PrometheusLoadingState.LOADING;
    state.value.error = null;
  }

  /**
   * Sets the state to loaded successfully and clears any existing errors
   */
  function setLoaded(): void {
    state.value.loadingState = PrometheusLoadingState.LOADED;
    state.value.error = null;
  }

  /**
   * Sets an error state with the provided error information
   *
   * @param type - The type of error that occurred
   * @param message - Human-readable error message
   * @param details - Optional technical details for debugging
   */
  function setError(type: PrometheusErrorType, message: string, details?: string): void {
    const error: PrometheusError = {
      type,
      message,
      timestamp: new Date(),
      details,
    };

    state.value.loadingState = PrometheusLoadingState.ERROR;
    state.value.error = error;
  }

  /**
   * Resets the state to initial values
   */
  function reset(): void {
    state.value.loadingState = PrometheusLoadingState.IDLE;
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
 * Prometheus composable
 * Manages state and operations for Prometheus integration
 *
 * Follows the Single Responsibility Principle by focusing on Prometheus state management
 * Separates business logic from UI components for better testability
 *
 * @param url - Optional Prometheus URL override
 * @returns Prometheus state and control functions
 *
 * @example
 * const { state, isLoading, setLoading, setLoaded, setError } = usePrometheus();
 *
 * // Set loading state
 * setLoading();
 *
 * // Set loaded state
 * setLoaded();
 *
 * // Set error state
 * setError(PrometheusErrorType.NETWORK_ERROR, 'Failed to load Prometheus');
 */
export function usePrometheus(url?: string): UsePrometheusReturn {
  const state = ref<PrometheusState>({
    loadingState: PrometheusLoadingState.IDLE,
    error: null,
    url: url || config.prometheusUrl,
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
