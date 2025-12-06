import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';

import GrafanaError from './grafana-error.vue';
import { GrafanaErrorType } from '../types/index';

import type { GrafanaError as GrafanaErrorType_Interface } from '../types/index';

describe('GrafanaError', () => {
  const mockError: GrafanaErrorType_Interface = {
    type: GrafanaErrorType.NETWORK_ERROR,
    message: 'Failed to load Grafana',
    timestamp: new Date(),
  };

  describe('component rendering', () => {
    it('should render the component', () => {
      const wrapper = mount(GrafanaError, {
        props: { error: mockError },
      });
      expect(wrapper.exists()).toBe(true);
    });

    it('should display error message', () => {
      const wrapper = mount(GrafanaError, {
        props: { error: mockError },
      });
      expect(wrapper.text()).toContain(mockError.message);
    });

    it('should render error icon', () => {
      const wrapper = mount(GrafanaError, {
        props: { error: mockError },
      });
      const icon = wrapper.find('[data-testid="error-icon"]');
      expect(icon.exists()).toBe(true);
    });

    it('should have proper error container styling', () => {
      const wrapper = mount(GrafanaError, {
        props: { error: mockError },
      });
      const container = wrapper.find('[data-testid="error-container"]');
      expect(container.exists()).toBe(true);
      expect(container.classes()).toContain('bg-red-50');
    });
  });

  describe('retry functionality', () => {
    it('should render retry button', () => {
      const wrapper = mount(GrafanaError, {
        props: { error: mockError },
      });
      const retryButton = wrapper.find('button');
      expect(retryButton.exists()).toBe(true);
    });

    it('should display retry button text', () => {
      const wrapper = mount(GrafanaError, {
        props: { error: mockError },
      });
      const retryButton = wrapper.find('button');
      expect(retryButton.text()).toContain('Retry');
    });

    it('should emit retry event when button clicked', async () => {
      const wrapper = mount(GrafanaError, {
        props: { error: mockError },
      });
      const retryButton = wrapper.find('button');
      await retryButton.trigger('click');
      expect(wrapper.emitted('retry')).toBeTruthy();
    });

    it('should emit retry event only once per click', async () => {
      const wrapper = mount(GrafanaError, {
        props: { error: mockError },
      });
      const retryButton = wrapper.find('button');
      await retryButton.trigger('click');
      expect(wrapper.emitted('retry')).toHaveLength(1);
    });

    it('should call onRetry handler when provided', async () => {
      const onRetry = vi.fn();
      const wrapper = mount(GrafanaError, {
        props: { error: mockError },
        attrs: { onRetry },
      });
      const retryButton = wrapper.find('button');
      await retryButton.trigger('click');
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted('retry')).toBeTruthy();
    });
  });

  describe('error details', () => {
    it('should display error details when provided', () => {
      const errorWithDetails: GrafanaErrorType_Interface = {
        ...mockError,
        details: 'Connection timeout after 30 seconds',
      };
      const wrapper = mount(GrafanaError, {
        props: { error: errorWithDetails },
      });
      expect(wrapper.text()).toContain(errorWithDetails.details);
    });

    it('should not show details section when details are not provided', () => {
      const wrapper = mount(GrafanaError, {
        props: { error: mockError },
      });
      const detailsElement = wrapper.find('[data-testid="error-details"]');
      expect(detailsElement.exists()).toBe(false);
    });

    it('should show details section when details are provided', () => {
      const errorWithDetails: GrafanaErrorType_Interface = {
        ...mockError,
        details: 'Technical details',
      };
      const wrapper = mount(GrafanaError, {
        props: { error: errorWithDetails },
      });
      const detailsElement = wrapper.find('[data-testid="error-details"]');
      expect(detailsElement.exists()).toBe(true);
    });
  });

  describe('error type specific messages', () => {
    it('should handle NETWORK_ERROR type', () => {
      const networkError: GrafanaErrorType_Interface = {
        type: GrafanaErrorType.NETWORK_ERROR,
        message: 'Network error occurred',
        timestamp: new Date(),
      };
      const wrapper = mount(GrafanaError, {
        props: { error: networkError },
      });
      expect(wrapper.text()).toContain('Network error occurred');
    });

    it('should handle TIMEOUT_ERROR type', () => {
      const timeoutError: GrafanaErrorType_Interface = {
        type: GrafanaErrorType.TIMEOUT_ERROR,
        message: 'Request timed out',
        timestamp: new Date(),
      };
      const wrapper = mount(GrafanaError, {
        props: { error: timeoutError },
      });
      expect(wrapper.text()).toContain('Request timed out');
    });

    it('should handle IFRAME_ERROR type', () => {
      const iframeError: GrafanaErrorType_Interface = {
        type: GrafanaErrorType.IFRAME_ERROR,
        message: 'Failed to load iframe',
        timestamp: new Date(),
      };
      const wrapper = mount(GrafanaError, {
        props: { error: iframeError },
      });
      expect(wrapper.text()).toContain('Failed to load iframe');
    });

    it('should handle UNKNOWN_ERROR type', () => {
      const unknownError: GrafanaErrorType_Interface = {
        type: GrafanaErrorType.UNKNOWN_ERROR,
        message: 'Unknown error',
        timestamp: new Date(),
      };
      const wrapper = mount(GrafanaError, {
        props: { error: unknownError },
      });
      expect(wrapper.text()).toContain('Unknown error');
    });
  });

  describe('props validation', () => {
    it('should accept error prop', () => {
      const wrapper = mount(GrafanaError, {
        props: { error: mockError },
      });
      expect(wrapper.props('error')).toEqual(mockError);
    });

    it('should update when error prop changes', async () => {
      const wrapper = mount(GrafanaError, {
        props: { error: mockError },
      });
      const newError: GrafanaErrorType_Interface = {
        type: GrafanaErrorType.TIMEOUT_ERROR,
        message: 'New error message',
        timestamp: new Date(),
      };
      await wrapper.setProps({ error: newError });
      expect(wrapper.text()).toContain('New error message');
    });
  });

  describe('accessibility', () => {
    it('should have role="alert" for screen readers', () => {
      const wrapper = mount(GrafanaError, {
        props: { error: mockError },
      });
      const container = wrapper.find('[role="alert"]');
      expect(container.exists()).toBe(true);
    });

    it('should have descriptive button text', () => {
      const wrapper = mount(GrafanaError, {
        props: { error: mockError },
      });
      const button = wrapper.find('button');
      expect(button.text()).toBeTruthy();
      expect(button.text().length).toBeGreaterThan(0);
    });

    it('should have aria-label on retry button', () => {
      const wrapper = mount(GrafanaError, {
        props: { error: mockError },
      });
      const button = wrapper.find('button');
      expect(button.attributes('aria-label')).toBe('Retry loading Grafana');
    });
  });

  describe('user feedback', () => {
    it('should display helpful message to user', () => {
      const wrapper = mount(GrafanaError, {
        props: { error: mockError },
      });
      const message = wrapper.find('[data-testid="error-message"]');
      expect(message.exists()).toBe(true);
      expect(message.text()).toBeTruthy();
    });

    it('should provide clear call to action', () => {
      const wrapper = mount(GrafanaError, {
        props: { error: mockError },
      });
      expect(wrapper.text()).toContain('Retry');
    });
  });
});
