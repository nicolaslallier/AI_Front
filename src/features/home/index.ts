/**
 * Home feature module
 *
 * Provides the main welcome/landing page functionality for the application.
 * This feature implements the home page requirements from Front_2.1.0.html.
 *
 * Exports:
 * - Components: WelcomeHero, QuickAccessCard, QuickAccessGrid
 * - Views: HomeView
 * - Types: QuickAccessItem, isQuickAccessItem
 */

// Components
export { default as WelcomeHero } from './components/welcome-hero.vue';
export { default as QuickAccessCard } from './components/quick-access-card.vue';
export { default as QuickAccessGrid } from './components/quick-access-grid.vue';

// Views
export { default as HomeView } from './views/home-view.vue';

// Types
export type { QuickAccessItem } from './types';
export { isQuickAccessItem } from './types';
