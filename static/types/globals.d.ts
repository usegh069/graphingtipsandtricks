


/**
 * Represents the ccPorted interface, which provides methods and properties
 * for interacting with a configuration, user management, AWS services, and 
 * file operations.
 */
interface ccPorted {
    /**
     * Whether or not the cards have been rendered on the home page.
     */
    cardsRendered: boolean;

    /**
     * Whether the dynamoDB requests have been blocked or not.
     */
    serverBlocked: boolean;

    /**
     * Are the cards in the process of being rendered, without clicks being tracked.
     */
    baseRendering: boolean;

    /**
     * Are ads enabled on this page (takes in account aHost, ad blockers, and page width)
     */
    adsEnabled: boolean;

    /**
     * A valid game server index and server string, that all requests should be sent to.
     */
    gameServer: {
        index: number;
        server: string;
    };
    /**
     * List of hostnames that ccPorted can run ads on
     */
    aHosts?: string[]
    /**
     * The configuration object for the ccPorted instance.
     */
    config: CCPortedConfig;

    /**
     * Optional statistics related to the ccPorted instance.
     */
    stats?: Stats;

    /**
     * The identity provider used for authentication.
     */
    identityProvider: any;

    /**
     * Indicates whether AWS services are ready to be used.
     */
    awsReady?: boolean;

    /**
     * AWS-related services or configurations.
     */
    AWS?: any;

    /**
     * The AWS S3 client instance.
     */
    s3Client?: any;

    /**
     * The AWS DocumentClient instance for DynamoDB operations.
     */
    documentClient?: any;

    /**
     * The currently authenticated user, or null if no user is authenticated.
     */
    user?: User | null;

    /**
     * Retrieves the currently authenticated user.
     * @returns A promise that resolves to the authenticated user or null.
     */
    getUser: () => Promise<User | null>;

    /**
     * Retrieves the tokens associated with the authenticated user.
     * @returns A promise that resolves to the user's tokens or null.
     */
    getuserTokens: () => Promise<UserTokensPotential | null>;

    /**
     * Downloads a file from the specified key.
     * @param key - The key of the file to download.
     * @returns A promise that resolves to the downloaded file.
     */
    downloadFile: (key: string) => Promise<any>;

    /**
     * Uploads a file to the specified key with optional custom parameters.
     * @param file - The file to upload.
     * @param key - The key where the file will be stored.
     * @param customparams - Additional parameters for the upload.
     * @returns A promise that resolves to the upload result.
     */
    uploadFile: (file: any, key: string, customparams: Object) => Promise<any>;

    /**
     * Updates the attributes of the authenticated user.
     * @param attributes - A key-value map of attributes to update.
     * @returns A promise that resolves to the update result.
     */
    updateUser: (attributes: { [key: string]: string }) => Promise<any>;

    /**
     * Queries a database or service with the specified parameters.
     * @param params - Either an array of query parameters or an object.
     * @returns A promise that resolves to the query result.
     */
    query: (...params: [partitionKeyName: string, partitionKey: string, tableName: string, otherData: Object] | Object) => Promise<any>;

    /**
     * A promise that resolves to the authenticated user or null.
     */
    userPromise: Promise<User | null>;
}

/**
 * @interface User
 * 
 * Represents a user object with various attributes and metadata.
 * 
 * @property {string} at_hash - A hash of the access token.
 * @property {{ [key: string]: string }} attributes - A key-value map of user attributes.
 * @property {string} aud - The audience for which the token is intended.
 * @property {number} auth_time - The time the user was authenticated, in seconds since the epoch.
 * @property {string[]} "cognito:groups" - The groups the user belongs to in Cognito.
 * @property {string} "cognito:preferred_role" - The preferred role assigned to the user in Cognito.
 * @property {string[]} "cognito:roles" - The roles assigned to the user in Cognito.
 * @property {string} "cognito:username" - The username of the user in Cognito.
 * @property {string} email - The email address of the user.
 * @property {boolean} email_verified - Indicates whether the user's email address has been verified.
 * @property {string} event_id - The unique identifier for the event.
 * @property {number} exp - The expiration time of the token, in seconds since the epoch.
 * @property {number} iat - The time the token was issued, in seconds since the epoch.
 * @property {string} iss - The issuer of the token.
 * @property {string} jti - The unique identifier for the token.
 * @property {string} origin_jti - The unique identifier for the originating token.
 * @property {string} sub - The subject of the token, typically the user ID.
 * @property {string} token_use - Indicates the intended use of the token (e.g., "access" or "id").
 */
interface User { 
    at_hash: string;
    attributes: { [key: string]: string };
    aud: string;
    auth_time: number;
    "cognito:groups": string[];
    "cognito:preferred_role": string;
    "cognito:roles": string[];
    "cognito:username": string;
    email: string;
    email_verified: boolean;
    event_id: string;
    exp: number;
    iat: number;
    iss: string;
    jti: string;
    origin_jti: string;
    sub: string;
    token_use: string;
}

/**
 * @interface Game
 * 
 * Defines the structure of a game object in the ccPorted system.
 * 
 * @property {string} gameID - The unique identifier for the game.
 * @property {number} clicks - The number of clicks the game has received.
 * @property {string} data - The url to the game's data.json file (do not use this. All of the data in the file is present in the row, and the file may not exist, or be in a different url).
 * @property {string} description - The description of the game.
 * @property {string} fName - The friendly name of the game
 * @property {boolean} isOnline - Whether the game should be shown on the home page or not.
 * @property {boolean} isProxy - Is the game designed to be a proxy for another game.
 * @property {string?} proxiedPath - The path to the game that this game is a proxy for.
 * @property {string[]} tags - The tags associated with the game.
 * @property {string} thumbPath - The path to the game's thumbnail image.
 */

interface Game {
    gameID: string;
    clicks: number;
    data: string;
    description: string;
    fName: string;
    isOnline: boolean;
    isProxy: boolean;
    proxiedPath?: string;
    tags: string[];
    thumbPath: string;
}

/**
 * @interface TrackingData
 * 
 * Defines the structure of tracking data for a user.
 * Stores the playtime for each game, the number of chat messages sent, and the pages visited.
 */
interface TrackingData {
    games: {
        [gameID: string]: {
            paytime: number; 
        }
    };
    chat_messages_sent: number;
    pages_visited: {
        [page: string]: {
            count: number;
        };
    }
}