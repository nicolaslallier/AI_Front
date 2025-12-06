import { ref, computed, type Ref } from 'vue';

import { GrafanaLoadingState, GrafanaErrorType, type GrafanaState, type GrafanaError } from '../types/index';

import { config } from '@/core/config';

/**
 * Composable return type for useGrafana
 */
export interface UseGrafanaReturn {
  state: Ref<GrafanaState>;
  isLoading: Ref<boolean>;
  hasError: Ref<boolean>;
  isLoaded: Ref<boolean>;
  setLoading: () => void;
  setLoaded: () => void;
  setError: (type: GrafanaErrorType, message: string, details?: string) => void;
  reset: () => void;
  incrementRetryCount: () => void;
}

/**
 * Creates computed properties for Grafana state
 *
 * @param state - Reactive Grafana state reference
 * @returns Computed properties for loading, error, and loaded states
 */
function createComputedProperties(state: Ref<GrafanaState>): {
  isLoading: Ref<boolean>;
  hasError: Ref<boolean>;
  isLoaded: Ref<boolean>;
} {
  const isLoading = computed((): boolean => {
    return state.value.loadingState === GrafanaLoadingState.LOADING;
  });

  const hasError = computed((): boolean => {
    return state.value.error !== null;
  });

  const isLoaded = computed((): boolean => {
    return state.value.loadingState === GrafanaLoadingState.LOADED;
  });

  return { isLoading, hasError, isLoaded };
}

/**
 * Creates state management functions for Grafana
 *
 * @param state - Reactive Grafana state reference
 * @returns State management functions
 */
function createStateFunctions(state: Ref<GrafanaState>): {
  setLoading: () => void;
  setLoaded: () => void;
  setError: (type: GrafanaErrorType, message: string, details?: string) => void;
  reset: () => void;
  incrementRetryCount: () => void;
} {
  /**
   * Sets the state to loading and clears any existing errors
   */
  function setLoading(): void {
    state.value.loadingState = GrafanaLoadingState.LOADING;
    state.value.error = null;
  }

  /**
   * Sets the state to loaded successfully and clears any existing errors
   */
  function setLoaded(): void {
    state.value.loadingState = GrafanaLoadingState.LOADED;
    state.value.error = null;
  }

  /**
   * Sets an error state with the provided error information
   *
   * @param type - The type of error that occurred
   * @param message - Human-readable error message
   * @param details - Optional technical details for debugging
   */
  function setError(type: GrafanaErrorType, message: string, details?: string): void {
    const error: GrafanaError = {
      type,
      message,
      timestamp: new Date(),
      details,
    };

    state.value.loadingState = GrafanaLoadingState.ERROR;
    state.value.error = error;
  }

  /**
   * Resets the state to initial values
   */
  function reset(): void {
    state.value.loadingState = GrafanaLoadingState.IDLE;
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
 * Grafana composable
 * Manages state and operations for Grafana integration
 *
 * Follows the Single Responsibility Principle by focusing on Grafana state management
 * Separates business logic from UI components for better testability
 *
 * @param url - Optional Grafana URL override
 * @returns Grafana state and control functions
 *
 * @example
 * const { state, isLoading, setLoading, setLoaded, setError } = useGrafana();
 *
 * // Set loading state
 * setLoading();
 *
 * // Set loaded state
 * setLoaded();
 *
 * // Set error state
 * setError(GrafanaErrorType.NETWORK_ERROR, 'Failed to load Grafana');
 */
export function useGrafana(url?: string): UseGrafanaReturn {
  const state = ref<GrafanaState>({
    loadingState: GrafanaLoadingState.IDLE,
    error: null,
    url: url || config.grafanaUrl,
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
