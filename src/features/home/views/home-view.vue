<template>
  <div class="min-h-screen bg-gray-50">
    <welcome-hero />
    <quick-access-grid :items="quickAccessItems" />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

import QuickAccessGrid from '../components/quick-access-grid.vue';
import WelcomeHero from '../components/welcome-hero.vue';

import type { QuickAccessItem } from '../types';

/**
 * Home view component
 *
 * Main welcome/landing page that composes the hero section and quick-access cards.
 * Implements the complete home page functionality as specified in Front_2.1.0.html.
 *
 * Business Requirements:
 * - BR-HOME-001: Display clear welcome message
 * - BR-HOME-002: Professional and simple first impression
 * - BR-HOME-003: Access to main sections
 *
 * Functional Requirements:
 * - FR-HOME-001: Global structure with header (via shell), main content, footer (optional)
 * - FR-HOME-002: Welcome section with title and description
 * - FR-HOME-006: Quick-access buttons for common actions
 *
 * Non-Functional Requirements:
 * - NFR-HOME-001: Fast load time (static content, no API calls)
 * - NFR-HOME-002: Responsive layout
 * - NFR-HOME-003: Accessible with semantic HTML
 */
export default defineComponent({
  name: 'HomeView',

  components: {
    WelcomeHero,
    QuickAccessGrid,
  },

  setup() {
    /**
     * Quick-access items configuration
     *
     * Defines all available console/section cards with their metadata.
     * Items are automatically filtered by role in QuickAccessGrid component.
     *
     * Each item includes:
     * - id: Unique identifier
     * - title: Display name
     * - description: Brief explanation (1 line)
     * - path: Router path
     * - icon: Emoji representation
     * - requiredRoles: Roles needed to view (optional)
     *
     * @returns Array of quick-access items
     */
    const quickAccessItems = computed((): QuickAccessItem[] => {
      return [
        // Observability & Monitoring
        {
          id: 'grafana',
          title: 'Grafana',
          description: 'Interactive dashboards and data visualizations',
          path: '/grafana',
          icon: '📊',
          requiredRoles: ['ROLE_DEVOPS', 'ROLE_SECOPS', 'ROLE_OBS_VIEWER'],
        },
        {
          id: 'loki',
          title: 'Logs (Loki)',
          description: 'Centralized log aggregation and querying',
          path: '/logs',
          icon: '📝',
          requiredRoles: ['ROLE_DEVOPS', 'ROLE_SECOPS', 'ROLE_OBS_VIEWER'],
        },
        {
          id: 'tempo',
          title: 'Traces (Tempo)',
          description: 'Distributed tracing and performance analysis',
          path: '/traces',
          icon: '🔍',
          requiredRoles: ['ROLE_DEVOPS', 'ROLE_SECOPS', 'ROLE_OBS_VIEWER'],
        },
        {
          id: 'prometheus',
          title: 'Metrics (Prometheus)',
          description: 'System metrics, monitoring, and alerting',
          path: '/metrics',
          icon: '📈',
          requiredRoles: ['ROLE_DEVOPS', 'ROLE_SECOPS', 'ROLE_OBS_VIEWER'],
        },
        // Storage
        {
          id: 'minio',
          title: 'MinIO Storage',
          description: 'Object storage management and file operations',
          path: '/minio',
          icon: '🗂️',
          requiredRoles: ['ROLE_MINIO_ADMIN', 'ROLE_MINIO_READONLY'],
        },
        // Administration
        {
          id: 'pgadmin',
          title: 'pgAdmin',
          description: 'PostgreSQL database administration',
          path: '/pgadmin',
          icon: '🗄️',
          requiredRoles: ['ROLE_DBA', 'ROLE_DB_ADMIN'],
        },
        {
          id: 'keycloak',
          title: 'Keycloak Admin',
          description: 'Identity and access management configuration',
          path: '/keycloak',
          icon: '🔐',
          requiredRoles: ['ROLE_IAM_ADMIN'],
        },
      ];
    });

    return {
      quickAccessItems,
    };
  },
});
</script>
