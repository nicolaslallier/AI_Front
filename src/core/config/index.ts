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
 * Get the base URL dynamically based on current window location
 * This allows the app to work with both HTTP and HTTPS
 */
function getBaseUrl(path: string): string {
  // If the env var is already a full URL, use it
  const envUrl = import.meta.env[`VITE_${path.toUpperCase()}_URL`];
  if (envUrl && (envUrl.startsWith('http://') || envUrl.startsWith('https://'))) {
    return envUrl;
  }

  // Otherwise, construct URL from current location
  if (typeof window !== 'undefined') {
    const protocol = window.location.protocol; // 'http:' or 'https:'
    const host = window.location.host; // 'localhost' or '192.168.2.35' or '192.168.2.35:443'
    return `${protocol}//${host}`;
  }

  // Fallback for SSR or build time
  return envUrl || 'http://localhost';
}

/**
 * Application configuration
 * Centralized configuration management following the Single Responsibility Principle
 * URLs are dynamically constructed to support both HTTP and HTTPS
 */
export const config: AppConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || `${getBaseUrl('api')}/api`,
  environment: import.meta.env.MODE || 'development',
  enableDebug: import.meta.env.DEV || false,
  grafanaUrl: import.meta.env.VITE_GRAFANA_URL || `${getBaseUrl('grafana')}/monitoring/grafana/`,
  pgAdminUrl: import.meta.env.VITE_PGADMIN_URL || `${getBaseUrl('pgadmin')}/pgadmin/`,
  keycloakAdminUrl: import.meta.env.VITE_KEYCLOAK_ADMIN_URL || `${getBaseUrl('keycloak-admin')}/auth/admin/`,
  lokiUrl: import.meta.env.VITE_LOKI_URL || `${getBaseUrl('loki')}/monitoring/loki/`,
  tempoUrl: import.meta.env.VITE_TEMPO_URL || `${getBaseUrl('tempo')}/monitoring/tempo/`,
  prometheusUrl: import.meta.env.VITE_PROMETHEUS_URL || `${getBaseUrl('prometheus')}/monitoring/prometheus/`,
  minioUrl: import.meta.env.VITE_MINIO_URL || `${getBaseUrl('minio')}/minio-console/`,
  keycloak: {
    url: import.meta.env.VITE_KEYCLOAK_URL || `${getBaseUrl('keycloak')}/auth`,
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
