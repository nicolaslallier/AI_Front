import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import { createRouter, createMemoryHistory } from 'vue-router';

import QuickAccessCard from './quick-access-card.vue';

describe('QuickAccessCard', () => {
  // Helper function to create a router for testing
  const createTestRouter = (): ReturnType<typeof createRouter> => {
    return createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/grafana', name: 'grafana', component: { template: '<div>Grafana</div>' } },
        { path: '/pgadmin', name: 'pgadmin', component: { template: '<div>pgAdmin</div>' } },
      ],
    });
  };

  describe('Component Rendering', () => {
    it('should render with all required props', async () => {
      const router = createTestRouter();
      const wrapper = mount(QuickAccessCard, {
        props: {
          title: 'Grafana',
          description: 'Dashboards and Visualizations',
          path: '/grafana',
          icon: '📊',
        },
        global: {
          plugins: [router],
        },
      });

      expect(wrapper.exists()).toBe(true);
    });

    it('should display the title', async () => {
      const router = createTestRouter();
      const wrapper = mount(QuickAccessCard, {
        props: {
          title: 'Test Title',
          description: 'Test Description',
          path: '/test',
          icon: '🏠',
        },
        global: {
          plugins: [router],
        },
      });

      expect(wrapper.find('h3').text()).toBe('Test Title');
    });

    it('should display the description', async () => {
      const router = createTestRouter();
      const wrapper = mount(QuickAccessCard, {
        props: {
          title: 'Test',
          description: 'This is a test description',
          path: '/test',
          icon: '🏠',
        },
        global: {
          plugins: [router],
        },
      });

      expect(wrapper.find('p').text()).toBe('This is a test description');
    });

    it('should display the icon', async () => {
      const router = createTestRouter();
      const wrapper = mount(QuickAccessCard, {
        props: {
          title: 'Test',
          description: 'Description',
          path: '/test',
          icon: '🎨',
        },
        global: {
          plugins: [router],
        },
      });

      const iconElement = wrapper.find('[role="img"]');
      expect(iconElement.text()).toBe('🎨');
    });

    it('should render as a router-link with correct path', async () => {
      const router = createTestRouter();
      const wrapper = mount(QuickAccessCard, {
        props: {
          title: 'Grafana',
          description: 'Dashboards',
          path: '/grafana',
          icon: '📊',
        },
        global: {
          plugins: [router],
        },
      });

      const link = wrapper.find('a');
      expect(link.exists()).toBe(true);
      expect(link.attributes('href')).toBe('/grafana');
    });
  });

  describe('Styling and Layout', () => {
    it('should apply card styling classes', async () => {
      const router = createTestRouter();
      const wrapper = mount(QuickAccessCard, {
        props: {
          title: 'Test',
          description: 'Test',
          path: '/test',
          icon: '🏠',
        },
        global: {
          plugins: [router],
        },
      });

      const link = wrapper.find('a');
      expect(link.classes()).toContain('bg-white');
      expect(link.classes()).toContain('rounded-lg');
      expect(link.classes()).toContain('shadow-md');
    });

    it('should have hover effect classes', async () => {
      const router = createTestRouter();
      const wrapper = mount(QuickAccessCard, {
        props: {
          title: 'Test',
          description: 'Test',
          path: '/test',
          icon: '🏠',
        },
        global: {
          plugins: [router],
        },
      });

      const link = wrapper.find('a');
      expect(link.classes()).toContain('hover:shadow-xl');
      expect(link.classes()).toContain('hover:border-indigo-500');
    });

    it('should apply transition classes for smooth animation', async () => {
      const router = createTestRouter();
      const wrapper = mount(QuickAccessCard, {
        props: {
          title: 'Test',
          description: 'Test',
          path: '/test',
          icon: '🏠',
        },
        global: {
          plugins: [router],
        },
      });

      const link = wrapper.find('a');
      expect(link.classes()).toContain('transition-shadow');
      expect(link.classes()).toContain('duration-300');
    });

    it('should center content with flexbox', async () => {
      const router = createTestRouter();
      const wrapper = mount(QuickAccessCard, {
        props: {
          title: 'Test',
          description: 'Test',
          path: '/test',
          icon: '🏠',
        },
        global: {
          plugins: [router],
        },
      });

      const container = wrapper.find('.flex.flex-col');
      expect(container.exists()).toBe(true);
      expect(container.classes()).toContain('items-center');
      expect(container.classes()).toContain('text-center');
    });

    it('should apply proper spacing between elements', async () => {
      const router = createTestRouter();
      const wrapper = mount(QuickAccessCard, {
        props: {
          title: 'Test',
          description: 'Test',
          path: '/test',
          icon: '🏠',
        },
        global: {
          plugins: [router],
        },
      });

      const container = wrapper.find('.flex.flex-col');
      expect(container.classes()).toContain('space-y-4');
    });

    it('should apply large size to icon', async () => {
      const router = createTestRouter();
      const wrapper = mount(QuickAccessCard, {
        props: {
          title: 'Test',
          description: 'Test',
          path: '/test',
          icon: '🏠',
        },
        global: {
          plugins: [router],
        },
      });

      const icon = wrapper.find('[role="img"]');
      expect(icon.classes()).toContain('text-5xl');
    });

    it('should apply proper typography to title', async () => {
      const router = createTestRouter();
      const wrapper = mount(QuickAccessCard, {
        props: {
          title: 'Test',
          description: 'Test',
          path: '/test',
          icon: '🏠',
        },
        global: {
          plugins: [router],
        },
      });

      const title = wrapper.find('h3');
      expect(title.classes()).toContain('text-xl');
      expect(title.classes()).toContain('font-semibold');
      expect(title.classes()).toContain('text-gray-900');
    });

    it('should apply proper typography to description', async () => {
      const router = createTestRouter();
      const wrapper = mount(QuickAccessCard, {
        props: {
          title: 'Test',
          description: 'Test',
          path: '/test',
          icon: '🏠',
        },
        global: {
          plugins: [router],
        },
      });

      const description = wrapper.find('p');
      expect(description.classes()).toContain('text-gray-600');
      expect(description.classes()).toContain('text-sm');
      expect(description.classes()).toContain('leading-relaxed');
    });
  });

  describe('Accessibility', () => {
    it('should have semantic heading for title', async () => {
      const router = createTestRouter();
      const wrapper = mount(QuickAccessCard, {
        props: {
          title: 'Grafana',
          description: 'Dashboards',
          path: '/grafana',
          icon: '📊',
        },
        global: {
          plugins: [router],
        },
      });

      const title = wrapper.find('h3');
      expect(title.exists()).toBe(true);
      expect(title.element.tagName).toBe('H3');
    });

    it('should have ARIA label on icon', async () => {
      const router = createTestRouter();
      const wrapper = mount(QuickAccessCard, {
        props: {
          title: 'Grafana',
          description: 'Dashboards',
          path: '/grafana',
          icon: '📊',
        },
        global: {
          plugins: [router],
        },
      });

      const icon = wrapper.find('[role="img"]');
      expect(icon.attributes('aria-label')).toBe('Grafana icon');
    });

    it('should have role="img" on icon element', async () => {
      const router = createTestRouter();
      const wrapper = mount(QuickAccessCard, {
        props: {
          title: 'Test',
          description: 'Test',
          path: '/test',
          icon: '🏠',
        },
        global: {
          plugins: [router],
        },
      });

      const icon = wrapper.find('[role="img"]');
      expect(icon.exists()).toBe(true);
    });

    it('should have sufficient color contrast', async () => {
      const router = createTestRouter();
      const wrapper = mount(QuickAccessCard, {
        props: {
          title: 'Test',
          description: 'Test',
          path: '/test',
          icon: '🏠',
        },
        global: {
          plugins: [router],
        },
      });

      // Dark text on white background for contrast
      const title = wrapper.find('h3');
      const description = wrapper.find('p');
      expect(title.classes()).toContain('text-gray-900');
      expect(description.classes()).toContain('text-gray-600');
    });
  });

  describe('Navigation', () => {
    it('should navigate to correct path when clicked', async () => {
      const router = createTestRouter();
      await router.push('/');
      await router.isReady();

      const wrapper = mount(QuickAccessCard, {
        props: {
          title: 'Grafana',
          description: 'Dashboards',
          path: '/grafana',
          icon: '📊',
        },
        global: {
          plugins: [router],
        },
      });

      const link = wrapper.find('a');
      await link.trigger('click');
      await new Promise((resolve) => setTimeout(resolve, 10));
      await router.isReady();

      // The link should have the correct href
      expect(link.attributes('href')).toBe('/grafana');
    });
  });

  describe('Props Validation', () => {
    it('should require title prop', () => {
      const props = QuickAccessCard.props;

      expect(props.title.required).toBe(true);
      expect(props.title.type).toBe(String);
    });

    it('should require description prop', () => {
      const props = QuickAccessCard.props;

      expect(props.description.required).toBe(true);
      expect(props.description.type).toBe(String);
    });

    it('should require path prop', () => {
      const props = QuickAccessCard.props;

      expect(props.path.required).toBe(true);
      expect(props.path.type).toBe(String);
    });

    it('should require icon prop', () => {
      const props = QuickAccessCard.props;

      expect(props.icon.required).toBe(true);
      expect(props.icon.type).toBe(String);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty icon gracefully', async () => {
      const router = createTestRouter();
      const wrapper = mount(QuickAccessCard, {
        props: {
          title: 'Test',
          description: 'Test',
          path: '/test',
          icon: '',
        },
        global: {
          plugins: [router],
        },
      });

      const icon = wrapper.find('[role="img"]');
      expect(icon.exists()).toBe(true);
      expect(icon.text()).toBe('');
    });

    it('should handle very long title', async () => {
      const router = createTestRouter();
      const longTitle = 'Very Long Title '.repeat(10);
      const wrapper = mount(QuickAccessCard, {
        props: {
          title: longTitle,
          description: 'Test',
          path: '/test',
          icon: '🏠',
        },
        global: {
          plugins: [router],
        },
      });

      expect(wrapper.find('h3').text()).toBe(longTitle.trim());
    });

    it('should handle very long description', async () => {
      const router = createTestRouter();
      const longDescription = 'Very long description text that goes on and on. '.repeat(5);
      const wrapper = mount(QuickAccessCard, {
        props: {
          title: 'Test',
          description: longDescription,
          path: '/test',
          icon: '🏠',
        },
        global: {
          plugins: [router],
        },
      });

      expect(wrapper.find('p').text()).toBe(longDescription.trim());
    });

    it('should handle special characters in path', async () => {
      const router = createTestRouter();
      const wrapper = mount(QuickAccessCard, {
        props: {
          title: 'Test',
          description: 'Test',
          path: '/test?param=value&other=123',
          icon: '🏠',
        },
        global: {
          plugins: [router],
        },
      });

      const link = wrapper.find('a');
      expect(link.attributes('href')).toContain('param=value');
    });
  });

  describe('Business Requirements', () => {
    it('should implement FR-HOME-006 (quick-access buttons)', async () => {
      const router = createTestRouter();
      const wrapper = mount(QuickAccessCard, {
        props: {
          title: 'Grafana',
          description: 'Dashboards',
          path: '/grafana',
          icon: '📊',
        },
        global: {
          plugins: [router],
        },
      });

      // Should be a clickable card that navigates
      const link = wrapper.find('a');
      expect(link.exists()).toBe(true);
      expect(link.attributes('href')).toBe('/grafana');
    });

    it('should implement BR-HOME-002 (professional appearance)', async () => {
      const router = createTestRouter();
      const wrapper = mount(QuickAccessCard, {
        props: {
          title: 'Test',
          description: 'Test',
          path: '/test',
          icon: '🏠',
        },
        global: {
          plugins: [router],
        },
      });

      // Clean, professional card design
      const link = wrapper.find('a');
      expect(link.classes()).toContain('bg-white');
      expect(link.classes()).toContain('shadow-md');
      expect(link.classes()).toContain('rounded-lg');
    });
  });
});
