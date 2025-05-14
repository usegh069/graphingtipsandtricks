# Leaderboards

This document provides an overview of the leaderboard system used in the CCPorted platform.

## Overview

The CCPorted platform includes a leaderboard system that tracks and displays high scores for games. The leaderboard system allows users to compete with each other and see their ranking across different games.

## Components

The leaderboard system consists of several components:

1. **assets/scripts/leaderboard.js**: Core leaderboard functionality
2. **testgames/test-leaderboard-bz/game.js**: Example implementation
3. **testgames/test-tetris-leaderboard/tetris.js**: Another example implementation

## Features

The leaderboard system provides the following features:

- **Global Leaderboards**: Overall high scores across all users
- **Game-specific Leaderboards**: High scores for individual games
- **User Rankings**: Individual user rankings
- **Time-based Filtering**: Daily, weekly, monthly, and all-time leaderboards
- **Score Submission**: Secure submission of new scores
- **Score Verification**: Basic verification to prevent cheating

## Architecture

The leaderboard system follows a client-server architecture:

1. **Client-side**: JavaScript code for displaying and submitting scores
2. **Server-side**: Backend services for score storage and retrieval
3. **API**: RESTful API for leaderboard operations

## Usage

To use the leaderboard system in a game:

1. Initialize the leaderboard with the game ID
2. Display leaderboard data
3. Submit new scores when the game ends

Example:
```javascript
// Initialize leaderboard
const leaderboard = new Leaderboard();
leaderboard.init('tetris')
  .then(() => console.log('Leaderboard initialized'))
  .catch(error => console.error('Failed to initialize leaderboard:', error));

// Get top scores
leaderboard.getTopScores(10)
  .then(scores => {
    // Display scores in UI
    scores.forEach((score, index) => {
      console.log(`${index + 1}. ${score.userName}: ${score.score}`);
    });
  })
  .catch(error => console.error('Failed to get top scores:', error));

// Submit a new score
leaderboard.submitScore({
  userId: currentUser.id,
  userName: currentUser.displayName,
  score: 1000,
  timestamp: Date.now(),
  metadata: {
    level: 10,
    timeTaken: 120,
    difficulty: 'hard'
  }
})
  .then(success => {
    if (success) {
      console.log('Score submitted successfully');
    } else {
      console.error('Failed to submit score');
    }
  })
  .catch(error => console.error('Error submitting score:', error));
```

## Score Format

Leaderboard scores have the following format:

```typescript
interface LeaderboardScore {
  userId: string;     // User ID who achieved the score
  userName: string;   // Display name of the user
  score: number;      // Score value
  timestamp: number;  // Timestamp when the score was achieved
  metadata?: {        // Additional metadata about the score
    level?: number;   // Level or stage where score was achieved
    timeTaken?: number; // Time taken to achieve the score (in seconds)
    difficulty?: string; // Difficulty level
    [key: string]: any; // Any other custom properties
  };
}
```

## Security Considerations

The leaderboard system implements several security measures:

- **Score Validation**: Basic validation to prevent impossible scores
- **User Authentication**: Only authenticated users can submit scores
- **Rate Limiting**: Prevention of score submission flooding
- **Server-side Verification**: Additional verification on the server

## Integration with Other Components

The leaderboard system integrates with:

- **Authentication System**: To identify users
- **User Profiles**: To display user information
- **Game System**: To associate scores with specific games

## Type Definitions

Type definitions for the leaderboard system can be found in:

- `static/types/leaderboard.d.ts`

This provides detailed type information for the leaderboard APIs.
