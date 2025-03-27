/**
 * Global type definitions for the ccported.github.io project
 */

/**
 * Global ccPorted namespace
 */
interface CCPortedNamespace {
  /** Game ID for the current game */
  gameID?: string;
  /** Configuration settings */
  config?: {
    /** Whether state synchronization is enabled */
    stateSyncEnabled?: boolean;
    [key: string]: any;
  };
  [key: string]: any;
}

/**
 * Window interface augmentation
 */
interface Window {
  /** ccPorted namespace */
  ccPorted: CCPortedNamespace;
  /** Game ID for the current game */
  gameID?: string;
  /** Location object */
  location: Location;
  /** Top window reference */
  top: Window;
  /** Local storage */
  localStorage: Storage;
  /** Current script */
  currentScript: HTMLScriptElement;
  /** Add event listener function */
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
  /** Origin of the window */
  origin: string;
}

/**
 * Document interface augmentation
 */
interface Document {
  /** Location object */
  location: Location;
  /** Create element function */
  createElement(tagName: string): HTMLElement;
  /** Query selector function */
  querySelector(selectors: string): HTMLElement | null;
  /** Query selector all function */
  querySelectorAll(selectors: string): NodeListOf<HTMLElement>;
  /** Location ancestor origins */
  location: {
    ancestorOrigins: {
      length: number;
      [index: number]: string;
    };
    [key: string]: any;
  };
}

/**
 * HTMLElement interface augmentation
 */
interface HTMLElement {
  /** Text content of the element */
  textContent: string | null;
  /** Add event listener function */
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
}

/**
 * URL constructor
 */
declare class URL {
  constructor(url: string, base?: string | URL);
  /** Origin of the URL */
  origin: string;
}

/**
 * Navigator interface augmentation
 */
interface Navigator {
  /** User agent string */
  userAgent: string;
}

/**
 * Storage interface augmentation
 */
interface Storage {
  /** Get item function */
  getItem(key: string): string | null;
  /** Set item function */
  setItem(key: string, value: string): void;
}

/**
 * Date interface augmentation
 */
interface Date {
  /** Get current timestamp */
  now(): number;
}
