# Game Emulation

This document provides an overview of the game emulation system used in the CCPorted platform.

## Overview

The CCPorted platform includes a versatile game emulation system that supports multiple gaming platforms. The emulation system allows users to play classic games directly in their web browser without requiring additional plugins or downloads.

## Supported Platforms

The emulation system supports the following platforms:

- **NES** (Nintendo Entertainment System)
- **SNES** (Super Nintendo Entertainment System)
- **GB/GBC** (Game Boy / Game Boy Color)
- **GBA** (Game Boy Advance)
- **Genesis** (Sega Genesis / Mega Drive)
- **DOS** (MS-DOS games)

## Components

The emulation system consists of several components:

1. **emulator/em.js**: Main emulator interface
2. **emulator/dos/**: DOS-specific emulation files
   - **js-dos.js**: Core DOS emulation
   - **wdosbox.js**: DOSBox emulation wrapper
   - **keys.js**: Keyboard mapping for DOS games
   - **parseConfig.js**: Configuration parser for DOS games

## Emulation Architecture

The emulation system follows a layered architecture:

1. **Core Layer**: Low-level emulation of the target platform's hardware
2. **Wrapper Layer**: JavaScript interface to the core emulation
3. **UI Layer**: User interface controls for the emulator
4. **Integration Layer**: Integration with the CCPorted platform

## Usage

To use the emulator in a game page:

1. Include the appropriate emulator script
2. Initialize the emulator with configuration options
3. Load the ROM file
4. Start the emulation

Example:
```javascript
// Initialize emulator
const emulator = new Emulator({
  containerId: 'game-container',
  type: 'nes',
  audio: { enabled: true, volume: 0.8 },
  video: { scale: 'fit', filter: 'nearest' }
});

// Load ROM and start
emulator.loadRom('path/to/game.nes')
  .then(() => emulator.start())
  .catch(error => console.error('Failed to load ROM:', error));
```

## Input Handling

The emulator supports various input methods:

- **Keyboard**: Mapped to emulated controller buttons
- **Gamepad**: Native support for USB and Bluetooth gamepads
- **Touch Controls**: On-screen controls for mobile devices

Keyboard mappings can be customized through the emulator configuration.

## Save States

The emulation system supports save states, allowing users to save their progress and resume later:

- **saveState()**: Saves the current game state
- **loadState()**: Loads a previously saved game state

Save states are stored in the browser's localStorage or in the user's profile if they are logged in.

## Performance Considerations

The emulation system is optimized for performance:

- WebAssembly is used for core emulation when available
- Audio and video processing are optimized for web browsers
- Emulation speed can be adjusted based on device capabilities

## Type Definitions

Type definitions for the emulation system can be found in:

- `static/types/emulator.d.ts`

This provides detailed type information for the emulation APIs.
