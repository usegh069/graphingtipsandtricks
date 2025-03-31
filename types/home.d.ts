/**
 * @interface SortState
 * 
 * Represents a state of sorting for the cards on the home page.
 * 
 * @property {() => HTMLElement} sortFunc - The sorting function to apply to the cards.
 * @property {string} name - The name of the sorting state.
 */
interface SortState {
    sortFunc: () => HTMLElement;
    name: string;
}

/**
 * @interface SortStates
 * 
 * Represents a collection of sorting states for the cards on the home page.
 */
interface SortStates {
    [key: number]: SortState;
}

/**
 * @function importGames
 * 
 * Imports the games from the DynamoDB database.
 * 
 * @returns {Promise<Object>} The games JSON object.
 */
declare async function importGames(): Promise<{ games: Game[] }>;

/**
 * @function adsEnabled
 * 
 * Checks to see if ads are enabled. Checks if the page is on an aHost, if the page width is greater than 768px, and if an ad blocker is not present.
 * 
 */
declare async function adsEnabled(): Promise<boolean>;

/**
 * @function importJSON
 * 
 * Imports a JSON file from a given path.
 * 
 * @param {string} path - The path of the JSON file to import.
 * @returns {Promise<Object>} The imported JSON data.
 */
declare async function importJSON(path: string): Promise<Object>;


/**
 * @function testOpenServers
 * 
 * Tests game distribution servers and returns a random open one.
 * 
 * @returns {Promise<[string, number]>} The server string and index of the open server (Index derived from the line number - 1 in servers.txt).
 */
declare async function testOpenServers(): Promise<[string, number]>;


/**
 * @function baseRender
 * 
 * Renders the cards to the home page if the clicks count is inaccessible.
 * 
 * @param {Game[]} gamesJSON - The games JSON object to render.
 */
declare async function baseRender(gamesJSON: Game[]): Promise<void>;


/**
 * @function checkForSwitchToAHost
 * 
 * Checks to see if one the the aHosts is the current host. If not, it checks to see if any of them are open (responding), and redirects the user to one of the open ones.
 * Due to some bugs and inconsitencies in blocking software, currently just returns undefined.
 * 
 * @returns {Promise<void>}
 */
declare async function checkForSwitchToAHost(): Promise<void>;

/**
 * @function init
 * 
 * Initializes everything.
 * 
 * @returns {Promise<void|undefined>} - Why on earth are you asking for a return value?
 */
declare async function init(): Promise<void|undefined>;


/**
 * @function incrementClicks
 * 
 * Increments the clicks for a game in the database.
 * 
 * @param {string} gameID - The ID of the game to increment the clicks for.
 */
declare async function incrementClicks(gameID: string): Promise<void>;


/**
 * @function sortCardsByClicks
 * 
 * Sorts the cards by the number of clicks.
 * 
 * @param {(cards: HTMLElement[]) => HTMLElement} middleWare - A function that takes in an array of cards and returns a sorted array of cards. Runs after initial sorting.
 */
declare async function sortCardsByClicks(middleWare: (cards: HTMLElement[]) => HTMLElement[]): void;

/**
 * @function input
 * 
 * Called every time the search box is typed into. Searches through the cards. If no cards return from the search, it will search the ROMs.
 * 
 * @param {number} sortState - The state of sorting to apply to the cards.
 */
declare async function input(sortState: number): Promise<void>;

/**
 * @function testRomSearch
 * 
 * Searches through the ROM files for a query and returns the results
 * 
 * @param {string} query - The query to search for.
 * @returns {Promise<[string, string, string][]>} The results of the search.
 */
declare async function testRomSearch(query: string): Promise<[url: string, name: string, platform: string][]>;

/**
 * @function pickRandomCard
 * 
 * @returns {HTMLElement} A random card element.
 */
declare  function pickRandomCard(): HTMLElement;


/**
 * @function sortCardsRandomly
 * 
 * Sorts the cards randomly.
 * 
 * @param {(cards: HTMLElement[]) => HTMLElement[]} middelWare - A function that takes in an array of cards and returns a sorted array of cards. Runs after initial sorting.
 */
declare  function sortCardsRandomly(middelWare: (cards: HTMLElement[]) => HTMLElement[]): void;

/**
 * @function hideAds
 * 
 * Hides the ads on the page.
 */
declare  function hideAds(): void;


/**
 * @function openSearch
 * 
 * Focuses the search bar.
 */
declare  function openSearch(): void;

/**
 * @function checkGameSeen
 * 
 * Checks if a game has been seen before and applies highlighting if not.
 * 
 * @param {string} game - The game object to check if seen.
 * @param {HTMLElement} card - The HTMLElement of the card to check if seen. (Will apply highlighting if not seen)
 */
declare  function checkGameSeen(game: Game, card: HTMLElement): void;

/**
 * @function normalize
 * 
 * Normalizes a string by removing special characters and converting to lowercase.
 * Used for search functionality.
 * 
 * @param {string} text - The text to normalize.
 * @returns {string} - The normalized text.
 */
declare  function normalize(text: string): string;

/**
 * @function sortCardsAlphabetically
 * 
 * Sorts the cards alphabetically.
 * 
 * @param {-1|1} direction - The direction to sort the cards in. (-1 for descending, 1 for ascending)
 * @param {(cards: HTMLElement[]) => HTMLElement[] }middleWare 
 */
declare  function sortCardsAlphabetically(direction: -1|1, middleWare: (cards: HTMLElement[]) => HTMLElement[]): void;

/**
 * @function compareAlphabetically
 * 
 * Compares two strings alphabetically.
 * 
 * @param {string} a - The first string to compare.
 * @param {string} b - The second string to compare
 * @returns {number} - The comparison result (-1 if a < b, 0 if a === b, 1 if a > b)
 */

declare  function compareAlphabetically(a: string, b: string): number;


/**
 * @function setSort
 * 
 * Applies a sort, where sortState is the index of the sort in the sortStates object.
 * 
 * @param {number} sortState - The state of sorting to apply to the cards.
 */
declare  function setSort(sortState: number): void;


/**
 * @function shuffleAds
 * 
 * Shuffles the in-stream ads.
 */
declare  function shuffleAds(): void;

/**
 * @function removeCards
 * 
 * Removes all the cards from the page.
 */
declare  function removeCards(): void;

/**
 * @function buildCard
 * 
 * Builds a game card from the specified game object.
 * 
 * @param {Game} game - The game object to build a card for.
 * @returns {HTMLElement} - The card element.
 */
declare  function buildCard(game: Game): HTMLElement;


/**
 * @function togglePin
 * 
 * Toggles the pin state of a card.
 * 
 * @param {HTMLElement} card - The card to toggle the pin state of.
 * @param {HTMLElement} star - The star element to toggle the class of.
 */
declare  function togglePin(card: HTMLElement, star: HTMLElement): void;

/**
 * @function savePinnedState
 * 
 * Saves the pinned state of a card.
 * 
 * @param {string} cardId - The ID of the card to save the pinned state of.
 * @param {boolean} isPinned - The pinned state of the card.
 */
declare  function savePinnedState(cardId: string, isPinned: boolean): void;

/**
 * @function getPinnedCards
 * 
 * Returns the IDs of all of the pinned cards from localStorage
 * 
 * @returns {string[]} - The IDs of the pinned cards.
 */
declare  function getPinnedCards(): string[];

/**
 * @function loadPinnedStates
 * 
 * Loads the pinned states of the cards from localStorage.
 * Gets all of the pinned cards and applies the pinned class to them.
 */
declare  function loadPinnedStates(): void;

/**
 * @function sortPinnedCards
 * 
 * Sorts the pinned cards to the top of the page.
 */
declare  function sortPinnedCards(): void;

/**
 * @function rerenderCards
 * 
 * Rerenders the cards based on the layout.
 * 
 * @param {"rows"|"grid"} layout - The layout to render the cards in.
 */
declare  function rerenderCards(layout: "rows"|"grid"): void;

/**
 * @function rerenderAds
 * 
 * Rerenders the ads on the page. Lowk not sure what this does or how it is implemented, go read line 832 or smth...
 */
declare  function rerenderAds(): void;