<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <div class="flex flex-col gap-4">
      <div class="flex gap-2 justify-center">
        <button
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          @click="handleIncrement"
        >
          Increment
        </button>
        <button
          class="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
          @click="handleDecrement"
        >
          Decrement
        </button>
      </div>
      <button
        class="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
        @click="handleReset"
      >
        Reset
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

/**
 * Counter controls component
 * Follows Single Responsibility Principle - only handles user interactions
 * Emits events for parent to handle, maintaining loose coupling
 */
export default defineComponent({
  name: 'CounterControls',

  emits: {
    /**
     * Emitted when increment button is clicked
     */
    increment: null,

    /**
     * Emitted when decrement button is clicked
     */
    decrement: null,

    /**
     * Emitted when reset button is clicked
     */
    reset: null,
  },

  /**
   *
   */
  setup(_props, { emit }) {
    /**
     * Handles increment button click
     */
    function handleIncrement(): void {
      emit('increment');
    }

    /**
     * Handles decrement button click
     */
    function handleDecrement(): void {
      emit('decrement');
    }

    /**
     * Handles reset button click
     */
    function handleReset(): void {
      emit('reset');
    }

    return {
      handleIncrement,
      handleDecrement,
      handleReset,
    };
  },
});
</script>
