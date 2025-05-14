/**
 * Type definitions for emulator/em.js
 */

/**
 * Emulator interface for running game emulation
 */
interface Emulator {
  /**
   * Initialize the emulator
   * @param {EmulatorOptions} options - Configuration options
   * @returns {Promise<boolean>} A promise that resolves to true if initialization was successful
   */
  init(options: EmulatorOptions): Promise<boolean>;
  
  /**
   * Load a ROM file
   * @param {string} romUrl - URL of the ROM file to load
   * @returns {Promise<boolean>} A promise that resolves to true if loading was successful
   */
  loadRom(romUrl: string): Promise<boolean>;
  
  /**
   * Start the emulator
   * @returns {Promise<void>} A promise that resolves when the emulator has started
   */
  start(): Promise<void>;
  
  /**
   * Pause the emulator
   * @returns {void}
   */
  pause(): void;
  
  /**
   * Resume the emulator after pausing
   * @returns {void}
   */
  resume(): void;
  
  /**
   * Reset the emulator
   * @returns {void}
   */
  reset(): void;
  
  /**
   * Save the current state
   * @param {number} [slot=0] - Save slot number
   * @returns {Promise<boolean>} A promise that resolves to true if saving was successful
   */
  saveState(slot?: number): Promise<boolean>;
  
  /**
   * Load a saved state
   * @param {number} [slot=0] - Save slot number
   * @returns {Promise<boolean>} A promise that resolves to true if loading was successful
   */
  loadState(slot?: number): Promise<boolean>;
}

/**
 * Emulator options interface
 */
interface EmulatorOptions {
  /** Container element ID */
  containerId: string;
  /** Emulator type */
  type: 'nes' | 'snes' | 'gb' | 'gba' | 'genesis' | 'dos';
  /** Path to emulator core */
  corePath?: string;
  /** Input configuration */
  inputConfig?: {
    /** Keyboard mapping */
    keyboard?: Record<string, string>;
    /** Gamepad mapping */
    gamepad?: Record<string, number>;
  };
  /** Audio settings */
  audio?: {
    /** Whether audio is enabled */
    enabled: boolean;
    /** Volume level (0-1) */
    volume: number;
  };
  /** Video settings */
  video?: {
    /** Scaling mode */
    scale: 'original' | 'fit' | 'stretch';
    /** Filter mode */
    filter: 'nearest' | 'linear';
  };
}
