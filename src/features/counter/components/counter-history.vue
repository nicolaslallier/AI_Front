<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-xl font-bold text-gray-800">History ({{ history.length }} entries)</h3>
      <button
        class="px-4 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        @click="handleClearHistory"
      >
        Clear History
      </button>
    </div>
    <div class="max-h-48 overflow-y-auto">
      <div v-if="history.length === 0" class="text-gray-500 text-center py-4">No history available</div>
      <div v-else class="space-y-2">
        <div
          v-for="(value, index) in history"
          :key="index"
          class="flex justify-between items-center p-2 bg-gray-50 rounded"
        >
          <span class="text-sm text-gray-600">Entry {{ index + 1 }}</span>
          <span class="font-semibold text-gray-800">{{ value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';

/**
 * Counter history component
 * Follows Single Responsibility Principle - only displays history
 * Receives data as props, emits events for actions
 */
export default defineComponent({
  name: 'CounterHistory',

  props: {
    /**
     * Array of counter history values
     */
    history: {
      type: Array as PropType<number[]>,
      required: true,
    },
  },

  emits: {
    /**
     * Emitted when clear history button is clicked
     */
    clearHistory: null,
  },

  /**
   *
   */
  setup(_props, { emit }) {
    /**
     * Handles clear history button click
     */
    function handleClearHistory(): void {
      emit('clearHistory');
    }

    return {
      handleClearHistory,
    };
  },
});
</script>
