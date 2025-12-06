import { computed, type ComputedRef } from 'vue';

import { useCounterStore } from '../stores/counter-store';

import type { CounterState } from '../types';

/**
 * Counter composable interface
 * Defines the contract for counter functionality
 */
export interface UseCounterReturn {
  count: ComputedRef<number>;
  doubleCount: ComputedRef<number>;
  isPositive: ComputedRef<boolean>;
  isNegative: ComputedRef<boolean>;
  history: ComputedRef<number[]>;
  historyLength: ComputedRef<number>;
  state: ComputedRef<CounterState>;
  increment: (amount?: number) => void;
  decrement: (amount?: number) => void;
  reset: () => void;
  setValue: (value: number) => void;
  clearHistory: () => void;
}

/**
 * Counter composable hook
 * Provides counter functionality following the Interface Segregation Principle
 * Exposes only what's needed for components to work with the counter
 *
 * @returns Counter state and methods
 * @example
 * const { count, increment, decrement } = useCounter();
 */
export function useCounter(): UseCounterReturn {
  const store = useCounterStore();

  return {
    // Computed state - read-only access
    count: computed(() => store.count),
    doubleCount: computed(() => store.doubleCount),
    isPositive: computed(() => store.isPositive),
    isNegative: computed(() => store.isNegative),
    history: computed(() => store.history),
    historyLength: computed(() => store.historyLength),
    state: computed(() => store.getState),

    // Methods
    increment: store.increment,
    decrement: store.decrement,
    reset: store.reset,
    setValue: store.setValue,
    clearHistory: store.clearHistory,
  };
}
