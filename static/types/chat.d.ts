/**
 * Type definitions for assets/scripts/chat.js
 */

/**
 * Chat interface for user communication
 */
interface Chat {
  /**
   * Initialize the chat system
   * @param {string} roomId - The ID of the chat room to join
   * @param {string} userId - The ID of the current user
   * @returns {Promise<void>} A promise that resolves when initialization is complete
   */
  init(roomId: string, userId: string): Promise<void>;
  
  /**
   * Send a message to the chat
   * @param {string} message - The message text to send
   * @param {ChatMessageOptions} [options] - Optional message settings
   * @returns {Promise<boolean>} A promise that resolves to true if sent successfully
   */
  sendMessage(message: string, options?: ChatMessageOptions): Promise<boolean>;
  
  /**
   * Subscribe to new messages
   * @param {(message: ChatMessage) => void} callback - Function to call when new messages arrive
   * @returns {() => void} Unsubscribe function
   */
  subscribeToMessages(callback: (message: ChatMessage) => void): () => void;
}

/**
 * Chat message interface
 */
interface ChatMessage {
  /** Unique ID of the message */
  id: string;
  /** ID of the user who sent the message */
  userId: string;
  /** Display name of the user */
  userName: string;
  /** Content of the message */
  content: string;
  /** Timestamp when the message was sent */
  timestamp: number;
  /** Whether the message is from the system */
  isSystem?: boolean;
}

/**
 * Options for sending chat messages
 */
interface ChatMessageOptions {
  /** Whether the message is private */
  isPrivate?: boolean;
  /** Target user ID for private messages */
  targetUserId?: string;
  /** Whether to include the user's avatar */
  includeAvatar?: boolean;
}
