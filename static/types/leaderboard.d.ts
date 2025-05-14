/**
 * Type definitions for assets/scripts/leaderboard.js
 */

/**
 * Leaderboard interface for game scores
 */
interface Leaderboard {
  /**
   * Initialize the leaderboard
   * @param {string} gameId - The ID of the game
   * @returns {Promise<void>} A promise that resolves when initialization is complete
   */
  init(gameId: string): Promise<void>;
  
  /**
   * Submit a score to the leaderboard
   * @param {LeaderboardScore} score - The score to submit
   * @returns {Promise<boolean>} A promise that resolves to true if submitted successfully
   */
  submitScore(score: LeaderboardScore): Promise<boolean>;
  
  /**
   * Get top scores from the leaderboard
   * @param {number} [limit=10] - Maximum number of scores to retrieve
   * @returns {Promise<LeaderboardScore[]>} A promise that resolves to an array of scores
   */
  getTopScores(limit?: number): Promise<LeaderboardScore[]>;
  
  /**
   * Get scores for a specific user
   * @param {string} userId - The user ID to get scores for
   * @returns {Promise<LeaderboardScore[]>} A promise that resolves to an array of scores
   */
  getUserScores(userId: string): Promise<LeaderboardScore[]>;
}

/**
 * Leaderboard score interface
 */
interface LeaderboardScore {
  /** User ID who achieved the score */
  userId: string;
  /** Display name of the user */
  userName: string;
  /** Score value */
  score: number;
  /** Timestamp when the score was achieved */
  timestamp: number;
  /** Additional metadata about the score */
  metadata?: {
    /** Level or stage where score was achieved */
    level?: number;
    /** Time taken to achieve the score (in seconds) */
    timeTaken?: number;
    /** Difficulty level */
    difficulty?: string;
    /** Any other custom properties */
    [key: string]: any;
  };
}
