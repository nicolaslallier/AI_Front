<template>
  <router-link
    :to="path"
    class="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-200 hover:border-indigo-500"
  >
    <div class="flex flex-col items-center text-center space-y-4">
      <div class="text-5xl" role="img" :aria-label="`${title} icon`">
        {{ icon }}
      </div>
      <h3 class="text-xl font-semibold text-gray-900">
        {{ title }}
      </h3>
      <p class="text-gray-600 text-sm leading-relaxed">
        {{ description }}
      </p>
    </div>
  </router-link>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

/**
 * Quick access card component
 *
 * Displays a clickable card that navigates to a console or section.
 * Implements FR-HOME-006 (quick-access buttons for common actions).
 *
 * Design principles:
 * - Clean, card-based layout (BR-HOME-002)
 * - Clear visual hierarchy with icon, title, description
 * - Hover effects for interactivity
 * - Accessible with proper ARIA labels
 * - Responsive design
 *
 * @emits navigate - Emitted when card is clicked (via router-link)
 */
export default defineComponent({
  name: 'QuickAccessCard',

  props: {
    /**
     * Card title (console name)
     * @example 'Grafana', 'pgAdmin'
     */
    title: {
      type: String,
      required: true,
    },

    /**
     * Brief description of the console's purpose (1 line)
     * @example 'Dashboards and Visualizations'
     */
    description: {
      type: String,
      required: true,
    },

    /**
     * Router path to navigate to when clicked
     * @example '/grafana', '/pgadmin'
     */
    path: {
      type: String,
      required: true,
    },

    /**
     * Icon representation (emoji or class name)
     * @example '📊', '🗄️'
     */
    icon: {
      type: String,
      required: true,
    },
  },

  setup() {
    return {};
  },
});
</script>
