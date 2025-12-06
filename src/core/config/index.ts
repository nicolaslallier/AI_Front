/**
 * Application configuration interface
 */
export interface AppConfig {
  apiBaseUrl: string;
  environment: string;
  enableDebug: boolean;
  grafanaUrl: string;
}

/**
 * Application configuration
 * Centralized configuration management following the Single Responsibility Principle
 */
export const config: AppConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  environment: import.meta.env.MODE || 'development',
  enableDebug: import.meta.env.DEV || false,
  grafanaUrl: import.meta.env.VITE_GRAFANA_URL || 'http://localhost/grafana/',
};

/**
 * Checks if the application is running in development mode
 *
 * @returns True if in development mode
 */
export function isDevelopment(): boolean {
  return config.environment === 'development';
}

/**
 * Checks if the application is running in production mode
 *
 * @returns True if in production mode
 */
export function isProduction(): boolean {
  return config.environment === 'production';
}
