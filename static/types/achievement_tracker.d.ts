/**
 * Type definitions for assets/scripts/achievement_tracker.js
 */

/**
 * Achievement Tracker interface
 * Tracks user achievements and progress
 */
interface AchievementTracker {
  /**
   * Initialize the achievement tracker
   * @param {string} userId - The user ID to track achievements for
   * @returns {Promise<void>} A promise that resolves when initialization is complete
   */
  init(userId: string): Promise<void>;
  
  /**
   * Track a new achievement
   * @param {string} achievementId - The ID of the achievement
   * @param {number} progress - The progress value (0-100)
   * @returns {Promise<boolean>} A promise that resolves to true if successful
   */
  trackAchievement(achievementId: string, progress: number): Promise<boolean>;
  
  /**
   * Get all achievements for the current user
   * @returns {Promise<Achievement[]>} A promise that resolves to an array of achievements
   */
  getAchievements(): Promise<Achievement[]>;
}

/**
 * Achievement interface
 */
interface Achievement {
  /** ID of the achievement */
  id: string;
  /** Name of the achievement */
  name: string;
  /** Description of the achievement */
  description: string;
  /** Current progress (0-100) */
  progress: number;
  /** Whether the achievement is completed */
  completed: boolean;
  /** Timestamp when the achievement was earned */
  earnedAt?: number;
}
