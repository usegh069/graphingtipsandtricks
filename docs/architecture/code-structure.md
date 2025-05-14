# Code Structure

This document provides an overview of the code structure in the CCPorted project.

## Directory Structure

The project follows a modular structure with the following main directories:

```
ccported.github.io/
├── static/                  # Main directory for static files
│   ├── assets/              # Assets including scripts, styles, and images
│   │   ├── scripts/         # JavaScript modules for various features
│   │   ├── styles/          # CSS files
│   │   └── images/          # Image assets
│   ├── emulator/            # Emulator-related code
│   │   └── dos/             # DOS emulator specific code
│   ├── chat/                # Chat system files
│   ├── login/               # Login system files
│   ├── signup/              # Signup system files
│   ├── profile/             # User profile system files
│   ├── roms/                # ROM-related utilities
│   ├── testgames/           # Test games for development
│   ├── types/               # TypeScript declaration files
│   ├── big_game_script.js   # Main game script
│   └── service-worker.js    # Service worker for offline support
├── dist/                    # Compiled TypeScript output
└── docs/                    # Documentation files
```

## Key Files

### Core Files

- `static/big_game_script.js`: The main script that handles game initialization and core functionality
- `static/service-worker.js`: Service worker for offline support and performance optimization
- `static/index.html`: Main entry point for the website

### Script Modules

The `static/assets/scripts/` directory contains modular JavaScript files for various features:

- `achievement_tracker.js`: Tracks user achievements
- `adblockdetect.js`: Detects ad blockers
- `adblockhandler.js`: Handles ad blocker detection
- `chat.js`: Chat functionality
- `cognito_p.js`: Amazon Cognito authentication
- `helpers.js`: Utility functions
- `leaderboard.js`: Leaderboard functionality
- `lightDarkToggle.js`: Theme switching
- `login.js`: User login
- `navigation.js`: Site navigation
- `profile.js`: User profile management
- `signup.js`: User registration
- `stateHandler.js`: State management
- `weather.js`: Weather information

### Emulator Files

The `static/emulator/` directory contains files related to game emulation:

- `em.js`: Main emulator interface
- `dos/`: DOS emulator files
  - `js-dos.js`: DOS emulation core
  - `keys.js`: Keyboard mapping
  - `parseConfig.js`: Configuration parser
  - `script.js`: Main DOS emulator script

## Type Definitions

TypeScript declaration files (`.d.ts`) have been added to provide type information for all JavaScript files. These are located in the `static/types/` directory and include:

- `global.d.ts`: Global type definitions
- `big_game_script.d.ts`: Types for the main game script
- `service-worker.d.ts`: Types for the service worker
- And type definitions for all other JavaScript modules

## Module Dependencies

The codebase has the following high-level dependencies:

1. **Core System**: `big_game_script.js` and `service-worker.js`
2. **Authentication**: `cognito_p.js`, `login.js`, `signup.js`
3. **User Features**: `profile.js`, `achievement_tracker.js`, `leaderboard.js`
4. **UI Components**: `lightDarkToggle.js`, `navigation.js`
5. **Game Emulation**: `emulator/em.js` and related files
6. **Utilities**: `helpers.js`, `stateHandler.js`, `weather.js`

Most modules depend on `helpers.js` for common utility functions and `stateHandler.js` for state management.
