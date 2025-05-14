/**
 * Type definitions for assets/scripts/adblockdetect.js
 */

/**
 * Detects if an ad blocker is active on the page
 * @returns {Promise<boolean>} A promise that resolves to true if an ad blocker is detected
 */
declare function detectAdBlocker(): Promise<boolean>;

/**
 * Event fired when ad blocker detection is complete
 */
interface AdBlockDetectedEvent extends CustomEvent<{
  /** Whether an ad blocker was detected */
  detected: boolean;
}> {
  /** Type of the event */
  type: 'adBlockerDetected';
}

/**
 * Dispatches an event when ad blocker detection is complete
 * @param {boolean} detected - Whether an ad blocker was detected
 */
declare function dispatchAdBlockDetectedEvent(detected: boolean): void;
