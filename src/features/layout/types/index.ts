/**
 * Navigation item interface
 * Represents a single navigation menu item
 */
export interface NavigationItem {
  /**
   * Unique identifier for the navigation item
   */
  id: string;

  /**
   * Display label for the navigation item
   */
  label: string;

  /**
   * Route path for the navigation item
   */
  path: string;

  /**
   * Optional icon class or name for the navigation item
   */
  icon?: string;

  /**
   * Whether the navigation item is active/visible
   * @default true
   */
  visible?: boolean;

  /**
   * Optional external link flag
   * @default false
   */
  external?: boolean;
}

/**
 * Navigation configuration interface
 * Contains all navigation items for the application
 */
export interface NavigationConfig {
  /**
   * Array of navigation items
   */
  items: NavigationItem[];
}
