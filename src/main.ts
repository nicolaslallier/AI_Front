import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from './App.vue';
import { useAuthStore } from './core/auth';
import router from './core/router';
import { Logger } from './shared/utils/logger';

import './assets/main.css';

/**
 * Initialize and mount the Vue application
 *
 * Initialization sequence:
 * 1. Create Vue app instance
 * 2. Install Pinia store (required for auth store)
 * 3. Install Vue Router
 * 4. Initialize authentication system (FR-FE-KC-002)
 * 5. Mount the application
 *
 * This ensures authentication is ready before any routes are accessed.
 */
async function initializeApp(): Promise<void> {
  try {
    // Create Vue application instance
    const app = createApp(App);

    // Install Pinia store (must be before auth initialization)
    const pinia = createPinia();
    app.use(pinia);

    // Install Vue Router
    app.use(router);

    // Initialize authentication system before mounting
    Logger.info('Initializing authentication system...');

    const authStore = useAuthStore();
    await authStore.initialize();

    Logger.info('Authentication system initialized, mounting app');

    // Mount the application
    app.mount('#app');
  } catch (error) {
    Logger.error('Application initialization failed', error);

    // Display error to user
    document.body.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: system-ui;">
        <div style="text-align: center; max-width: 500px; padding: 20px;">
          <h1 style="color: #dc2626; margin-bottom: 16px;">Initialization Error</h1>
          <p style="color: #6b7280; margin-bottom: 20px;">
            Failed to initialize the application. This may be due to:
          </p>
          <ul style="text-align: left; color: #6b7280; margin-bottom: 20px;">
            <li>Authentication service is unavailable</li>
            <li>Network connectivity issues</li>
            <li>Configuration errors</li>
          </ul>
          <p style="color: #6b7280;">
            Please check your connection and try refreshing the page.
          </p>
          <button
            onclick="window.location.reload()"
            style="
              margin-top: 20px;
              padding: 10px 20px;
              background: #2563eb;
              color: white;
              border: none;
              border-radius: 6px;
              cursor: pointer;
              font-size: 14px;
            "
          >
            Reload Page
          </button>
        </div>
      </div>
    `;
  }
}

// Start application initialization
initializeApp();
