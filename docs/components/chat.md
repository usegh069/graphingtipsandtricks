# Chat System

This document provides an overview of the chat system used in the CCPorted platform.

## Overview

The CCPorted platform includes a real-time chat system that allows users to communicate with each other while playing games. The chat system supports both public chat rooms and private messaging.

## Components

The chat system consists of several components:

1. **chat.js**: Core chat functionality
2. **chat/**: Directory containing chat-related files
3. **assets/scripts/chat.js**: Chat UI integration

## Features

The chat system provides the following features:

- **Real-time Messaging**: Messages are delivered in real-time
- **Chat Rooms**: Support for multiple chat rooms
- **Private Messaging**: Direct messaging between users
- **User Presence**: Indication of online users
- **Message History**: Access to previous messages
- **Moderation**: Basic moderation features for chat rooms

## Architecture

The chat system follows a client-server architecture:

1. **Client-side**: JavaScript code for UI and message handling
2. **Server-side**: Backend services for message routing and storage
3. **WebSocket**: Real-time communication between client and server

## Usage

To use the chat system in a page:

1. Initialize the chat system with configuration options
2. Connect to a chat room
3. Send and receive messages

Example:
```javascript
// Initialize chat
const chat = new Chat({
  roomId: 'game-lobby',
  userId: currentUser.id,
  userName: currentUser.displayName
});

// Connect to chat
chat.init()
  .then(() => console.log('Chat connected'))
  .catch(error => console.error('Failed to connect to chat:', error));

// Send a message
chat.sendMessage('Hello, world!')
  .then(() => console.log('Message sent'))
  .catch(error => console.error('Failed to send message:', error));

// Subscribe to new messages
const unsubscribe = chat.subscribeToMessages(message => {
  console.log(`${message.userName}: ${message.content}`);
});
```

## Message Format

Chat messages have the following format:

```typescript
interface ChatMessage {
  id: string;         // Unique message ID
  userId: string;     // ID of the sender
  userName: string;   // Display name of the sender
  content: string;    // Message content
  timestamp: number;  // Timestamp when the message was sent
  isSystem?: boolean; // Whether the message is from the system
}
```

## Security Considerations

The chat system implements several security measures:

- **Message Filtering**: Filtering of inappropriate content
- **Rate Limiting**: Prevention of message flooding
- **User Authentication**: Only authenticated users can send messages
- **Content Sanitization**: Prevention of XSS attacks

## Integration with Other Components

The chat system integrates with:

- **Authentication System**: To identify users
- **User Profiles**: To display user information
- **Game System**: To create game-specific chat rooms

## Type Definitions

Type definitions for the chat system can be found in:

- `static/types/chat.d.ts`

This provides detailed type information for the chat APIs.
