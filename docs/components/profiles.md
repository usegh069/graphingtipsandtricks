# User Profiles

This document provides an overview of the user profile system used in the CCPorted platform.

## Overview

The CCPorted platform includes a comprehensive user profile system that allows users to manage their personal information, view their game history, track achievements, and customize their experience.

## Components

The user profile system consists of several components:

1. **assets/scripts/profile.js**: Core profile functionality
2. **profile/**: Directory containing profile-related files
3. **assets/scripts/achievement_tracker.js**: Achievement tracking integration

## Features

The user profile system provides the following features:

- **Profile Information**: Display and edit user information
- **Game History**: Track games played and time spent
- **Achievements**: Display earned achievements
- **Preferences**: User-specific settings and preferences
- **Avatar Management**: Upload and manage profile pictures
- **Stats and Analytics**: User activity statistics

## Architecture

The user profile system follows a client-server architecture:

1. **Client-side**: JavaScript code for UI and profile management
2. **Server-side**: Backend services for profile storage and retrieval
3. **API**: RESTful API for profile operations

## Usage

To use the profile system in a page:

1. Initialize the profile system
2. Load user profile data
3. Display or update profile information

Example:
```javascript
// Initialize profile
const profile = new Profile();
profile.init()
  .then(() => console.log('Profile system initialized'))
  .catch(error => console.error('Failed to initialize profile system:', error));

// Load user profile
profile.loadProfile(currentUser.id)
  .then(userProfile => {
    // Display profile in UI
    console.log(`User: ${userProfile.displayName}`);
    console.log(`Joined: ${new Date(userProfile.joinDate).toLocaleDateString()}`);
    console.log(`Bio: ${userProfile.bio || 'No bio provided'}`);
  })
  .catch(error => console.error('Failed to load profile:', error));

// Update profile
profile.updateProfile({
  displayName: 'New Display Name',
  bio: 'This is my updated bio',
  preferences: {
    theme: 'dark',
    notifications: true
  }
})
  .then(success => {
    if (success) {
      console.log('Profile updated successfully');
    } else {
      console.error('Failed to update profile');
    }
  })
  .catch(error => console.error('Error updating profile:', error));
```

## Profile Format

User profiles have the following format:

```typescript
interface UserProfile {
  userId: string;           // User ID
  displayName: string;      // Display name
  avatarUrl?: string;       // Avatar URL
  bio?: string;             // Bio or about text
  preferences?: {           // User preferences
    theme?: 'light' | 'dark' | 'system';  // Theme preference
    notifications?: boolean;  // Notification settings
    [key: string]: any;     // Other preferences
  };
  joinDate: number;         // Join date
  lastActive: number;       // Last active date
}
```

## Profile Statistics

The profile system also tracks various statistics:

```typescript
interface ProfileStats {
  gamesPlayed: number;      // Total games played
  achievements: number;     // Total achievements earned
  highScores: Record<string, number>;  // High scores by game
  totalPlayTime: number;    // Total play time in minutes
  favoriteGames: Array<{    // Favorite games
    id: string;             // Game ID
    name: string;           // Game name
    playCount: number;      // Play count
  }>;
}
```

## Security Considerations

The profile system implements several security measures:

- **Data Validation**: Validation of profile data
- **User Authentication**: Only authenticated users can access profiles
- **Permission Checking**: Users can only edit their own profiles
- **Content Sanitization**: Prevention of XSS attacks

## Integration with Other Components

The profile system integrates with:

- **Authentication System**: To identify users
- **Achievement Tracker**: To display user achievements
- **Leaderboard**: To display user rankings
- **Theme System**: To apply user theme preferences

## Type Definitions

Type definitions for the profile system can be found in:

- `static/types/profile.d.ts`

This provides detailed type information for the profile APIs.
