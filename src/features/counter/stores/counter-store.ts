import { Logger } from '@shared/utils/logger';
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

import { validateCounterValue } from '../utils/counter-validator';

import type { CounterState } from '../types';

/**
 * Counter store using Pinia with Composition API
 *
 * Follows Single Responsibility Principle - manages counter state only
 *
 * @returns Counter store instance
 */
// eslint-disable-next-line max-lines-per-function
export const useCounterStore = defineStore('counter', () => {
  // State
  /**
   *
   */
  const count = ref<number>(0);
  /**
   *
   */
  const history = ref<number[]>([0]);

  // Getters
  /**
   *
   */
  const doubleCount = computed<number>(() => count.value * 2);
  /**
   *
   */
  const isPositive = computed<boolean>(() => count.value > 0);
  /**
   *
   */
  const isNegative = computed<boolean>(() => count.value < 0);
  /**
   *
   */
  const historyLength = computed<number>(() => history.value.length);

  /**
   * Gets the current counter state
   *
   * @returns Current state object
   */
  const getState = computed<CounterState>(() => ({
    count: count.value,
    history: [...history.value],
  }));

  /**
   * Increments the counter by specified amount
   *
   * @param amount - Amount to increment (default: 1)
   * @throws {RangeError} When resulting value would be out of range
   */
  function increment(amount = 1): void {
    try {
      /**
       *
       */
      const newValue = count.value + amount;
      validateCounterValue(newValue);
      count.value = newValue;
      history.value.push(newValue);
      Logger.debug('Counter incremented', { amount, newValue });
    } catch (error) {
      Logger.error('Failed to increment counter', error);
      throw error;
    }
  }

  /**
   * Decrements the counter by specified amount
   *
   * @param amount - Amount to decrement (default: 1)
   * @throws {RangeError} When resulting value would be out of range
   */
  function decrement(amount = 1): void {
    try {
      /**
       *
       */
      const newValue = count.value - amount;
      validateCounterValue(newValue);
      count.value = newValue;
      history.value.push(newValue);
      Logger.debug('Counter decremented', { amount, newValue });
    } catch (error) {
      Logger.error('Failed to decrement counter', error);
      throw error;
    }
  }

  /**
   * Resets the counter to zero
   */
  function reset(): void {
    count.value = 0;
    history.value = [0];
    Logger.debug('Counter reset');
  }

  /**
   * Sets the counter to a specific value
   *
   * @param value - The value to set
   * @throws {RangeError} When value is out of range
   */
  function setValue(value: number): void {
    try {
      validateCounterValue(value);
      count.value = value;
      history.value.push(value);
      Logger.debug('Counter value set', { value });
    } catch (error) {
      Logger.error('Failed to set counter value', error);
      throw error;
    }
  }

  /**
   * Clears the history while keeping current count
   */
  function clearHistory(): void {
    history.value = [count.value];
    Logger.debug('Counter history cleared');
  }

  return {
    // State
    count,
    history,
    // Getters
    doubleCount,
    isPositive,
    isNegative,
    historyLength,
    getState,
    // Actions
    increment,
    decrement,
    reset,
    setValue,
    clearHistory,
  };
});
