<template>
  <div id="app" class="min-h-screen">
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

/**
 * Root application component
 * Provides the main router view for the SPA
 */
export default defineComponent({
  name: 'App',
});
</script>
