import { fileURLToPath } from 'node:url';

import { mergeConfig, defineConfig, configDefaults } from 'vitest/config';

import viteConfig from './vite.config';

/**
 * Vitest configuration with strict coverage thresholds
 * @see https://vitest.dev/config/
 */
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'tests/e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html', 'lcov'],
        exclude: [
          'node_modules/**',
          'tests/',
          '**/*.config.{js,ts}',
          '**/*.d.ts',
          'src/main.ts',
          'src/**/*.spec.ts',
          'src/**/*.test.ts',
          'src/**/types/**/*.ts',
          'src/vite-env.d.ts',
        ],
        excludeNodeModules: true,
        thresholds: {
          lines: 90,
          functions: 90,
          branches: 90,
          statements: 90,
        },
      },
    },
  }),
);
