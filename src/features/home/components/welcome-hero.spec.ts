import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';

import WelcomeHero from './welcome-hero.vue';

describe('WelcomeHero', () => {
  describe('Component Rendering', () => {
    it('should render with default props', () => {
      const wrapper = mount(WelcomeHero);

      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find('h1').exists()).toBe(true);
      expect(wrapper.find('p').exists()).toBe(true);
    });

    it('should display default title when no prop provided', () => {
      const wrapper = mount(WelcomeHero);
      const title = wrapper.find('h1');

      expect(title.text()).toBe('Welcome to Monitoring and Administration Portal');
    });

    it('should display default description when no prop provided', () => {
      const wrapper = mount(WelcomeHero);
      const description = wrapper.find('p');

      expect(description.text()).toContain('This portal provides centralized access');
      expect(description.text()).toContain('monitor your infrastructure');
    });

    it('should display custom title when provided', () => {
      const customTitle = 'Welcome to Custom Portal';
      const wrapper = mount(WelcomeHero, {
        props: {
          title: customTitle,
        },
      });

      const title = wrapper.find('h1');
      expect(title.text()).toBe(customTitle);
    });

    it('should display custom description when provided', () => {
      const customDescription = 'This is a custom description for testing purposes.';
      const wrapper = mount(WelcomeHero, {
        props: {
          description: customDescription,
        },
      });

      const description = wrapper.find('p');
      expect(description.text()).toBe(customDescription);
    });

    it('should accept both custom title and description', () => {
      const customTitle = 'Test Title';
      const customDescription = 'Test Description';
      const wrapper = mount(WelcomeHero, {
        props: {
          title: customTitle,
          description: customDescription,
        },
      });

      expect(wrapper.find('h1').text()).toBe(customTitle);
      expect(wrapper.find('p').text()).toBe(customDescription);
    });
  });

  describe('Styling and Layout', () => {
    it('should use semantic HTML with section element', () => {
      const wrapper = mount(WelcomeHero);

      expect(wrapper.find('section').exists()).toBe(true);
    });

    it('should apply gradient background classes', () => {
      const wrapper = mount(WelcomeHero);
      const section = wrapper.find('section');

      expect(section.classes()).toContain('bg-gradient-to-br');
    });

    it('should apply responsive padding classes', () => {
      const wrapper = mount(WelcomeHero);
      const section = wrapper.find('section');

      expect(section.classes()).toContain('py-16');
      expect(section.classes()).toContain('px-4');
    });

    it('should center content with max-width container', () => {
      const wrapper = mount(WelcomeHero);
      const container = wrapper.find('.max-w-4xl');

      expect(container.exists()).toBe(true);
      expect(container.classes()).toContain('mx-auto');
      expect(container.classes()).toContain('text-center');
    });

    it('should apply large font size to title', () => {
      const wrapper = mount(WelcomeHero);
      const title = wrapper.find('h1');

      expect(title.classes()).toContain('text-4xl');
      expect(title.classes()).toContain('font-bold');
    });

    it('should apply readable font size to description', () => {
      const wrapper = mount(WelcomeHero);
      const description = wrapper.find('p');

      expect(description.classes()).toContain('text-lg');
      expect(description.classes()).toContain('leading-relaxed');
    });
  });

  describe('Accessibility (NFR-HOME-003)', () => {
    it('should use proper heading hierarchy with h1', () => {
      const wrapper = mount(WelcomeHero);
      const h1 = wrapper.find('h1');

      expect(h1.exists()).toBe(true);
      expect(h1.element.tagName).toBe('H1');
    });

    it('should have sufficient color contrast on text', () => {
      const wrapper = mount(WelcomeHero);
      const title = wrapper.find('h1');
      const description = wrapper.find('p');

      // Verify dark text on light background for contrast
      expect(title.classes()).toContain('text-gray-900');
      expect(description.classes()).toContain('text-gray-700');
    });

    it('should use semantic section element', () => {
      const wrapper = mount(WelcomeHero);

      expect(wrapper.element.tagName).toBe('SECTION');
    });
  });

  describe('Responsive Design (NFR-HOME-002)', () => {
    it('should have responsive text sizes', () => {
      const wrapper = mount(WelcomeHero);
      const title = wrapper.find('h1');
      const description = wrapper.find('p');

      // Check for responsive classes
      expect(title.classes()).toContain('text-4xl'); // Base size
      expect(title.classes()).toContain('sm:text-5xl'); // Larger on sm+ screens
      expect(description.classes()).toContain('text-lg'); // Base size
      expect(description.classes()).toContain('sm:text-xl'); // Larger on sm+ screens
    });

    it('should have responsive padding', () => {
      const wrapper = mount(WelcomeHero);
      const section = wrapper.find('section');

      expect(section.classes()).toContain('px-4'); // Base padding
      expect(section.classes()).toContain('sm:px-6'); // Medium screens
      expect(section.classes()).toContain('lg:px-8'); // Large screens
    });
  });

  describe('Business Requirements', () => {
    it('should implement BR-HOME-001 (welcome message)', () => {
      const wrapper = mount(WelcomeHero);

      // Should display a clear welcome message
      expect(wrapper.find('h1').exists()).toBe(true);
      expect(wrapper.find('h1').text()).toContain('Welcome');
    });

    it('should implement BR-HOME-002 (professional appearance)', () => {
      const wrapper = mount(WelcomeHero);

      // Clean layout with proper spacing and styling
      expect(wrapper.find('section').classes()).toContain('bg-gradient-to-br');
      expect(wrapper.find('h1').classes()).toContain('font-bold');
      expect(wrapper.find('p').classes()).toContain('leading-relaxed');
    });

    it('should implement FR-HOME-003 (mandatory welcome text)', () => {
      const wrapper = mount(WelcomeHero);

      // Welcome message must be displayed prominently
      const title = wrapper.find('h1');
      expect(title.text()).toBeTruthy();
      expect(title.text().length).toBeGreaterThan(0);
    });

    it('should implement FR-HOME-004 (simple language)', () => {
      const wrapper = mount(WelcomeHero);

      // Description should use simple, friendly language
      const description = wrapper.find('p').text();
      expect(description).toBeTruthy();
      // Check that text is readable (not too technical)
      expect(description).toContain('portal');
      expect(description).toContain('access');
    });

    it('should implement FR-HOME-007 (short site description)', () => {
      const wrapper = mount(WelcomeHero);

      // Should include a short paragraph explaining the site
      const description = wrapper.find('p');
      expect(description.exists()).toBe(true);
      expect(description.text().length).toBeGreaterThan(50); // Substantial description
    });

    it('should implement FR-HOME-008 (no sensitive data)', () => {
      const wrapper = mount(WelcomeHero);
      const text = wrapper.text();

      // Verify no IPs, secrets, or sensitive information
      // Check for patterns that might indicate sensitive data
      expect(text).not.toMatch(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/); // No IP addresses
      expect(text).not.toMatch(/password|secret|key|token/i); // No sensitive terms
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty title gracefully', () => {
      const wrapper = mount(WelcomeHero, {
        props: {
          title: '',
        },
      });

      expect(wrapper.find('h1').exists()).toBe(true);
      expect(wrapper.find('h1').text()).toBe('');
    });

    it('should handle empty description gracefully', () => {
      const wrapper = mount(WelcomeHero, {
        props: {
          description: '',
        },
      });

      expect(wrapper.find('p').exists()).toBe(true);
      expect(wrapper.find('p').text()).toBe('');
    });

    it('should handle very long title', () => {
      const longTitle = 'A'.repeat(200);
      const wrapper = mount(WelcomeHero, {
        props: {
          title: longTitle,
        },
      });

      expect(wrapper.find('h1').text()).toBe(longTitle);
    });

    it('should handle very long description', () => {
      const longDescription = 'B'.repeat(1000);
      const wrapper = mount(WelcomeHero, {
        props: {
          description: longDescription,
        },
      });

      expect(wrapper.find('p').text().length).toBe(longDescription.length);
    });
  });
});
