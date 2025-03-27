# Design Patterns

This document outlines the key design patterns used in the CCPorted codebase.

## Module Pattern

The codebase extensively uses the JavaScript module pattern to encapsulate functionality and avoid polluting the global namespace. Most features are implemented as self-contained modules with clear interfaces.

Example:
```javascript
// Module pattern implementation
window.ccPorted = window.ccPorted || {};
(() => {
  // Private variables and functions
  const privateVar = 'private';
  
  function privateFunction() {
    // Implementation
  }
  
  // Public API
  window.ccPorted.someFeature = {
    publicMethod: function() {
      // Implementation using privateFunction
    }
  };
})();
```

## Namespace Pattern

The `window.ccPorted` object serves as a namespace for the application, containing various components and utilities. This helps organize the code and prevents naming conflicts.

Example:
```javascript
window.ccPorted = window.ccPorted || {};
window.ccPorted.config = window.ccPorted.config || {};
window.ccPorted.config.stateSyncEnabled = false;
```

## Observer Pattern

The observer pattern is used for event handling and state management. Components can subscribe to events or state changes and react accordingly.

Example in `stateHandler.js`:
```javascript
function subscribe(key, callback) {
  // Add callback to subscribers list
  // Return unsubscribe function
}
```

## Factory Pattern

Factory functions are used to create instances of components with proper initialization.

Example:
```javascript
function createAdBlockHandler() {
  // Create and return an instance of AdBlockHandler
  return {
    init: function() { /* ... */ },
    showNotification: function() { /* ... */ },
    handleResponse: function(response) { /* ... */ }
  };
}
```

## Singleton Pattern

Some components are implemented as singletons to ensure only one instance exists throughout the application.

Example:
```javascript
window.ccPorted.stateHandler = (function() {
  // Private state
  let instance;
  
  function createInstance() {
    // Create the singleton instance
    return {
      // Public methods
    };
  }
  
  return {
    getInstance: function() {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    }
  };
})();
```

## Promise-based Async Pattern

Asynchronous operations are handled using Promises for better readability and error handling.

Example:
```javascript
function loadProfile(userId) {
  return new Promise((resolve, reject) => {
    // Async operation
    fetch(`/api/profile/${userId}`)
      .then(response => response.json())
      .then(data => resolve(data))
      .catch(error => reject(error));
  });
}
```

## Service Worker Pattern

The application uses a service worker for offline support, caching, and performance optimization.

Example in `service-worker.js`:
```javascript
self.addEventListener('fetch', async (event) => {
  // Handle fetch events
});
```

## Event Delegation

Event delegation is used to handle events efficiently, especially for dynamically created elements.

Example:
```javascript
document.querySelector('.container').addEventListener('click', (event) => {
  if (event.target.matches('.button')) {
    // Handle button click
  }
});
```

## Responsive Design Pattern

The UI components follow responsive design patterns to ensure proper display across different device sizes.

## Type Annotation Pattern

With the addition of TypeScript declaration files, the codebase now follows a type annotation pattern where JavaScript files remain as-is, but type information is provided through separate `.d.ts` files.
