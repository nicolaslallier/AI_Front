import { describe, it, expect } from 'vitest';

import { validateCounterValue, validateStepValue } from './counter-validator';

describe('counter-validator', () => {
  describe('validateCounterValue', () => {
    it('should return true for valid values within default range', () => {
      expect(validateCounterValue(0)).toBe(true);
      expect(validateCounterValue(500)).toBe(true);
      expect(validateCounterValue(-500)).toBe(true);
    });

    it('should return true for values at the boundaries', () => {
      expect(validateCounterValue(1000)).toBe(true);
      expect(validateCounterValue(-1000)).toBe(true);
    });

    it('should throw RangeError when value exceeds maximum', () => {
      expect(() => validateCounterValue(1001)).toThrow(RangeError);
      expect(() => validateCounterValue(1001)).toThrow('Counter value must be between -1000 and 1000');
    });

    it('should throw RangeError when value is below minimum', () => {
      expect(() => validateCounterValue(-1001)).toThrow(RangeError);
    });

    it('should respect custom min and max values', () => {
      expect(validateCounterValue(50, 0, 100)).toBe(true);
      expect(() => validateCounterValue(101, 0, 100)).toThrow(RangeError);
    });
  });

  describe('validateStepValue', () => {
    it('should return true for valid positive steps', () => {
      expect(validateStepValue(1)).toBe(true);
      expect(validateStepValue(10)).toBe(true);
      expect(validateStepValue(100)).toBe(true);
    });

    it('should return true for valid negative steps', () => {
      expect(validateStepValue(-1)).toBe(true);
      expect(validateStepValue(-10)).toBe(true);
      expect(validateStepValue(-100)).toBe(true);
    });

    it('should throw RangeError when step is zero', () => {
      expect(() => validateStepValue(0)).toThrow(RangeError);
      expect(() => validateStepValue(0)).toThrow('Step value cannot be zero');
    });

    it('should throw RangeError when step exceeds limits', () => {
      expect(() => validateStepValue(101)).toThrow(RangeError);
      expect(() => validateStepValue(-101)).toThrow(RangeError);
      expect(() => validateStepValue(101)).toThrow('Step value cannot exceed ±100');
    });
  });
});
