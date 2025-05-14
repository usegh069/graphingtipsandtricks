/**
 * Type definitions for assets/scripts/profile.js
 */

/**
 * Profile interface for user profile management
 */
interface Profile {
  /**
   * Initialize the profile system
   * @returns {Promise<void>} A promise that resolves when initialization is complete
   */
  init(): Promise<void>;
  
  /**
   * Load user profile data
   * @param {string} userId - The user ID to load profile for
   * @returns {Promise<UserProfile>} A promise that resolves to the user profile
   */
  loadProfile(userId: string): Promise<UserProfile>;
  
  /**
   * Update user profile data
   * @param {Partial<UserProfile>} profileData - The profile data to update
   * @returns {Promise<boolean>} A promise that resolves to true if update was successful
   */
  updateProfile(profileData: Partial<UserProfile>): Promise<boolean>;
  
  /**
   * Get profile statistics
   * @returns {Promise<ProfileStats>} A promise that resolves to profile statistics
   */
  getProfileStats(): Promise<ProfileStats>;
}

/**
 * User profile interface
 */
interface UserProfile {
  /** User ID */
  userId: string;
  /** Display name */
  displayName: string;
  /** Avatar URL */
  avatarUrl?: string;
  /** Bio or about text */
  bio?: string;
  /** User preferences */
  preferences?: {
    /** Theme preference */
    theme?: 'light' | 'dark' | 'system';
    /** Notification settings */
    notifications?: boolean;
    /** Other preferences */
    [key: string]: any;
  };
  /** Join date */
  joinDate: number;
  /** Last active date */
  lastActive: number;
}

/**
 * Profile statistics interface
 */
interface ProfileStats {
  /** Total games played */
  gamesPlayed: number;
  /** Total achievements earned */
  achievements: number;
  /** High scores by game */
  highScores: Record<string, number>;
  /** Total play time in minutes */
  totalPlayTime: number;
  /** Favorite games */
  favoriteGames: Array<{
    /** Game ID */
    id: string;
    /** Game name */
    name: string;
    /** Play count */
    playCount: number;
  }>;
}
