/**
 * Keycloak authentication configuration interface
 */
export interface KeycloakConfig {
  url: string;
  realm: string;
  clientId: string;
  minValidity: number;
  checkInterval: number;
  enableDebug: boolean;
}

/**
 * Application configuration interface
 */
export interface AppConfig {
  apiBaseUrl: string;
  environment: string;
  enableDebug: boolean;
  grafanaUrl: string;
  pgAdminUrl: string;
  keycloakAdminUrl: string;
  lokiUrl: string;
  tempoUrl: string;
  prometheusUrl: string;
  minioUrl: string;
  keycloak: KeycloakConfig;
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
  pgAdminUrl: import.meta.env.VITE_PGADMIN_URL || 'http://localhost/pgadmin/',
  keycloakAdminUrl: import.meta.env.VITE_KEYCLOAK_ADMIN_URL || 'http://localhost/keycloak/',
  lokiUrl: import.meta.env.VITE_LOKI_URL || 'http://localhost/loki/',
  tempoUrl: import.meta.env.VITE_TEMPO_URL || 'http://localhost/tempo/',
  prometheusUrl: import.meta.env.VITE_PROMETHEUS_URL || 'http://localhost/prometheus/',
  minioUrl: import.meta.env.VITE_MINIO_URL || 'http://localhost/minio/',
  keycloak: {
    url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost/auth',
    realm: import.meta.env.VITE_KEYCLOAK_REALM || 'infra-admin',
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'ai-front-spa',
    minValidity: Number(import.meta.env.VITE_KEYCLOAK_MIN_VALIDITY) || 70,
    checkInterval: Number(import.meta.env.VITE_KEYCLOAK_CHECK_INTERVAL) || 60,
    enableDebug: import.meta.env.VITE_KEYCLOAK_DEBUG === 'true',
  },
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
