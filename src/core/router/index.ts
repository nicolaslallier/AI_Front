import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

import { Logger } from '@/shared/utils/logger';

/**
 * Application route definitions
 * Structured with shell layout wrapping all child routes
 */
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/features/layout/components/app-shell.vue'),
    children: [
      {
        path: '',
        redirect: '/home',
      },
      {
        path: 'home',
        name: 'home',
        component: () => import('@/features/counter/views/home-view.vue'),
        meta: {
          title: 'Home',
        },
      },
      {
        path: 'grafana',
        name: 'grafana',
        component: () => import('@/features/grafana/views/grafana-view.vue'),
        meta: {
          title: 'Grafana',
        },
      },
    ],
  },
];

/**
 * Creates and configures the Vue Router instance
 *
 * Uses HTML5 history mode for clean URLs
 * Implements shell-based layout with nested routing
 *
 * @returns Configured router instance
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

/**
 * Global navigation guard to update document title and log navigation
 * Implements FR-008 requirement for navigation logging
 */
router.beforeEach((to, from, next) => {
  const title = to.meta.title as string;
  if (title) {
    document.title = `${title} | AI Front`;
  }

  // Log navigation for audit purposes (FR-008)
  if (from.name !== to.name) {
    Logger.info('Navigation', {
      from: from.name || from.path,
      to: to.name || to.path,
      timestamp: new Date().toISOString(),
    });
  }

  next();
});

export default router;
