<template>
  <div class="relative w-full h-full min-h-screen">
    <!-- Loading Overlay -->
    <div
      v-if="isLoading"
      class="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10"
      data-testid="loading-spinner"
      role="status"
      aria-live="polite"
    >
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p class="mt-4 text-gray-600 font-medium">Loading Grafana...</p>
      </div>
    </div>

    <!-- Grafana Iframe -->
    <iframe
      :src="url"
      class="w-full h-full border-0"
      title="Grafana Dashboard"
      allowfullscreen
      sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
      @load="handleLoad"
      @error="handleError"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

/**
 * Grafana iframe component
 * Renders Grafana in an isolated iframe with loading state management
 *
 * Follows the Single Responsibility Principle by focusing on iframe rendering and event handling
 * Emits events to parent for state management (Dependency Inversion)
 */
export default defineComponent({
  name: 'GrafanaIframe',

  props: {
    /**
     * URL of the Grafana instance to load
     */
    url: {
      type: String,
      required: true,
    },

    /**
     * Whether Grafana is currently loading
     */
    isLoading: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['load', 'error'],

  setup(_props, { emit }) {
    /**
     * Handles iframe load event
     * Emits load event to parent component
     */
    function handleLoad(): void {
      emit('load');
    }

    /**
     * Handles iframe error event
     * Emits error event to parent component
     */
    function handleError(): void {
      emit('error');
    }

    return {
      handleLoad,
      handleError,
    };
  },
});
</script>
