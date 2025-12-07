import { describe, it, expect } from 'vitest';

import { isQuickAccessItem, type QuickAccessItem } from './index';

describe('Home Types', () => {
  describe('QuickAccessItem interface', () => {
    it('should define valid QuickAccessItem structure', () => {
      const validItem: QuickAccessItem = {
        id: 'grafana',
        title: 'Grafana',
        description: 'Dashboards and Visualizations',
        path: '/grafana',
        icon: '📊',
        requiredRoles: ['ROLE_DEVOPS'],
      };

      expect(validItem.id).toBe('grafana');
      expect(validItem.title).toBe('Grafana');
      expect(validItem.description).toBe('Dashboards and Visualizations');
      expect(validItem.path).toBe('/grafana');
      expect(validItem.icon).toBe('📊');
      expect(validItem.requiredRoles).toEqual(['ROLE_DEVOPS']);
    });

    it('should allow QuickAccessItem without requiredRoles', () => {
      const itemWithoutRoles: QuickAccessItem = {
        id: 'home',
        title: 'Home',
        description: 'Welcome page',
        path: '/home',
        icon: '🏠',
      };

      expect(itemWithoutRoles.requiredRoles).toBeUndefined();
    });
  });

  describe('isQuickAccessItem', () => {
    it('should return true for valid QuickAccessItem', () => {
      const validItem = {
        id: 'grafana',
        title: 'Grafana',
        description: 'Dashboards',
        path: '/grafana',
        icon: '📊',
        requiredRoles: ['ROLE_DEVOPS'],
      };

      expect(isQuickAccessItem(validItem)).toBe(true);
    });

    it('should return true for valid QuickAccessItem without requiredRoles', () => {
      const validItem = {
        id: 'home',
        title: 'Home',
        description: 'Welcome',
        path: '/home',
        icon: '🏠',
      };

      expect(isQuickAccessItem(validItem)).toBe(true);
    });

    it('should return false for null', () => {
      expect(isQuickAccessItem(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isQuickAccessItem(undefined)).toBe(false);
    });

    it('should return false for non-object types', () => {
      expect(isQuickAccessItem('string')).toBe(false);
      expect(isQuickAccessItem(123)).toBe(false);
      expect(isQuickAccessItem(true)).toBe(false);
    });

    it('should return false for object missing id', () => {
      const invalid = {
        title: 'Grafana',
        description: 'Dashboards',
        path: '/grafana',
        icon: '📊',
      };

      expect(isQuickAccessItem(invalid)).toBe(false);
    });

    it('should return false for object missing title', () => {
      const invalid = {
        id: 'grafana',
        description: 'Dashboards',
        path: '/grafana',
        icon: '📊',
      };

      expect(isQuickAccessItem(invalid)).toBe(false);
    });

    it('should return false for object missing description', () => {
      const invalid = {
        id: 'grafana',
        title: 'Grafana',
        path: '/grafana',
        icon: '📊',
      };

      expect(isQuickAccessItem(invalid)).toBe(false);
    });

    it('should return false for object missing path', () => {
      const invalid = {
        id: 'grafana',
        title: 'Grafana',
        description: 'Dashboards',
        icon: '📊',
      };

      expect(isQuickAccessItem(invalid)).toBe(false);
    });

    it('should return false for object missing icon', () => {
      const invalid = {
        id: 'grafana',
        title: 'Grafana',
        description: 'Dashboards',
        path: '/grafana',
      };

      expect(isQuickAccessItem(invalid)).toBe(false);
    });

    it('should return false when requiredRoles is not an array', () => {
      const invalid = {
        id: 'grafana',
        title: 'Grafana',
        description: 'Dashboards',
        path: '/grafana',
        icon: '📊',
        requiredRoles: 'ROLE_DEVOPS',
      };

      expect(isQuickAccessItem(invalid)).toBe(false);
    });

    it('should return false when id is not a string', () => {
      const invalid = {
        id: 123,
        title: 'Grafana',
        description: 'Dashboards',
        path: '/grafana',
        icon: '📊',
      };

      expect(isQuickAccessItem(invalid)).toBe(false);
    });
  });
});
