<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold text-center text-gray-800 mb-8">Counter Application</h1>
      <div class="space-y-6">
        <counter-display
          :count="count"
          :double-count="doubleCount"
          :is-positive="isPositive"
          :is-negative="isNegative"
        />
        <counter-controls @increment="increment" @decrement="decrement" @reset="reset" />
        <counter-history :history="history" @clear-history="clearHistory" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import CounterControls from '../components/counter-controls.vue';
import CounterDisplay from '../components/counter-display.vue';
import CounterHistory from '../components/counter-history.vue';
import { useCounter } from '../composables/use-counter';

/**
 * Home view component
 * Container component that orchestrates counter feature components
 * Follows the Dependency Inversion Principle by depending on composable abstraction
 */
export default defineComponent({
  name: 'HomeView',

  components: {
    CounterDisplay,
    CounterControls,
    CounterHistory,
  },

  setup() {
    const { count, doubleCount, isPositive, isNegative, history, increment, decrement, reset, clearHistory } =
      useCounter();

    return {
      count,
      doubleCount,
      isPositive,
      isNegative,
      history,
      increment,
      decrement,
      reset,
      clearHistory,
    };
  },
});
</script>
