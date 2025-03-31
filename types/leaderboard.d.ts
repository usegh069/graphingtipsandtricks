declare class Leaderboard {
    /**
     * @property {string} gameID - The ID of the game
     * @property {Array<{ score: number; id: string; display_name: string; rank?: number }>} cached - Cached leaderboard scores
     * @property {boolean} loading - Indicates whether scores are being loaded
     * @property {boolean} needsRefresh - Flags whether the leaderboard needs a refresh
     * @property {number} score - The current score
     * @property {number | undefined} guestScore - Optional guest score
     */
    gameID: string;
    cached: Array<{ score: number; id: string; display_name: string; rank?: number }>;
    loading: boolean;
    needsRefresh: boolean;
    score: number;
    guestScore?: number;

    /**
     * @method constructor
     * @param {string} gameID - The ID of the game
     */
    constructor(gameID: string);

    /**
     * @method loadScores
     * @returns {Promise<Array<{ score: number; id: string; display_name: string; rank?: number }>>} A promise that resolves to an array of leaderboard entries.
     */
    loadScores(): Promise<Array<{ score: number; id: string; display_name: string; rank?: number }>>;
    
    /**
     * @method addGuestScore
     * @param {number} score - The score to be added
     */
    addGuestScore(score: number): void;
    
    /**
     * @method formatScore
     * @param {number} score - The score to format
     * @returns {string} The formatted score string
     */
    formatScore(score: number): string;
    
    /**
     * @method addScore
     * @param {number} score - The score to be added
     * @returns {Promise<void>} A promise that resolves once the score is updated
     */
    addScore(score: number): Promise<void>;
    
    /**
     * @method clearCache
     */
    clearCache(): void;
}
