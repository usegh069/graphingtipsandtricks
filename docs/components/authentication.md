# Authentication

This document provides an overview of the authentication system used in the CCPorted platform.

## Overview

The CCPorted platform uses Amazon Cognito for user authentication. This provides secure user management with features like:

- User registration and confirmation
- User login and session management
- Password reset functionality
- Token-based authentication
- Multi-factor authentication support

## Components

The authentication system consists of several components:

1. **cognito_p.js**: Core integration with Amazon Cognito
2. **login.js**: Login functionality
3. **signup.js**: User registration
4. **helpers.js**: Authentication helper functions

## Authentication Flow

### Registration Flow

1. User enters registration details (username, email, password)
2. The system calls Cognito to create a new user
3. Cognito sends a verification code to the user's email
4. User enters the verification code to confirm their account
5. Upon successful confirmation, the user can log in

### Login Flow

1. User enters login credentials (username/email and password)
2. The system authenticates with Cognito
3. Upon successful authentication, Cognito returns tokens (ID, access, refresh)
4. The tokens are stored securely for subsequent requests
5. The user is redirected to the appropriate page

### Token Refresh

1. Access tokens expire after a configured time
2. The system uses the refresh token to obtain new access tokens
3. If the refresh token is invalid or expired, the user is prompted to log in again

## Configuration

The authentication system is configured with the following parameters:

```javascript
const COGNITO_DOMAIN = "https://us-west-2lg1qptg2n.auth.us-west-2.amazoncognito.com";
const CLIENT_ID = "4d6esoka62s46lo4d398o3sqpi";
const REDIRECT_URI = window.location.origin;
```

## Security Considerations

- Tokens are stored securely and not exposed to third-party scripts
- HTTPS is used for all authentication requests
- Passwords are never stored in the application
- Session timeout is implemented for security

## Integration with Other Components

The authentication system integrates with:

- **Profile System**: To load and display user profile information
- **Leaderboard**: To associate scores with authenticated users
- **Achievement Tracker**: To track achievements for authenticated users

## Type Definitions

Type definitions for the authentication components can be found in:

- `static/types/cognito_p.d.ts`
- `static/types/login.d.ts`
- `static/types/signup.d.ts`

These provide detailed type information for the authentication APIs.
