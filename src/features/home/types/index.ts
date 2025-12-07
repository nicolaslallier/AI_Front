/**
 * Type definitions for the home feature
 *
 * Defines the structure of quick-access items displayed on the welcome page
 */

/**
 * Represents a quick-access card item for navigation to console sections
 *
 * @interface QuickAccessItem
 * @property {string} id - Unique identifier for the item
 * @property {string} title - Display title of the console/section
 * @property {string} description - Brief description of the console's purpose (1-2 lines)
 * @property {string} path - Router path to navigate to when clicked
 * @property {string} icon - Icon representation (emoji or class name)
 * @property {string[]} [requiredRoles] - Optional array of roles required to view this item
 */
export interface QuickAccessItem {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: string;
  requiredRoles?: string[];
}

/**
 * Type guard to check if an object is a valid QuickAccessItem
 *
 * @param value - Value to check
 * @returns True if value is a valid QuickAccessItem
 */
export function isQuickAccessItem(value: unknown): value is QuickAccessItem {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const item = value as Record<string, unknown>;

  return (
    typeof item.id === 'string' &&
    typeof item.title === 'string' &&
    typeof item.description === 'string' &&
    typeof item.path === 'string' &&
    typeof item.icon === 'string' &&
    (item.requiredRoles === undefined || Array.isArray(item.requiredRoles))
  );
}
