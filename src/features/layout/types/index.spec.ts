import { describe, it, expect } from 'vitest';

import type { NavigationItem, NavigationConfig } from './index';

describe('layout types', () => {
  describe('NavigationItem', () => {
    it('should accept a valid navigation item object', () => {
      const navItem: NavigationItem = {
        id: 'home',
        label: 'Home',
        path: '/home',
      };

      expect(navItem.id).toBe('home');
      expect(navItem.label).toBe('Home');
      expect(navItem.path).toBe('/home');
    });

    it('should accept optional icon property', () => {
      const navItem: NavigationItem = {
        id: 'grafana',
        label: 'Grafana',
        path: '/grafana',
        icon: 'chart-icon',
      };

      expect(navItem.icon).toBe('chart-icon');
    });

    it('should accept optional visible property', () => {
      const navItem: NavigationItem = {
        id: 'admin',
        label: 'Admin',
        path: '/admin',
        visible: false,
      };

      expect(navItem.visible).toBe(false);
    });

    it('should accept optional external property', () => {
      const navItem: NavigationItem = {
        id: 'docs',
        label: 'Documentation',
        path: 'https://docs.example.com',
        external: true,
      };

      expect(navItem.external).toBe(true);
    });

    it('should work with all properties', () => {
      const navItem: NavigationItem = {
        id: 'complete',
        label: 'Complete',
        path: '/complete',
        icon: 'icon',
        visible: true,
        external: false,
      };

      expect(navItem).toBeDefined();
      expect(Object.keys(navItem).length).toBe(6);
    });
  });

  describe('NavigationConfig', () => {
    it('should accept an array of navigation items', () => {
      const config: NavigationConfig = {
        items: [
          {
            id: 'home',
            label: 'Home',
            path: '/home',
          },
          {
            id: 'grafana',
            label: 'Grafana',
            path: '/grafana',
          },
        ],
      };

      expect(config.items).toHaveLength(2);
      expect(config.items[0].id).toBe('home');
      expect(config.items[1].id).toBe('grafana');
    });

    it('should accept an empty array', () => {
      const config: NavigationConfig = {
        items: [],
      };

      expect(config.items).toHaveLength(0);
    });

    it('should maintain item order', () => {
      const config: NavigationConfig = {
        items: [
          { id: 'first', label: 'First', path: '/first' },
          { id: 'second', label: 'Second', path: '/second' },
          { id: 'third', label: 'Third', path: '/third' },
        ],
      };

      expect(config.items[0].id).toBe('first');
      expect(config.items[1].id).toBe('second');
      expect(config.items[2].id).toBe('third');
    });
  });
});
