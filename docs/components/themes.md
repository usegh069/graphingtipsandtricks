# Theme Management

This document provides an overview of the theme management system used in the CCPorted platform.

## Overview

The CCPorted platform includes a theme management system that allows users to switch between light and dark themes. This feature enhances user experience by providing visual customization options and reducing eye strain in different lighting conditions.

## Components

The theme management system consists of:

1. **assets/scripts/lightDarkToggle.js**: Core theme switching functionality
2. **assets/styles/**: CSS files with theme-specific styles

## Features

The theme management system provides the following features:

- **Light/Dark Themes**: Support for light and dark color schemes
- **Theme Persistence**: Remembering user theme preference across sessions
- **System Preference Detection**: Ability to follow system theme preference
- **Runtime Switching**: Changing themes without page reload
- **Themed Components**: Consistent theming across all UI components

## Architecture

The theme management system follows a simple architecture:

1. **Theme Toggle**: JavaScript code for switching between themes
2. **CSS Variables**: CSS custom properties for theme-specific values
3. **LocalStorage**: Persistence of theme preference

## Usage

To use the theme system in a page:

1. Initialize the theme toggle
2. Allow users to switch themes
3. Apply theme-specific styles

Example:
```javascript
// Initialize theme toggle
const themeToggle = createThemeToggle();
themeToggle.init();

// Get current theme
const currentTheme = themeToggle.getCurrentTheme();
console.log(`Current theme: ${currentTheme}`);

// Set specific theme
themeToggle.setDarkTheme(); // Switch to dark theme
// or
themeToggle.setLightTheme(); // Switch to light theme

// Toggle between themes
document.querySelector('#theme-toggle-button').addEventListener('click', () => {
  themeToggle.toggleTheme();
});
```

## CSS Implementation

The theme system uses CSS variables for consistent theming:

```css
:root {
  /* Light theme (default) */
  --background-color: #ffffff;
  --text-color: #333333;
  --primary-color: #4a90e2;
  --secondary-color: #f5f5f5;
  --border-color: #e0e0e0;
}

[data-theme="dark"] {
  --background-color: #222222;
  --text-color: #f0f0f0;
  --primary-color: #5a9ff2;
  --secondary-color: #333333;
  --border-color: #444444;
}

body {
  background-color: var(--background-color);
  color: var(--text-color);
}
```

## Theme Toggle Interface

The theme toggle interface is defined as:

```typescript
interface ThemeToggle {
  init(): void;
  setLightTheme(): void;
  setDarkTheme(): void;
  toggleTheme(): void;
  getCurrentTheme(): string;
}
```

## Integration with Other Components

The theme management system integrates with:

- **User Profiles**: To store user theme preferences
- **All UI Components**: To apply consistent theming

## Type Definitions

Type definitions for the theme system can be found in:

- `static/types/lightDarkToggle.d.ts`

This provides detailed type information for the theme management APIs.
