/**
 * Type definitions for assets/scripts/navigation.js
 */

/**
 * Navigation interface for site navigation
 */
interface Navigation {
  /**
   * Initialize the navigation
   * @returns {void}
   */
  init(): void;
  
  /**
   * Navigate to a specific page
   * @param {string} path - The path to navigate to
   * @param {NavigationOptions} [options] - Navigation options
   * @returns {boolean} Whether navigation was successful
   */
  navigateTo(path: string, options?: NavigationOptions): boolean;
  
  /**
   * Handle back navigation
   * @returns {void}
   */
  handleBack(): void;
  
  /**
   * Update navigation state
   * @param {string} currentPath - The current path
   * @returns {void}
   */
  updateState(currentPath: string): void;
}

/**
 * Navigation options
 */
interface NavigationOptions {
  /** Whether to replace the current history entry */
  replace?: boolean;
  /** State object to associate with the history entry */
  state?: any;
  /** Whether to trigger a page reload */
  reload?: boolean;
}
