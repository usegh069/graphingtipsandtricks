

/**
 * @interface CCPortedConfig
 * 
 * Configuration options for CCPorted.
 *
 * @property stateSyncEnabled - Optional. Determines whether state synchronization is enabled.
 *                              Defaults to `false` if not specified.
 */
interface CCPortedConfig {
    stateSyncEnabled?: boolean;
}

/**
 * @interface UserTokens
 * 
 * Represents the authentication tokens associated with a user.
 * These tokens are typically used for accessing protected resources
 * and maintaining user sessions.
 * 
 * @property {string} accessToken - An access token used for authentication.
 * @property {string} idToken - An ID token that may contain user identity information.
 * @property {string} refreshToken - A refresh token used to obtain new access tokens.
 */
interface UserTokens {
    accessToken: string;
    idToken: string;
    refreshToken: string;
}

/**
 * @interface UserTokensPotential
 * 
 * Represents a potential set of user tokens that may be available.
 * Each token is optional and can be undefined.
 *
 * @property accessToken - An optional access token used for authentication.
 * @property idToken - An optional ID token that may contain user identity information.
 * @property refreshToken - An optional refresh token used to obtain new access tokens.
 */
interface UserTokensPotential {
    accessToken?: string;
    idToken?: string;
    refreshToken?: string;
}


/**
 * @interface NotificationPopupData
 * 
 * Represents the data structure for a notification popup.
 * This interface defines the properties required to configure
 * and display a notification popup with optional actions and links.
 *
 * @property {number} [autoClose] - Optional duration (in milliseconds) after which the popup will automatically close.
 * @property {string} message - The main message to be displayed in the notification popup.
 * @property {{ text: string, link: string }} [cta] - Optional call-to-action button with text and a link.
 * @property {[actionName: string, actionFunction: Function, color: string][]} [actions] - 
 * An optional array of actions, where each action is represented as a tuple containing:
 * - `actionName`: The name of the action.
 * - `actionFunction`: The function to execute when the action is triggered.
 * - `color`: The color associated with the action (e.g., for styling purposes).
 * @property {string} [fullLink] - An optional full link to be associated with the notification popup.
 */
interface NotificationPopupData {
    autoClose?: number;
    message: string;
    cta?: { text: string, link: string };
    actions?: [actionName: string, actionFunction: Function, color: string][];
    fullLink?: string;
}


/**
 * @function log
 * 
 * Logs the provided arguments to the console.
 * 
 * @param args - The arguments to log.
 */
declare function log(...args: any[]): void;

/**
 * @function shuffle
 * 
 * Shuffles the elements of an array in random order.
 * @param array - The array to shuffle.
 * @returns A new array with the elements shuffled.
 */
declare function shuffle(array: any[]): any[];

/**
 * @function shortcut
 * 
 * Registers a keyboard shortcut and its associated callback function.
 * 
 * @param keys - An array of key strings representing the shortcut.
 * @param callback - The function to execute when the shortcut is triggered.
 */
function shortcut(keys: string[], callback: Function): void;

/**
 * 
 * @function decamelize
 * 
 * Converts a camelCase string into a decamelized string with spaces or underscores.
 * @param str - The camelCase string to decamelize.
 * @returns The decamelized string.
 */
function decamelize(str: string): string;

/**
 * 
 * @function createNotif
 * 
 * Creates a notification popup with the provided data.
 * @param popupData - The data for the notification popup.
 */
declare function createNotif(popupData: NotificationPopupData): void;

/**
 * 
 * @function refreshAWSCredentials
 * 
 * Refreshes AWS credentials.
 * @returns A promise that resolves when the credentials are refreshed.
 */
declare function refreshAWSCredentials(): Promise<void>;

/**
 * 
 * @function parseJwt
 * 
 * Parses a JSON Web Token (JWT) and extracts the user information.
 * @param token - The JWT to parse.
 * @returns The user information extracted from the token.
 */
declare function parseJwt(token: string): User;

/**
 * 
 * @function isTokenExpired
 * 
 * Checks if a token is expired based on its data.
 * @param tokenData - The data of the token to check.
 * @returns True if the token is expired, otherwise false.
 */
declare function isTokenExpired(tokenData: any): boolean;

/**
 * 
 * @function importJSOn
 * 
 * Imports a JSON file from a given URL.
 * @param url - The URL of the JSON file to import.
 * @returns A promise that resolves to the imported JSON data.
 */
declare function importJSON(url: string): Promise<any>;

/**
 * 
 * @function initializeUnauthenticated
 * 
 * Initializes the application in an unauthenticated state. Provides all AWS operations the ccported_unauthenticated role.
 * @returns A promise that resolves to null when initialization is complete.
 */
declare async function initializeUnauthenticated(): Promise<null>;

/**
 * 
 * @function initializeAuthenticated
 * 
 * Initializes the application in an authenticated state using the provided tokens. Gives the looged in user the ccported_authenticated role.
 * @param idToken - The ID token for authentication.
 * @param accessToken - The access token for authentication.
 * @param refreshToken - The refresh token for authentication.
 * @returns A promise that resolves to the authenticated user.
 */
declare async function initializeAuthenticated(idToken: string, accessToken: string, refreshToken: string): Promise<User>;

/**
 * 
 * @function initializeAWS
 * 
 * Initializes AWS services.
 * @returns A promise that resolves to undefined or null when initialization is complete.
 */
declare async function initializeAWS(): Promise<undefined | null>;

/**
 * 
 * @function exchangeAuthCodeForTokens
 * 
 * Exchanges an authorization code for user tokens.
 * @param authCode - The authorization code to exchange.
 * @returns A promise that resolves to the user tokens or null if the exchange fails.
 */
declare async function exchangeAuthCodeForTokens(authCode: string): Promise<UserTokens | null>;

/**
 * 
 * @function refreshTokens
 * 
 * Refreshes user tokens using the provided refresh token.
 * @param refreshToken - The refresh token to use for refreshing tokens.
 * @returns A promise that resolves to the refreshed user tokens or null if the refresh fails.
 */
declare async function refreshTokens(refreshToken: string): Promise<UserTokens | null>;


