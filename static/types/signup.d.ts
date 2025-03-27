/**
 * Type definitions for assets/scripts/signup.js
 */

/**
 * Signup interface for user registration
 */
interface Signup {
  /**
   * Initialize the signup system
   * @returns {Promise<void>} A promise that resolves when initialization is complete
   */
  init(): Promise<void>;
  
  /**
   * Register a new user
   * @param {SignupData} signupData - The signup data
   * @returns {Promise<SignupResult>} A promise that resolves to the signup result
   */
  register(signupData: SignupData): Promise<SignupResult>;
  
  /**
   * Confirm user registration with verification code
   * @param {string} username - The username
   * @param {string} code - The verification code
   * @returns {Promise<boolean>} A promise that resolves to true if confirmation was successful
   */
  confirmRegistration(username: string, code: string): Promise<boolean>;
  
  /**
   * Resend verification code
   * @param {string} username - The username
   * @returns {Promise<boolean>} A promise that resolves to true if code was sent successfully
   */
  resendVerificationCode(username: string): Promise<boolean>;
}

/**
 * Signup data interface
 */
interface SignupData {
  /** Username */
  username: string;
  /** Password */
  password: string;
  /** Email address */
  email: string;
  /** Phone number (optional) */
  phoneNumber?: string;
  /** Additional attributes */
  attributes?: Record<string, string>;
}

/**
 * Signup result interface
 */
interface SignupResult {
  /** Whether signup was successful */
  success: boolean;
  /** User information if signup was successful */
  user?: {
    /** Username */
    username: string;
    /** User ID */
    userId?: string;
  };
  /** Error message if signup failed */
  error?: string;
  /** Whether confirmation is required */
  confirmationRequired?: boolean;
}
