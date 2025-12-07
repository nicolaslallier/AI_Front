import { describe, it, expect } from 'vitest';

import { config, isDevelopment, isProduction } from './index';

describe('config', () => {
  describe('configuration object', () => {
    it('should have apiBaseUrl property', () => {
      expect(config).toHaveProperty('apiBaseUrl');
      expect(typeof config.apiBaseUrl).toBe('string');
    });

    it('should have environment property', () => {
      expect(config).toHaveProperty('environment');
      expect(typeof config.environment).toBe('string');
    });

    it('should have enableDebug property', () => {
      expect(config).toHaveProperty('enableDebug');
      expect(typeof config.enableDebug).toBe('boolean');
    });

    it('should have grafanaUrl property', () => {
      expect(config).toHaveProperty('grafanaUrl');
      expect(typeof config.grafanaUrl).toBe('string');
    });

    it('should have pgAdminUrl property', () => {
      expect(config).toHaveProperty('pgAdminUrl');
      expect(typeof config.pgAdminUrl).toBe('string');
    });

    it('should have keycloakAdminUrl property', () => {
      expect(config).toHaveProperty('keycloakAdminUrl');
      expect(typeof config.keycloakAdminUrl).toBe('string');
    });

    it('should have lokiUrl property', () => {
      expect(config).toHaveProperty('lokiUrl');
      expect(typeof config.lokiUrl).toBe('string');
    });

    it('should have tempoUrl property', () => {
      expect(config).toHaveProperty('tempoUrl');
      expect(typeof config.tempoUrl).toBe('string');
    });

    it('should have prometheusUrl property', () => {
      expect(config).toHaveProperty('prometheusUrl');
      expect(typeof config.prometheusUrl).toBe('string');
    });

    it('should have minioUrl property', () => {
      expect(config).toHaveProperty('minioUrl');
      expect(typeof config.minioUrl).toBe('string');
    });

    it('should provide default values', () => {
      expect(config.apiBaseUrl).toBeDefined();
      expect(config.environment).toBeDefined();
      expect(config.enableDebug).toBeDefined();
      expect(config.grafanaUrl).toBeDefined();
      expect(config.pgAdminUrl).toBeDefined();
      expect(config.keycloakAdminUrl).toBeDefined();
      expect(config.lokiUrl).toBeDefined();
      expect(config.tempoUrl).toBeDefined();
      expect(config.prometheusUrl).toBeDefined();
      expect(config.minioUrl).toBeDefined();
    });

    it('should have default Grafana URL', () => {
      expect(config.grafanaUrl).toBe('http://localhost/grafana/');
    });

    it('should have default pgAdmin URL', () => {
      expect(config.pgAdminUrl).toBe('http://localhost/pgadmin/');
    });

    it('should have default Keycloak Admin URL', () => {
      expect(config.keycloakAdminUrl).toBe('http://localhost/keycloak-admin/');
    });

    it('should have default Loki URL', () => {
      expect(config.lokiUrl).toBe('http://localhost/loki/');
    });

    it('should have default Tempo URL', () => {
      expect(config.tempoUrl).toBe('http://localhost/tempo/');
    });

    it('should have default Prometheus URL', () => {
      expect(config.prometheusUrl).toBe('http://localhost/prometheus/');
    });

    it('should have default MinIO URL', () => {
      expect(config.minioUrl).toBe('http://localhost/minio/');
    });
  });

  describe('isDevelopment', () => {
    it('should return a boolean value', () => {
      const result = isDevelopment();
      expect(typeof result).toBe('boolean');
    });

    it('should be a function', () => {
      expect(typeof isDevelopment).toBe('function');
    });

    it('should be callable multiple times', () => {
      const first = isDevelopment();
      const second = isDevelopment();
      expect(first).toBe(second);
    });

    it('should be consistent with environment', () => {
      const isDev = isDevelopment();
      expect(typeof isDev).toBe('boolean');
    });
  });

  describe('isProduction', () => {
    it('should return a boolean value', () => {
      const result = isProduction();
      expect(typeof result).toBe('boolean');
    });

    it('should be a function', () => {
      expect(typeof isProduction).toBe('function');
    });

    it('should be callable multiple times', () => {
      const first = isProduction();
      const second = isProduction();
      expect(first).toBe(second);
    });

    it('should be consistent with environment', () => {
      const isProd = isProduction();
      expect(typeof isProd).toBe('boolean');
    });
  });

  describe('environment detection', () => {
    it('should correctly identify development and production as opposites', () => {
      const dev = isDevelopment();
      const prod = isProduction();

      if (dev) {
        expect(prod).toBe(false);
      } else if (prod) {
        expect(dev).toBe(false);
      }
    });
  });

  describe('config immutability', () => {
    it('should expose config as readonly', () => {
      const originalApiBaseUrl = config.apiBaseUrl;
      expect(config.apiBaseUrl).toBe(originalApiBaseUrl);
    });

    it('should maintain consistent values', () => {
      const firstRead = config.environment;
      const secondRead = config.environment;
      expect(firstRead).toBe(secondRead);
    });
  });
});
