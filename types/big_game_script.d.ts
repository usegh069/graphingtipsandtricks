/**
 * Type definitions for big_game_script.js
 */

/**
 * Checks if the page is loaded within an iframe
 * @returns {boolean} True if the page is in an iframe, false otherwise
 */
declare function pageInIframe(): boolean;

/**
 * Processes a string to prevent XSS attacks
 * @param {string|null|undefined} str - The string to process
 * @returns {string} The processed string
 */
declare function treat(str: string | null | undefined): string;

/**
 * Cognito domain for authentication
 */
declare const COGNITO_DOMAIN: string;

/**
 * Client ID for Cognito authentication
 */
declare const CLIENT_ID: string;

/**
 * Redirect URI for authentication
 */
declare const REDIRECT_URI: string;

/**
 * Game ID extracted from URL or window object
 */
declare const tGameID: string;

/**
 * Link element created for the page
 */
declare const link: HTMLLinkElement;

/**
 * Current script element
 */
declare const script: HTMLScriptElement;

/**
 * Whether the popup has been seen before
 */
declare const seenPopup: boolean;

/**
 * Whether the page is loaded in an iframe
 */
declare const framed: boolean;

/**
 * Location of the game
 */
declare const glocation: string;

/**
 * Regular expression to extract game ID from path
 */
declare const gameIDExtractRG: RegExp;

/**
 * Result of extracting game ID from path
 */
declare const gameIDExtract: RegExpExecArray | null;

/**
 * Origin of the parent frame
 */
declare const parentOrigin: string | null;

/**
 * ID of the current game
 */
declare const gameID: string;

/**
 * Interval for tracking game progress
 */
declare let trackingInterval: number | null;

/**
 * Timestamp of the last update
 */
declare let lastUpdate: number;

/**
 * Whether the system is waiting for credentials
 */
declare let waitingForCreds: boolean;
