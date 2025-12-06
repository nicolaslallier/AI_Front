import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from './App.vue';
import router from './core/router';

import './assets/main.css';

/**
 * Initialize and mount the Vue application
 * Sets up Pinia store and Vue Router
 */
const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');
