/**
 * Type definitions for helpers.js
 */

/**
 * Cognito domain for authentication
 */
declare const COGNITO_DOMAIN: string;

/**
 * Client ID for Cognito authentication
 */
declare const CLIENT_ID: string;

/**
 * Redirect URI for authentication
 */
declare const REDIRECT_URI: string;

/**
 * Whether the page is loaded in an iframe
 */
declare const isFramed: boolean;

/**
 * Whether the device is mobile
 */
declare const isMobile: boolean;

/**
 * Whether to redirect to profile after login
 */
declare let redirectToProfileAfterLogin: boolean;
