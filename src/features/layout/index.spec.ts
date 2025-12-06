import { describe, it, expect } from 'vitest';

import type { NavigationItem, NavigationConfig } from './index';

describe('Layout module exports', () => {
  it('should export NavigationItem type', () => {
    const navItem: NavigationItem = {
      id: 'test',
      label: 'Test',
      path: '/test',
    };
    expect(navItem).toBeDefined();
    expect(navItem.id).toBe('test');
  });

  it('should export NavigationConfig type', () => {
    const navConfig: NavigationConfig = {
      items: [],
    };
    expect(navConfig).toBeDefined();
    expect(Array.isArray(navConfig.items)).toBe(true);
  });
});
