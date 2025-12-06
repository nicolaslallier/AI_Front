import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, beforeEach } from 'vitest';

import { useCounterStore } from './counter-store';

describe('counter-store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('initial state', () => {
    it('should have count initialized to 0', () => {
      const store = useCounterStore();
      expect(store.count).toBe(0);
    });

    it('should have history with initial value', () => {
      const store = useCounterStore();
      expect(store.history).toEqual([0]);
    });
  });

  describe('getters', () => {
    it('should calculate doubleCount correctly', () => {
      const store = useCounterStore();
      store.setValue(5);
      expect(store.doubleCount).toBe(10);
    });

    it('should determine isPositive correctly', () => {
      const store = useCounterStore();
      expect(store.isPositive).toBe(false);
      store.increment();
      expect(store.isPositive).toBe(true);
    });

    it('should determine isNegative correctly', () => {
      const store = useCounterStore();
      expect(store.isNegative).toBe(false);
      store.decrement();
      expect(store.isNegative).toBe(true);
    });

    it('should track historyLength correctly', () => {
      const store = useCounterStore();
      expect(store.historyLength).toBe(1);
      store.increment();
      expect(store.historyLength).toBe(2);
    });
  });

  describe('increment', () => {
    it('should increment count by 1 when called without arguments', () => {
      const store = useCounterStore();
      store.increment();
      expect(store.count).toBe(1);
    });

    it('should increment count by specified amount', () => {
      const store = useCounterStore();
      store.increment(5);
      expect(store.count).toBe(5);
    });

    it('should add new value to history', () => {
      const store = useCounterStore();
      store.increment();
      expect(store.history).toContain(1);
    });

    it('should throw error when incrementing beyond maximum', () => {
      const store = useCounterStore();
      store.setValue(999);
      expect(() => store.increment(2)).toThrow(RangeError);
    });
  });

  describe('decrement', () => {
    it('should decrement count by 1 when called without arguments', () => {
      const store = useCounterStore();
      store.decrement();
      expect(store.count).toBe(-1);
    });

    it('should decrement count by specified amount', () => {
      const store = useCounterStore();
      store.decrement(5);
      expect(store.count).toBe(-5);
    });

    it('should add new value to history', () => {
      const store = useCounterStore();
      store.decrement();
      expect(store.history).toContain(-1);
    });

    it('should throw error when decrementing below minimum', () => {
      const store = useCounterStore();
      store.setValue(-999);
      expect(() => store.decrement(2)).toThrow(RangeError);
    });
  });

  describe('reset', () => {
    it('should reset count to 0', () => {
      const store = useCounterStore();
      store.increment(10);
      store.reset();
      expect(store.count).toBe(0);
    });

    it('should reset history to initial state', () => {
      const store = useCounterStore();
      store.increment(5);
      store.increment(3);
      store.reset();
      expect(store.history).toEqual([0]);
    });
  });

  describe('setValue', () => {
    it('should set count to specified value', () => {
      const store = useCounterStore();
      store.setValue(42);
      expect(store.count).toBe(42);
    });

    it('should add new value to history', () => {
      const store = useCounterStore();
      store.setValue(42);
      expect(store.history).toContain(42);
    });

    it('should throw error for invalid values', () => {
      const store = useCounterStore();
      expect(() => store.setValue(1001)).toThrow(RangeError);
      expect(() => store.setValue(-1001)).toThrow(RangeError);
    });
  });

  describe('clearHistory', () => {
    it('should clear history but keep current count', () => {
      const store = useCounterStore();
      store.increment(5);
      store.increment(3);
      const currentCount = store.count;
      store.clearHistory();
      expect(store.count).toBe(currentCount);
      expect(store.history).toEqual([currentCount]);
    });
  });

  describe('getState', () => {
    it('should return current state snapshot', () => {
      const store = useCounterStore();
      store.increment(5);
      const state = store.getState;
      expect(state.count).toBe(5);
      expect(state.history).toEqual([0, 5]);
    });

    it('should return a copy of history array', () => {
      const store = useCounterStore();
      const state1 = store.getState;
      store.increment();
      const state2 = store.getState;
      expect(state1.history).not.toBe(state2.history);
    });
  });
});
