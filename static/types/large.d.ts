declare class Stats {
    /**
     * @property {boolean} isOpen - Whether the stats menu is open or not.
     * @property {number} initTime - The time the stats menu was initialized.
     * @property {boolean} isDragging - Whether the user is dragging the stats menu or not.
     * @property {boolean} ableToDrag - Whether the user is able to drag the stats menu or not.
     * @property {boolean} interceptRequests - Whether the user is intercepting requests or not.
     * @property {HTMLElement} dom - The DOM element for the stats menu.
     * @property {boolean} workerLoaded - Whether the service worker is loaded or not.
     * @property {Object} contentBeforeLoad - The content to add before the DOM is loaded.
     * @property {Object} contentBeforeLoad.logs - The logs to add before the DOM is loaded.
     * @property {Object} contentBeforeLoad.requestsIntercepted - The requests intercepted to add before the DOM is loaded.
     * @property {Object} customUpdates - The custom updates to add to the stats menu.
     * @property {Function} customUpdates.logs - The function to call when the logs are updated.
     * @property {Function} customUpdates.requestsIntercepted - The function to call when the requests intercepted are updated.
     * @property {number} mouseX - The X position of the mouse.
     * @property {number} mouseY - The Y position of the mouse.
     * @property {HTMLElement} objectHovering - The object the mouse is hovering over.
     */
    isOpen: boolean;
    initTime: number;
    isDragging: boolean;
    ableToDrag: boolean;
    interceptRequests: boolean;
    dom: HTMLElement;
    workerLoaded: boolean;
    contentBeforeLoad: {
        logs: string[];
        requestsIntercepted: string[];
    }
    customUpdates: {
        logs: (content: string) => void;
        requestsIntercepted: (content: string) => void;
    }
    mouseX: number;
    mouseY: number;
    objectHovering: HTMLElement;


    /**
     * @constructor
     * 
     * Initializes the Stats object, otherwise known as the CTRL+Q menu.
     * It shows relevant stats about the page, such as memory usage, CPU usage,
     * and user information.
     */
    constructor();
    /**
     * @method ensureRequestInterceptionOff
     * 
     * Ensures that the request interception is turned off.
     * It does this by making sure that the service worker is unregisted.
     */
    ensureRequestInterceptionOff(): void;
    /**
     * @method tick
     * 
     * Updates the stats every 100ms, only if the menu is open. (isOpen)
     */
    tick(): void;
    /**
     * @method open
     * 
     * Opens the stats menu.
     * Sets the dom element to be display "flex", and starts tick();
     */
    open(): void;

    /**
     * @method close
     * 
     * Closes the stats menu.
     * Sets the dom element to be display "none".
     */
    close(): void;
    /**
     * @method generateDom
     * 
     * Generates the DOM element for the stats menu.
     */
    generateDom(): [HTMLElement];
    /**
     * @method timeAge
     * 
     * Converts a timestamp to a human-readable format.
     * 
     * @param {number} time - A timestamp, in milliseconds.
     * @returns A string representing the time in a human-readable format.
     */
    timeAge(time: number): string;
    /**
     * @method formatTracking
     * 
     * Converts tracking data into a DOM element
     * 
     * @param {TrackingData} trackingData - The tracking information to format.
     */
    formatTracking(trackingData: TrackingData): string;

    /**
     * @method renderTableFromJSON
     * 
     * Converts a JSON object into a table.
     * Two columns are created, one for the key and one for the value.
     * 
     * @param {Object} json - The JSON to render as a table
     * @returns A HTMLTableElement representing the JSON object.
     */
    renderTableFromJSON(json: Object): HTMLTableElement;
    /**
     * @method formatInformation
     * 
     * Converts information into a DOM element.
     * If the information is JSON, it formats it as beautified JSON.
     * 
     * @param {string} information - The information to format.
     * @returns A HTMLPreElement representing the information.
     */
    formatInformation(information: string): HTMLPreElement;
    /**
     * @method buildRequest
     * 
     * Builds a request object into a DOM element.
     * 
     * @param {Request} request - The request to build.
     * @returns A promise -> HTMLDetailsElement representing the request.
     */
    async buildRequest(request: Request): Promise<HTMLDetailsElement>;
    /**
     * @method finishRequest
     * 
     * Updates the provided detailsContext with the request information.
     * 
     * @param {Request} request - The finished/completed request to update the detailsContext with.
     * @param {HTMLDetailsElement} detailsContext - The details context to update. 
     */
    async finishRequest(request: Request, detailsContext: HTMLDetailsElement): Promise<void>;
    /**
     * @method contextualize
     * 
     * Checks for the ID in the provided context, and returns the element with that ID.
     * If no element is found, it checks for one in the document.
     * @param {string} id - The ID of the element to find.
     * @param {HTMLElement} context - The context to search in.
     * @returns The element with the ID, or the element in the document. 
     */
    contextualize(id: string, context: HTMLElement): HTMLElement;
    /**
     * @method formatRequest
     * 
     * Formats the request into an HTML string.
     * Checks to see if the request has started or finished, and formats it accordingly.
     * (Either using buildRequest or finishRequest)
     * 
     * @param request - The request to format.
     * @returns A promise that resolves to a string of HTML.
     */
    async formatRequest(request: Request): Promise<string>;
    /**
     * @method getMouse
     * @returns A tuple of the mouse position (x, y).
     */
    getMouse(): [number, number];
    /**
     * @method setupRequestInterception
     * 
     * Sets up the request interception for the stats menu.
     * It does this by checking if requestInterception is enabled, and if so, it sets up the service worker.
     */
    setupRequestInterception(): void;
    /**
     * @method update
     * 
     * Updates the stats menu.
     */
    update(): void;
    /**
     * @method getMemoryUsage
     * 
     * @returns A string representing the memory usage of the page (in "XXX MB").
     */
    getMemoryUsage(): string;
    /**
     * @method getCpuUsage
     * 
     * @returns A string representing the CPU usage of the page (in "XXX ms").
     */
    getCpuUsage(): string;

    /**
     * @method log
     * 
     * Logs a message to the log element.
     * 
     * @param message - The message to log.
     * @param {string|Error|Array|Object} message - The message to log.
     */
    log(...message: string|Error|Array|Object): void;

}

/**
 * @function createGameStorageSandbox
 * 
 * Sandboxes all game storage operations, such as localStorage and indexedDB to their own ID namespace.
 * This way, multiple games on the same domain with conflicting keys can not interfere with each other.
 * 
 * @param gameID - The gameID of the game to reference when performaing any storage operations.
 */
declare  function createGameStorageSandbox(gameID: string): () => void;

/**
 * @function toggleStats
 * 
 * Toggles the stats menu on and off.
 */
declare  function toggleStats(): void;

/**
 * @function setupTracking
 * 
 * Sets up the tracking for the page.
 * Calls updateTracking every 5 minutes.
 * Increases the current page view count by 1.
 */
declare  function setupTracking(): void;

/**
 * @function cleanupTracking
 * 
 * Cleans up the tracking for the page.
 * If there is trackingData, it sends it to the server.
 * It also clears the interval for updateTracking.
 */
declare  function cleanupTracking(): void;

/**
 * @function treat
 * 
 * Removes "." and replaces it with "-".
 * 
 * @param {string} text - The text to treat.
 * @returns {string|null} - The treated text. Null if no text is provided.
 */
declare  function treat(text: string): string|null;

/**
 * @function setDeepValue
 * 
 * @param {Object} obj - The object to set the value in.
 * @param {string} path - The path to set the value at.
 * @param {any} value - The value to set.
 * @returns {Object} - The object with the value set.
 */
declare  function setDeepValue(obj: Object, path: string, value: any): Object;

/**
 * @function getDeepValue
 * 
 * @param {Object} obj - The object to get the value from.
 * @param {string} path - The path to get the value from.
 * @returns {any} - The value at the path.
 */
declare  function getDeepValue(obj: Object, path: string): any;

/**
 * @function saveTrackingData
 * 
 * Saves the tracking data to the server. (By delegating to ccPorted.updateUser)
 */
declare  function saveTrackingData(): void;

/**
 * @function updateTracking
 * 
 * @param {string} attributePath - The path to the attribute to update.
 * @param {any} value - The value to set the attribute to.
 */
declare async  function updateTracking(attributePath: string, value: any): Promise<void>;

/**
 * @function trackingTick
 * 
 * Updates the tracking data every 5 minutes.
 * Calls updateTracking and updates playtime counts.
 * It then saves the tracking data to the server.
 */
declare async  function trackingTick(): Promise<void>;

/**
 * @function handleUserLoggedIn
 * 
 * If the user exists, it stores the user tracking data in memory (as window.ccPorted.trackingData)
 * It then calls setupTracking()
 */
declare async  function handleUserLoggedIn(): Promise<void>;

/**
 * @function decamelize
 * 
 * Converts a camelCase string to a human-readable string.
 * "camelCase" -> "Camel Case"
 * 
 * @param {string} str - The string to decamelize.
 * @returns {string} - The decamelized string.
 */
declare  function decamelize(str: string): string;

/**
 * @function init
 * 
 * If the user is logged in, calls handleUserLoggedIn()
 * If the user promise exists and the user is not logged it, it waits for the promise to resolve and tries again
 */
declare async  function init(): Promise<void>;