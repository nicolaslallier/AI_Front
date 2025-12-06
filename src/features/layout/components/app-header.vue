<template>
  <header class="bg-indigo-600 text-white shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <h1 class="text-2xl font-bold">{{ title }}</h1>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

/**
 * Application header component
 * Displays the application title/logo in a consistent header bar
 * Follows the Single Responsibility Principle by focusing solely on header presentation
 */
export default defineComponent({
  name: 'AppHeader',

  props: {
    /**
     * Application title to display in the header
     * @default 'AI Front'
     */
    title: {
      type: String,
      default: 'AI Front',
    },
  },

  setup() {
    return {};
  },
});
</script>
