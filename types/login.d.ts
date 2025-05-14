/**
 * Type definitions for assets/scripts/login.js
 */

/**
 * Login interface for user authentication
 */
interface Login {
  /**
   * Initialize the login system
   * @returns {void}
   */
  init(): void;
  
  /**
   * Perform login with username and password
   * @param {string} username - The username
   * @param {string} password - The password
   * @returns {Promise<LoginResult>} A promise that resolves to the login result
   */
  login(username: string, password: string): Promise<LoginResult>;
  
  /**
   * Perform logout
   * @returns {Promise<boolean>} A promise that resolves to true if logout was successful
   */
  logout(): Promise<boolean>;
  
  /**
   * Check if user is currently logged in
   * @returns {Promise<boolean>} A promise that resolves to true if user is logged in
   */
  isLoggedIn(): Promise<boolean>;
  
  /**
   * Get current user information
   * @returns {Promise<UserInfo|null>} A promise that resolves to user info or null if not logged in
   */
  getCurrentUser(): Promise<UserInfo|null>;
}

/**
 * Login result interface
 */
interface LoginResult {
  /** Whether login was successful */
  success: boolean;
  /** User information if login was successful */
  user?: UserInfo;
  /** Error message if login failed */
  error?: string;
  /** Authentication tokens if login was successful */
  tokens?: {
    /** ID token */
    idToken: string;
    /** Access token */
    accessToken: string;
    /** Refresh token */
    refreshToken: string;
  };
}

/**
 * User information interface
 */
interface UserInfo {
  /** User ID */
  id: string;
  /** Username */
  username: string;
  /** Email address */
  email?: string;
  /** User attributes */
  attributes?: Record<string, string>;
}
