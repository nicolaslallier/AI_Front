import { describe, it, expect } from 'vitest';

import type { CounterState } from './index';

describe('Counter Types', () => {
  describe('CounterState', () => {
    it('should allow valid counter state structure', () => {
      const state: CounterState = {
        count: 0,
        history: [],
      };

      expect(state.count).toBe(0);
      expect(state.history).toEqual([]);
    });

    it('should allow positive count values', () => {
      const state: CounterState = {
        count: 42,
        history: [1, 2, 3],
      };

      expect(state.count).toBe(42);
      expect(state.history).toHaveLength(3);
    });

    it('should allow negative count values', () => {
      const state: CounterState = {
        count: -10,
        history: [-1, -2, -3],
      };

      expect(state.count).toBe(-10);
      expect(state.history[0]).toBe(-1);
    });

    it('should allow history with multiple entries', () => {
      const state: CounterState = {
        count: 100,
        history: [0, 50, 75, 100],
      };

      expect(state.history).toHaveLength(4);
      expect(state.history[state.history.length - 1]).toBe(100);
    });

    it('should allow empty history', () => {
      const state: CounterState = {
        count: 5,
        history: [],
      };

      expect(state.history).toHaveLength(0);
    });
  });
});
