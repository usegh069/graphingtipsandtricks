/**
 * Type definitions for assets/scripts/lightDarkToggle.js
 */

/**
 * Theme toggle interface for switching between light and dark modes
 */
interface ThemeToggle {
  /**
   * Initialize the theme toggle
   * @returns {void}
   */
  init(): void;
  
  /**
   * Switch to light theme
   * @returns {void}
   */
  setLightTheme(): void;
  
  /**
   * Switch to dark theme
   * @returns {void}
   */
  setDarkTheme(): void;
  
  /**
   * Toggle between light and dark themes
   * @returns {void}
   */
  toggleTheme(): void;
  
  /**
   * Get the current theme
   * @returns {string} The current theme ('light' or 'dark')
   */
  getCurrentTheme(): string;
}

/**
 * Creates and returns a ThemeToggle instance
 * @returns {ThemeToggle} The theme toggle instance
 */
declare function createThemeToggle(): ThemeToggle;
