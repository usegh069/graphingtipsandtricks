/**
 * Type definitions for assets/scripts/stateHandler.js
 */

/**
 * State Handler interface for managing application state
 */
interface StateHandler {
  /**
   * Initialize the state handler
   * @param {StateHandlerOptions} [options] - Configuration options
   * @returns {void}
   */
  init(options?: StateHandlerOptions): void;
  
  /**
   * Get a value from the state
   * @param {string} key - The key to retrieve
   * @returns {any} The value associated with the key
   */
  get(key: string): any;
  
  /**
   * Set a value in the state
   * @param {string} key - The key to set
   * @param {any} value - The value to set
   * @returns {void}
   */
  set(key: string, value: any): void;
  
  /**
   * Subscribe to changes in the state
   * @param {string} key - The key to subscribe to
   * @param {(value: any) => void} callback - Function to call when the value changes
   * @returns {() => void} Unsubscribe function
   */
  subscribe(key: string, callback: (value: any) => void): () => void;
  
  /**
   * Reset the state to initial values
   * @returns {void}
   */
  reset(): void;
}

/**
 * State Handler options
 */
interface StateHandlerOptions {
  /** Initial state values */
  initialState?: Record<string, any>;
  /** Whether to persist state to localStorage */
  persist?: boolean;
  /** Storage key for persistence */
  storageKey?: string;
}
