# Project Overview

## Introduction to CCPorted

CCPorted is a web platform that provides access to a collection of games. The platform includes features for user authentication, game emulation, chat functionality, leaderboards, and more. This documentation provides detailed information about the codebase and its components.

## Key Features

- **Game Emulation**: Support for various game platforms including NES, SNES, GB, GBA, Genesis, and DOS
- **User Authentication**: Secure login and registration using Amazon Cognito
- **User Profiles**: Personalized user profiles with game history and achievements
- **Leaderboards**: Global and game-specific leaderboards for tracking high scores
- **Chat System**: Real-time chat functionality for user communication
- **Theme Switching**: Support for light and dark themes
- **Weather Integration**: Weather information display
- **Ad Block Detection**: Detection and handling of ad blockers
- **Service Worker**: Offline support and performance optimization

## Technology Stack

The CCPorted platform is built using the following technologies:

- **Frontend**: HTML, CSS, JavaScript (with TypeScript type annotations)
- **Authentication**: Amazon Cognito
- **Emulation**: Custom emulation engines for various gaming platforms
- **Build Tools**: TypeScript compiler, npm scripts
- **Documentation**: JSDoc, GitBook

## Repository Structure

The repository is organized as follows:

- `/static`: Contains all static assets and JavaScript files
  - `/static/assets`: Images, styles, and scripts
  - `/static/emulator`: Emulator-related code
  - `/static/chat`: Chat system code
  - `/static/login`, `/static/signup`, `/static/profile`: User management code
- `/docs`: Documentation files
- `/dist`: Compiled TypeScript output (generated during build)

## Getting Started

To get started with the CCPorted codebase, refer to the [Installation](installation.md) and [Development Setup](development-setup.md) guides.
