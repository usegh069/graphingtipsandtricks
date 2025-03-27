/**
 * Type definitions for assets/scripts/cognito_p.js
 */

/**
 * Cognito authentication provider
 */
interface CognitoProvider {
  /**
   * Initialize the Cognito provider
   * @param {CognitoConfig} config - Configuration for Cognito
   * @returns {Promise<void>} A promise that resolves when initialization is complete
   */
  init(config: CognitoConfig): Promise<void>;
  
  /**
   * Sign in a user
   * @param {string} username - The username
   * @param {string} password - The password
   * @returns {Promise<CognitoUser>} A promise that resolves to the signed in user
   */
  signIn(username: string, password: string): Promise<CognitoUser>;
  
  /**
   * Sign out the current user
   * @returns {Promise<void>} A promise that resolves when sign out is complete
   */
  signOut(): Promise<void>;
  
  /**
   * Get the current authenticated user
   * @returns {Promise<CognitoUser|null>} A promise that resolves to the current user or null
   */
  getCurrentUser(): Promise<CognitoUser | null>;
  
  /**
   * Refresh the session tokens
   * @returns {Promise<CognitoTokens>} A promise that resolves to the refreshed tokens
   */
  refreshSession(): Promise<CognitoTokens>;
}

/**
 * Cognito configuration
 */
interface CognitoConfig {
  /** User pool ID */
  userPoolId: string;
  /** Client ID */
  clientId: string;
  /** Identity pool ID */
  identityPoolId?: string;
  /** Region */
  region: string;
}

/**
 * Cognito user
 */
interface CognitoUser {
  /** Username */
  username: string;
  /** User attributes */
  attributes: {
    /** Email */
    email?: string;
    /** Phone number */
    phone_number?: string;
    /** Sub (unique identifier) */
    sub: string;
    /** Custom attributes */
    [key: string]: string | undefined;
  };
  /** Whether the user is authenticated */
  isAuthenticated: boolean;
}

/**
 * Cognito tokens
 */
interface CognitoTokens {
  /** ID token */
  idToken: string;
  /** Access token */
  accessToken: string;
  /** Refresh token */
  refreshToken: string;
  /** Expiration timestamp */
  expiration: number;
}
