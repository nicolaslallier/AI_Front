import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, beforeEach } from 'vitest';

import { useCounter } from './use-counter';

describe('use-counter', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should provide counter state', () => {
    const { count, isPositive, isNegative } = useCounter();
    expect(count.value).toBe(0);
    expect(isPositive.value).toBe(false);
    expect(isNegative.value).toBe(false);
  });

  it('should provide increment functionality', () => {
    const { count, increment } = useCounter();
    increment();
    expect(count.value).toBe(1);
  });

  it('should provide decrement functionality', () => {
    const { count, decrement } = useCounter();
    decrement();
    expect(count.value).toBe(-1);
  });

  it('should provide reset functionality', () => {
    const { count, increment, reset } = useCounter();
    increment(10);
    reset();
    expect(count.value).toBe(0);
  });

  it('should provide setValue functionality', () => {
    const { count, setValue } = useCounter();
    setValue(42);
    expect(count.value).toBe(42);
  });

  it('should provide computed properties', () => {
    const { doubleCount, setValue } = useCounter();
    setValue(5);
    expect(doubleCount.value).toBe(10);
  });

  it('should provide history tracking', () => {
    const { history, increment, historyLength } = useCounter();
    expect(historyLength.value).toBe(1);
    increment();
    expect(historyLength.value).toBe(2);
    expect(history.value).toContain(1);
  });

  it('should provide state snapshot', () => {
    const { state, increment } = useCounter();
    increment(5);
    expect(state.value.count).toBe(5);
    expect(state.value.history).toContain(5);
  });
});
