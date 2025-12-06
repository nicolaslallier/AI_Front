import { describe, it, expect } from 'vitest';

import type { NavigationItem, NavigationConfig } from './index';

describe('layout feature exports', () => {
  it('should export NavigationItem type', () => {
    const item: NavigationItem = {
      id: 'test',
      label: 'Test',
      path: '/test',
    };

    expect(item).toBeDefined();
  });

  it('should export NavigationConfig type', () => {
    const config: NavigationConfig = {
      items: [],
    };

    expect(config).toBeDefined();
  });
});
