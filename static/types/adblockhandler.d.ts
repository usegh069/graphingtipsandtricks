/**
 * Type definitions for assets/scripts/adblockhandler.js
 */

/**
 * Handles actions when an ad blocker is detected
 */
interface AdBlockHandler {
  /**
   * Initialize the ad block handler
   * @returns {void}
   */
  init(): void;
  
  /**
   * Show a notification to the user about ad blocker detection
   * @returns {void}
   */
  showNotification(): void;
  
  /**
   * Handle user response to the ad blocker notification
   * @param {string} response - The user's response ('dismiss', 'whitelist', etc.)
   * @returns {Promise<boolean>} A promise that resolves to true if handled successfully
   */
  handleResponse(response: string): Promise<boolean>;
}

/**
 * Creates and returns an AdBlockHandler instance
 * @returns {AdBlockHandler} The ad block handler instance
 */
declare function createAdBlockHandler(): AdBlockHandler;
