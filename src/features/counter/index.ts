/**
 * Counter feature module exports
 * Central export point following the Open/Closed Principle
 */

export { useCounter } from './composables/use-counter';
export { useCounterStore } from './stores/counter-store';
export { validateCounterValue, validateStepValue } from './utils/counter-validator';
export type { CounterState } from './types';
