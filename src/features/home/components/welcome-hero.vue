<template>
  <section class="bg-gradient-to-br from-indigo-50 to-blue-100 py-16 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto text-center">
      <h1 class="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
        {{ title }}
      </h1>
      <p class="text-lg sm:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
        {{ description }}
      </p>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

/**
 * Welcome hero component
 *
 * Displays a prominent welcome message with title and description.
 * Implements FR-HOME-002, FR-HOME-003, FR-HOME-004 from the functional analysis.
 *
 * Design principles:
 * - Large, readable typography for accessibility (NFR-HOME-003)
 * - Responsive design with mobile-first approach (NFR-HOME-002)
 * - Simple, friendly language (FR-HOME-004)
 * - Clean, professional layout (BR-HOME-002)
 */
export default defineComponent({
  name: 'WelcomeHero',

  props: {
    /**
     * Main welcome title
     * @default 'Welcome to Monitoring and Administration Portal'
     */
    title: {
      type: String,
      default: 'Welcome to Monitoring and Administration Portal',
    },

    /**
     * Descriptive text explaining the portal's purpose
     * Should be 2-4 lines of simple, friendly text (FR-HOME-007, FR-HOME-004)
     * @default Portal description
     */
    description: {
      type: String,
      default:
        'This portal provides centralized access to monitor your infrastructure, manage system resources, and administer critical services. Access powerful dashboards, view logs and traces, manage databases, and configure identity and access management—all from one convenient location.',
    },
  },

  setup() {
    return {};
  },
});
</script>
