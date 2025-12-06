/**
 * Validates if a counter value is within acceptable range
 * Following Single Responsibility Principle - focused on validation only
 *
 * @param value - The counter value to validate
 * @param min - Minimum allowed value (default: -1000)
 * @param max - Maximum allowed value (default: 1000)
 * @returns True if valid, false otherwise
 * @throws {RangeError} When value is outside the specified range
 */
export function validateCounterValue(value: number, min = -1000, max = 1000): boolean {
  if (value < min || value > max) {
    throw new RangeError(`Counter value must be between ${min} and ${max}, got ${value}`);
  }
  return true;
}

/**
 * Validates if a step value is acceptable
 *
 * @param step - The step value to validate
 * @returns True if valid, false otherwise
 * @throws {RangeError} When step is zero or exceeds limits
 */
export function validateStepValue(step: number): boolean {
  if (step === 0) {
    throw new RangeError('Step value cannot be zero');
  }
  if (Math.abs(step) > 100) {
    throw new RangeError('Step value cannot exceed ±100');
  }
  return true;
}
