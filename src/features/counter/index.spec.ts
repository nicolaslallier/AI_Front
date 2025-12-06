import { describe, it, expect } from 'vitest';

import { useCounter, useCounterStore, validateCounterValue, validateStepValue, type CounterState } from './index';

describe('Counter Module Exports', () => {
  describe('exports', () => {
    it('should export useCounter composable', () => {
      expect(useCounter).toBeDefined();
      expect(typeof useCounter).toBe('function');
    });

    it('should export useCounterStore', () => {
      expect(useCounterStore).toBeDefined();
      expect(typeof useCounterStore).toBe('function');
    });

    it('should export validateCounterValue', () => {
      expect(validateCounterValue).toBeDefined();
      expect(typeof validateCounterValue).toBe('function');
    });

    it('should export validateStepValue', () => {
      expect(validateStepValue).toBeDefined();
      expect(typeof validateStepValue).toBe('function');
    });
  });

  describe('type exports', () => {
    it('should allow CounterState type usage', () => {
      const state: CounterState = {
        count: 0,
        history: [],
      };

      expect(state.count).toBe(0);
      expect(state.history).toEqual([]);
    });
  });

  describe('validation functions', () => {
    it('should validate counter values correctly', () => {
      expect(() => validateCounterValue(100)).not.toThrow();
      expect(() => validateCounterValue(0)).not.toThrow();
    });

    it('should validate step values correctly', () => {
      expect(() => validateStepValue(1)).not.toThrow();
      expect(() => validateStepValue(5)).not.toThrow();
    });
  });
});
