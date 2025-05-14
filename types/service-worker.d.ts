/**
 * Type definitions for service-worker.js
 */

/**
 * Service Worker self reference
 */
interface ServiceWorkerGlobalScope {
  /**
   * Adds an event listener to the service worker
   * @param {string} event - The event type to listen for
   * @param {Function} callback - The callback function to execute
   */
  addEventListener(event: string, callback: (event: any) => void): void;
  
  /**
   * Skip waiting and become active immediately
   * @returns {Promise<void>} A promise that resolves when the operation is complete
   */
  skipWaiting(): Promise<void>;
  
  /**
   * Clients interface for controlling service worker clients
   */
  clients: {
    /**
     * Claim control over all clients
     * @returns {Promise<void>} A promise that resolves when the operation is complete
     */
    claim(): Promise<void>;
  };
}

/**
 * Service Worker self reference
 */
declare const self: ServiceWorkerGlobalScope;

/**
 * Install event for service worker
 */
interface InstallEvent extends Event {
  /**
   * Wait until a promise is resolved
   * @param {Promise<any>} promise - The promise to wait for
   */
  waitUntil(promise: Promise<any>): void;
}

/**
 * Activate event for service worker
 */
interface ActivateEvent extends Event {
  /**
   * Wait until a promise is resolved
   * @param {Promise<any>} promise - The promise to wait for
   */
  waitUntil(promise: Promise<any>): void;
}

/**
 * Fetch event for service worker
 */
interface FetchEvent extends Event {
  /**
   * The request being made
   */
  request: Request;
  
  /**
   * The client ID making the request
   */
  clientId: string;
  
  /**
   * Wait until a promise is resolved
   * @param {Promise<any>} promise - The promise to wait for
   */
  waitUntil(promise: Promise<any>): void;
}

/**
 * Request interface for fetch events
 */
interface Request {
  /**
   * Clone the request
   * @returns {Request} A clone of the request
   */
  clone(): Request;
  
  /**
   * Headers for the request
   */
  headers: Headers;
}

/**
 * Headers interface for requests
 */
interface Headers {
  /**
   * Get entries from headers
   * @returns {IterableIterator<[string, string]>} Iterator of header entries
   */
  entries(): IterableIterator<[string, string]>;
}
