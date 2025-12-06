<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4" role="alert" aria-live="assertive">
    <div
      class="max-w-md w-full bg-red-50 border-2 border-red-200 rounded-lg p-8 shadow-lg"
      data-testid="error-container"
    >
      <!-- Error Icon -->
      <div class="flex justify-center mb-4" data-testid="error-icon">
        <div class="rounded-full bg-red-100 p-3">
          <svg
            class="w-12 h-12 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
      </div>

      <!-- Error Title -->
      <h2 class="text-xl font-bold text-gray-900 text-center mb-2">Loki Unavailable</h2>

      <!-- Error Message -->
      <p class="text-gray-700 text-center mb-4" data-testid="error-message">
        {{ error.message }}
      </p>

      <!-- Error Details (if available) -->
      <div v-if="error.details" class="mb-6" data-testid="error-details">
        <div class="bg-white border border-red-200 rounded p-3">
          <p class="text-sm text-gray-600 font-medium mb-1">Technical Details:</p>
          <p class="text-sm text-gray-500">{{ error.details }}</p>
        </div>
      </div>

      <!-- Retry Button -->
      <div class="flex justify-center">
        <button
          type="button"
          class="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
          aria-label="Retry loading Loki"
          @click="handleRetry"
        >
          <svg
            class="w-5 h-5 inline-block mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Retry
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';

import type { LokiError } from '../types/index';

/**
 * Loki error component
 * Displays user-friendly error messages when Loki fails to load
 *
 * Follows the Single Responsibility Principle by focusing solely on error display
 * Provides clear feedback and recovery mechanism through retry functionality
 */
export default defineComponent({
  name: 'LokiError',

  props: {
    /**
     * Error object containing error details
     */
    error: {
      type: Object as PropType<LokiError>,
      required: true,
    },
  },

  emits: ['retry'],

  setup(_props, { emit }) {
    /**
     * Handles retry button click
     * Emits retry event to parent component for retry logic
     */
    function handleRetry(): void {
      emit('retry');
    }

    return {
      handleRetry,
    };
  },
});
</script>
