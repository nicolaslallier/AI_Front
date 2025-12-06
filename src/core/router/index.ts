import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

/**
 * Application route definitions
 */
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/features/counter/views/home-view.vue'),
    meta: {
      title: 'Home',
    },
  },
];

/**
 * Creates and configures the Vue Router instance
 *
 * Uses HTML5 history mode for clean URLs
 *
 * @returns Configured router instance
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

/**
 * Global navigation guard to update document title
 */
router.beforeEach((to, _from, next) => {
  const title = to.meta.title as string;
  if (title) {
    document.title = `${title} | AI Front`;
  }
  next();
});

export default router;
