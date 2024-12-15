shortcut([17, 81], toggleStats);

function createGameStorageSandbox(gameId = "ccported") {
    // Create a unique namespace for this game
    const namespace = `ns_${gameId}`;

    // Save original storage APIs
    const originalLocalStorage = window.localStorage;
    const originalIndexedDB = window.indexedDB;

    // Create localStorage proxy
    const localStorageProxy = {
        setItem: function(key, value) {
            return originalLocalStorage.setItem(`${namespace}_${key}`, value);
        },
        getItem: function(key) {
            return originalLocalStorage.getItem(`${namespace}_${key}`);
        },
        removeItem: function(key) {
            return originalLocalStorage.removeItem(`${namespace}_${key}`);
        },
        clear: function() {
            // Only clear items for this game
            for (let i = originalLocalStorage.length - 1; i >= 0; i--) {
                const key = originalLocalStorage.key(i);
                if (key.startsWith(`${namespace}_`)) {
                    originalLocalStorage.removeItem(key);
                }
            }
        },
        key: function(index) {
            // Get all keys for this game
            const gameKeys = [];
            for (let i = 0; i < originalLocalStorage.length; i++) {
                const key = originalLocalStorage.key(i);
                if (key.startsWith(`${namespace}_`)) {
                    gameKeys.push(key.slice(namespace.length + 1));
                }
            }
            return gameKeys[index];
        },
        get length() {
            // Count only items for this game
            let count = 0;
            for (let i = 0; i < originalLocalStorage.length; i++) {
                if (originalLocalStorage.key(i).startsWith(`${namespace}_`)) {
                    count++;
                }
            }
            return count;
        }
    };

    // Create IndexedDB proxy
    const indexedDBProxy = new Proxy({}, {
        get: function(target, prop) {
            if (prop === 'open') {
                return function(dbName, version) {
                    // Namespace the database name
                    const namespacedDBName = `${namespace}_${dbName}`;
                    return originalIndexedDB.open(namespacedDBName, version);
                };
            } else if (prop === 'deleteDatabase') {
                return function(dbName) {
                    const namespacedDBName = `${namespace}_${dbName}`;
                    return originalIndexedDB.deleteDatabase(namespacedDBName);
                };
            } else {
                return originalIndexedDB[prop];
            }
        }
    });

    return function setupGameEnvironment() {
        // Override storage APIs in the game's context
        Object.defineProperty(window, 'localStorage', {
            value: localStorageProxy,
            writable: false,
            configurable: true
        });

        Object.defineProperty(window, 'indexedDB', {
            value: indexedDBProxy,
            writable: false,
            configurable: true
        });
    };
}
createGameStorageSandbox(window.gameID || "ccported")();

class Stats {
    constructor() {
        this.isOpen = false;
        this.initTime = new Date().getTime();
        this.isDragging = false;
        this.ableToDrag = false;
        this.logs = [];
        this.requests = [];
        const [dom] = this.generateDom();
        this.dom = dom;
        this.workerLoaded = false;
        dom.style.display = "none";
        this.clientID = Math.random().toString(36).substring(2);
        this.contentBeforeLoad = {
            logs: [],
            requestsIntercepted: [],
        };
        this.customUpdates = {
            logs: (content) => {
                if (document.getElementById("cc_stats_logs")) {
                    document.getElementById("cc_stats_logs").innerHTML += content;
                } else {
                    this.contentBeforeLoad.logs.push(content);
                }
            },
            requestsIntercepted: (content) => {
                if (document.getElementById("cc_stats_requestsIntercepted")) {
                    document.getElementById("cc_stats_requestsIntercepted").innerHTML +=
                        content;
                } else {
                    this.contentBeforeLoad.requestsIntercepted.push(content);
                }
            },
        };
        this.tick();
        document.addEventListener("mousemove", (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.objectHovering = e.target;
        });
        window.addEventListener("load", () => {
            this.log("Window loaded");
            document.body.appendChild(dom);
            Object.entries(this.contentBeforeLoad).forEach(([key, value]) => {
                value.forEach((val) => {
                    this.customUpdates[key](val);
                });
            });
            const style = document.createElement("style");
            style.textContent = `
                .cc_stats_table_row:hover {
                    background-color: #333;
                }
                .cc_stats pre{
                    white-space: pre-wrap;
                    background-color: #222;
                    color: #fff;
                    border: 1px solid #fff;
                    border-radius: 6px;
                    padding: 5px;
                    max-height: 500px;
                    overflow-y: auto;

                }

                `;
            document.head.appendChild(style);
        });
        this.setupRequestInterception();
    }
    getPanel(panel = 0) {
        return this.dom.children[panel];
    }
    destroy() {
        this.dom.remove();
    }
    tick() {
        if (this.isOpen) {
            this.update();
            setTimeout(() => this.tick(), 100);
        }
    }
    open() {
        this.isOpen = true;
        this.dom.style.display = "flex";
        this.tick();
    }
    close() {
        this.isOpen = false;
        this.dom.style.display = "none";
    }
    generateDom() {
        const dom = document.createElement("div");
        dom.classList.add("cc_stats");
        dom.style.cssText = `
            position:fixed;
            top:0;
            left:0;
            opacity:0.8;
            z-index:10000;
            background-color:#002;
            background-color:rgba(0,0,0,0.8);
            color:#0ff;
            font-family:monospace;
            font-size:12px;
            padding:5px;
            display:flex;
            flex-direction: row;
            padding-bottom: 20px;
            align-items: flex-start;
            max-width: 100vw;
            max-height: 100vh;
            box-sizing: border-box;
            overflow: auto;
            `;
        //make it expandable
        document.addEventListener("mousemove", (e) => {
            if (this.isDragging) {
                dom.style.width = e.clientX + "px";
            }
            // 10 px from right edge of dom
            if (
                e.clientX > dom.getBoundingClientRect().right - 20 &&
                e.clientX < dom.getBoundingClientRect().right + 40
            ) {
                this.ableToDrag = true;
                // set cursor
                dom.style.cursor = "ew-resize";
            } else {
                this.ableToDrag = false;
                dom.style.cursor = "default";
            }
        });
        document.addEventListener("mousedown", (e) => {
            if (this.ableToDrag) {
                this.isDragging = true;
            }
        });
        document.addEventListener("mouseup", (e) => {
            this.isDragging = false;
        });
        const panels = {
            stats: [
                "time",
                "version",
                "requestInterceptionLoaded",
                "memory",
                "cpu",
                "user",
                "game",
                "lastTrackingTick",
                "lastAutoSync",
                "currentStateFrom",
                "mouse",
                "mouseCovering",
                "trackingData",
            ],
            logs: ["logs"],
            requests: ["requestsIntercepted"],
        };
        const formats = {
            stats: (content) => {
                return `<h1>${content.panel}</h1>
                    ${content.aspects
                        .map(
                            (aspect) =>
                                `<div><strong>${decamelize(
                                    aspect
                                )}:</strong> <span id="cc_stats_${aspect}"></span></div>`
                        )
                        .join("")}`;
            },
            logs: (content) => {
                return `<h1>${content.panel}</h1>
                    <button onclick="document.getElementById('cc_stats_logs').innerHTML = '';">Clear</button>
                    <pre style="white-space: pre-wrap;" id="cc_stats_logs"></pre>
                    <input type="text" placeholder="Eval" onkeydown="if(event.key === 'Enter') { window.ccPorted.stats.log('<',this.value);try{let o = eval(this.value);window.ccPorted.stats.log('>',o);}catch(err){window.ccPorted.stats.log(err)} this.value = '' }">`;
            },
            requests: (content) => {
                return `<h1>${content.panel}</h1>
                    <button onclick="fetch('/assets/images/ovo.jpg')">Test Request</button><button onclick="document.getElementById('cc_stats_requestsIntercepted').innerHTML = '';">Clear</button>
                    <button onclick="fetch('https://httpbin.org/post', {method: 'POST', body: JSON.stringify({test: 'test'})})">Test Post</button>
                    ${content.aspects
                        .map((aspect) => `<div id = "cc_stats_${aspect}"></div>`)
                        .join("")}`;
            },
        };

        // build everything:
        const panelHTMLs = [];
        Object.keys(panels).forEach((panel) => {
            const aspectsToRender = panels[panel];
            const content = {
                panel,
                aspects: aspectsToRender,
            };
            const finished = `<div id="${panel}" style="width: ${100 / Object.keys(panels).length
                }vw;max-height:100vh;overflow:scroll;padding:5px;box-sizing:border-box;">${formats[
                    panel
                ](content)}</div>`;
            panelHTMLs.push(finished);
        });
        dom.innerHTML = panelHTMLs.join("");
        return [dom];
    }
    timeAgo(date) {
        const now = Date.now();
        const diff = now - date;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        if (days > 0) return `${days} day${days > 1 ? "s" : ""}`;
        if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""}`;
        if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""}`;
        if (seconds > 0) return `${seconds} second${seconds > 1 ? "s" : ""}`;
        return "just now";
    }
    formatTracking(tracking) {
        try {
            const table = document.createElement("table");
            table.style.borderCollapse = "collapse";

            const headerRow = document.createElement("tr");
            const headerPage = document.createElement("th");
            headerPage.style.border = "1px solid #0ff";
            headerPage.textContent = "Pages Visited";
            const headerCount = document.createElement("th");
            headerCount.style.border = "1px solid #0ff";
            headerCount.textContent = "Count";
            headerRow.appendChild(headerPage);
            headerRow.appendChild(headerCount);
            table.appendChild(headerRow);
            Object.entries(tracking.pages_visited || {}).forEach(([page, data]) => {
                const row = document.createElement("tr");
                row.style.border = "1px solid #0ff";
                row.style.cursor = "pointer";

                // add hover event
                const cellPage = document.createElement("td");
                cellPage.style.border = "1px solid #0ff";
                cellPage.textContent = page;
                const cellCount = document.createElement("td");
                cellCount.style.border = "1px solid #0ff";
                cellCount.textContent = data.count;
                row.appendChild(cellPage);
                row.appendChild(cellCount);
                table.appendChild(row);
            });

            const gamesTable = document.createElement("table");
            gamesTable.style.borderCollapse = "collapse";
            gamesTable.style.marginTop = "10px";

            const gamesHeaderRow = document.createElement("tr");
            const gamesHeaderGame = document.createElement("th");
            gamesHeaderGame.style.border = "1px solid #0ff";
            gamesHeaderGame.textContent = "Games Played";
            const gamesHeaderPlaytime = document.createElement("th");
            gamesHeaderPlaytime.style.border = "1px solid #0ff";
            gamesHeaderPlaytime.textContent = "Playtime";
            gamesHeaderRow.appendChild(gamesHeaderGame);
            gamesHeaderRow.appendChild(gamesHeaderPlaytime);
            gamesTable.appendChild(gamesHeaderRow);

            Object.entries(tracking.games || {}).forEach(([game, data]) => {
                const row = document.createElement("tr");
                row.style.border = "1px solid #0ff";
                row.style.cursor = "pointer";
                const cellGame = document.createElement("td");
                cellGame.style.border = "1px solid #0ff";
                cellGame.textContent = game;
                const cellPlaytime = document.createElement("td");
                cellPlaytime.style.border = "1px solid #0ff";
                cellPlaytime.textContent = `${data.playtime.toFixed(2)} minutes`;
                row.appendChild(cellGame);
                row.appendChild(cellPlaytime);
                gamesTable.appendChild(row);
            });

            return table.outerHTML + gamesTable.outerHTML;
        } catch (err) {
            return `Error when rendering tracking data: ${err}`;
        }
    }
    renderTableFromJSON(json) {
        if (!json) {
            this.log("No JSON to render");
            return "";
        }
        const table = document.createElement("table");
        table.style.borderCollapse = "collapse";
        const headerRow = document.createElement("tr");
        ["Key", "Value"].forEach((header) => {
            const th = document.createElement("th");
            th.style.border = "1px solid #0ff";
            th.textContent = header;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);
        Object.entries(json).forEach(([key, value]) => {
            if (key == undefined) return;
            if (value == undefined) return;
            if (value.length > 100) {
                value = value.slice(0, 100) + "...";
            }
            const row = document.createElement("tr");
            row.style.border = "1px solid #0ff";
            // make the row wrap
            row.style.wordWrap = "break-word";
            row.style.maxWidth = "100%";
            const cellKey = document.createElement("td");
            cellKey.style.maxWidth = "30%";
            const code = document.createElement("code");
            code.textContent = key;
            code.cssText =
                "background-color: #999; color: orange; border-radius:3px;";

            cellKey.appendChild(code);
            const cellValue = document.createElement("td");
            cellValue.style.maxWidth = "70%";
            cellValue.style.wordWrap = "break-word";
            cellValue.style.border = "1px solid #0ff";
            cellValue.textContent =
                typeof value == "object" ? JSON.stringify(value) : value;
            row.appendChild(cellKey);
            row.classList.add("cc_stats_table_row");
            cellValue.classList.add("cc_stats_table_cell");
            cellKey.classList.add("cc_stats_table_cell");
            row.appendChild(cellValue);
            table.appendChild(row);
        });
        table.style.width = "100%";
        table.style.overflow = "auto";
        table.style.wordBreak = "break-all";
        return table;
    }
    formatInformation(information, type) {
        const pre = document.createElement("pre");
        pre.style.whiteSpace = "pre-wrap";
        pre.style.maxHeight = "500px";
        pre.style.overflowY = "auto";
        pre.style.backgroundColor = "#222";
        pre.style.color = "#fff";
        pre.style.border = "1px solid #fff";
        pre.style.borderRadius = "6px";
        pre.style.padding = "5px";
        try {
            pre.textContent = JSON.stringify(JSON.parse(information), null, 2);
        } catch (err) {
            pre.textContent = information;
        } finally {
            return pre;
        }
    }
    async buildRequest(request) {
        const details = document.createElement("details");
        const summary = document.createElement("summary");

        const url = new URL(request.url);
        const method = request.method;
        const headers = request.headers;
        const requestData = {
            "Body Used": request.bodyUsed,
            Cache: request.cache,
            Credentials: request.credentials,
            Destination: request.destination,
            Integrity: request.integrity,
            Keepalive: request.keepalive,
            Method: request.method,
            Mode: request.mode,
            Referrer: request.referrer,
            URL: request.url,
        };

        details.id = `cc_stats_request_${request.id}`;
        summary.title = request.url;
        summary.textContent = `[${new Date(request.timestamp).toLocaleTimeString()}] ${url.pathname}: (${method})`;

        const status = document.createElement("span");
        status.id = `cc_stats_request_${request.id}_status`;
        summary.appendChild(status);

        details.appendChild(summary);

        const headersDiv = document.createElement("div");
        const requestBody = document.createElement("div");
        const requestDataDiv = document.createElement("div");
        headersDiv.id = `cc_stats_request_${request.id}_headers`;
        requestBody.id = `cc_stats_request_${request.id}_body`;
        requestDataDiv.id = `cc_stats_request_${request.id}_requestData`;

        const headersTable = this.renderTableFromJSON(headers);
        const requestBodyPre = this.formatInformation(request.body, request.bodyType);
        const requestDataTable = this.renderTableFromJSON(requestData);

        const headersTitle = document.createElement("strong");
        headersTitle.textContent = "Request Headers:";
        headersDiv.appendChild(headersTitle);

        const requestBodyTitle = document.createElement("strong");
        requestBodyTitle.textContent = "Request Body:";
        requestBody.appendChild(requestBodyTitle);

        const requestDataTitle = document.createElement("strong");
        requestDataTitle.textContent = "Request Data:";
        requestDataDiv.appendChild(requestDataTitle);

        headersDiv.appendChild(headersTable);
        requestBody.appendChild(requestBodyPre);
        requestDataDiv.appendChild(requestDataTable);

        details.appendChild(headersDiv);
        details.appendChild(requestBody);
        details.appendChild(requestDataDiv);

        const responseDataDiv = document.createElement("div");
        responseDataDiv.id = `cc_stats_request_${request.id}_responseData`;
        details.appendChild(responseDataDiv);

        return details;
    }
    async finishRequest(response, detailsContext) {
        const responseHeaders = response.headers;
        const responseRaw = response.response;
        const responseFormat = response.responseFormat;

        const headersDiv = document.createElement("div");
        const responseDiv = document.createElement("div");

        headersDiv.id = `cc_stats_request_${response.id}_responseHeaders`;
        responseDiv.id = `cc_stats_request_${response.id}_response`;

        const headersTable = this.renderTableFromJSON(responseHeaders);
        const responsePre = this.formatInformation(responseRaw, responseFormat);

        const headersTitle = document.createElement("strong");
        headersTitle.textContent = "Response Headers:";
        headersDiv.appendChild(headersTitle);

        const responseTitle = document.createElement("strong");
        responseTitle.textContent = "Response:";
        responseDiv.appendChild(responseTitle);

        headersDiv.appendChild(headersTable);
        responseDiv.appendChild(responsePre);

        const responseDataDiv = this.contextualize(`cc_stats_request_${response.id}_responseData`, detailsContext)
        responseDataDiv.appendChild(headersDiv);
        responseDataDiv.appendChild(responseDiv);

        const requestBodyElement = this.contextualize(`cc_stats_request_${response.id}_body`, detailsContext)
        if (requestBodyElement) {
            requestBodyElement.appendChild(this.formatInformation(response.body, response.bodyType));
        }
        const requestStatus =  this.contextualize(`cc_stats_request_${response.id}_status`, detailsContext)
        if (requestStatus) {
            requestStatus.textContent = response.status;
        }

        return;
    }
    contextualize(id,context){
        if(context){
            console.log(context);
            return context.querySelector("#"+id);
        }else{
            return document.getElementById(id);
        }
    }
    async formatRequest(request) {
        try {
            const id = request.id;
            const requestt = request.request;
            const type = requestt.type;
            switch (type) {
                case "request-start":
                    return (await this.buildRequest(requestt)).outerHTML;
                case "request-complete":
                    let element = document.getElementById(`cc_stats_request_${id}`);
                    if (!element) {
                        const details = await this.buildRequest(requestt);
                        this.finishRequest(requestt, details)

                        // add to requests
                        if(document.getElementById("cc_stats_requestsIntercepted")){
                            document.getElementById("cc_stats_requestsIntercepted").appendChild(details);
                        }
                    }else{
                        this.finishRequest(requestt)
                    }
                    break;

                case "request-error":
                    if (document.getElementById(`cc_stats_request_${id}`)) {
                        document.getElementById(`cc_stats_request_${id}_status`).textContent =
                            requestt.status;
                        // add headers
                        document.getElementById(`cc_stats_request_${id}`).innerHTML += `
                            <div>Errored</div>
                        `;
                    }
                    return "";
                    break;
            }
            return "";
        } catch (err) {
            this.log(`Error formatting request (${request.id} - ${new URL(request.request.url).pathname}):`, err);
            this.log(err.stack)
        }
    }
    getMouse() {
        return [this.mouseX, this.mouseY];
    }
    setupRequestInterception() {
        // using /assets/scripts/sw_request_interceptor.js
        // service worker
        // client.js
        if ("serviceWorker" in navigator) {
            window.addEventListener("load", () => {
                navigator.serviceWorker
                    .register("/service-worker.js")
                    .then((registration) => {
                        this.workerLoaded = true;
                        this.log(
                            "Service Worker registered successfully:",
                            registration.scope
                        );
                    })
                    .catch((error) => {
                        console.error("Service Worker registration failed:", error);
                    });
            });

            // Listen for messages from the service worker
            navigator.serviceWorker.addEventListener("message", async (event) => {
                const data = event.data;
                const toPass = {
                    id: data.id,
                    request: data,
                };
                const formatted = await this.formatRequest(toPass);
                this.customUpdates.requestsIntercepted(formatted);
            });
        }
    }
    update() {
        const memoryUsage = this.getMemoryUsage();
        const cpuUsage = this.getCpuUsage();
        const user = window.ccPorted.user;
        const game = window.gameID;
        const lastTrackingTick = lastUpdate;
        const trackingData = window.ccPortedTrackingData || {};
        const lastAutoSync = window.ccPorted.stateSync?.lastSync || "N/A";
        const aspects = {
            time: `${new Date().toLocaleTimeString()} (${(
                (new Date().getTime() - this.initTime) /
                1000
            ).toFixed(3)} seconds up)`,
            version: window.ccPorted?.version,
            requestInterceptionLoaded: this.workerLoaded,
            memory: memoryUsage,
            cpu: cpuUsage,
            user: `${user ? user.id : "N/A"} (${user ? user.user_metadata.display_name : "Guest"
                })`,
            game: game || "N/A",
            lastTrackingTick: `${lastTrackingTick} (${this.timeAgo(
                lastTrackingTick
            )} ago)`,
            lastAutoSync: `${lastAutoSync} (${this.timeAgo(lastAutoSync)} ago)`,
            currentStateFrom:
                new Date(
                    parseInt(localStorage.getItem("ccStatelastSave"))
                ).toLocaleDateString() +
                " " +
                new Date(
                    parseInt(localStorage.getItem("ccStatelastSave"))
                ).toLocaleTimeString(),
            mouse: this.getMouse()[0] + "|" + this.getMouse()[1],
            mouseCovering: this.objectHovering
                ? this.objectHovering.tagName +
                "#" +
                this.objectHovering.id +
                "." +
                this.objectHovering.classList
                : "N/A",
            trackingData: this.formatTracking(trackingData),
        };
        try {
            Object.entries(aspects).forEach(([aspect, value]) => {
                const element = document.getElementById("cc_stats_" + aspect);
                if (Object.keys(this.customUpdates).includes(aspect)) {
                    return;
                }
                if (element) {
                    element.innerHTML = value;
                }
            });
        } catch (err) {
            this.log(err);
        }
    }
    getMemoryUsage() {
        const memory = window.performance.memory;
        if (!memory) return "N/A";
        return `${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`;
    }
    getCpuUsage() {
        const cpu = window.performance.getEntriesByType("navigation")[0];
        if (!cpu) return "N/A";
        return `${cpu.duration.toFixed(2)} ms`;
    }
    log(...msg) {
        msg = msg.map((m) => {
            switch (typeof m) {
                case "object":
                    if (m === null) return "null";
                    switch (m.constructor) {
                        case Object:
                            return JSON.stringify(m);
                        case Array:
                            return JSON.stringify(m);
                        case Error:
                            return `<div style = "color:red">${m + "\n" + m.stack}</div>`;
                    }
                default:
                    return m;
            }
        });
        this.customUpdates.logs(
            `[${new Date().toLocaleTimeString()}] ${msg.join(" ")}\n`
        );
    }
}

const stats = new Stats();
window.ccPorted.stats = stats;
function toggleStats() {
    if (stats.isOpen) {
        stats.close();
    } else {
        stats.open();
    }
}
// Setup tracking interval
function setupTracking() {
    updateTracking(
        `pages_visited.${treat(window.location.pathname)}.count`,
        (getDeepValue(
            window.ccPortedTrackingData,
            `pages_visited.${treat(window.location.pathname)}.count`
        ) || 0) + 1
    );
    trackingTick();
    if (trackingInterval) {
        clearInterval(trackingInterval);
    }

    lastUpdate = Date.now();
    trackingInterval = setInterval(trackingTick, 5 * 60 * 1000); // 5 minutes
}

// Cleanup function (call this when user logs out or page unloads)
function cleanupTracking() {
    if (trackingInterval) {
        clearInterval(trackingInterval);
        trackingInterval = null;
    }

    // Save final tracking update
    if (window.ccPortedTrackingData) {
        trackingTick();
    }
}

// Add cleanup listener
window.addEventListener("beforeunload", cleanupTracking);

// Global tracking state
let trackingInterval = null;
let lastUpdate = Date.now();

function treat(text) {
    if (!text) return null;
    return text.split(".").join("-");
}
// Helper function to deep set object values using dot notation
function setDeepValue(obj, path, value) {
    const parts = path.split(".");
    let current = obj;

    for (let i = 0; i < parts.length - 1; i++) {
        if (!(parts[i] in current)) {
            current[parts[i]] = {};
        }
        current = current[parts[i]];
    }

    current[parts[parts.length - 1]] = value;
    return obj;
}

// Helper function to deep get object values using dot notation
function getDeepValue(obj, path) {
    return path.split(".").reduce((curr, part) => curr && curr[part], obj);
}

// Update tracking data in database
async function saveTrackingData() {
    try {
        const { error } = await window.ccSupaClient
            .from("u_profiles")
            .update({ tracking_data: window.ccPortedTrackingData })
            .eq("id", window.ccPorted.user.id);

        if (error) {
            log("Error saving tracking data:", error);
        }
    } catch (err) {
        log("Failed to save tracking data:", err);
    }
}

// Function to update specific tracking attributes
async function updateTracking(attrPath, value) {
    if (!window.ccPortedTrackingData) {
        window.ccPortedTrackingData = { games: {}, total_playtime: 0 };
    }

    setDeepValue(window.ccPortedTrackingData, attrPath, value);
}

const tGameID = treat(window.gameID);
// Function to handle periodic tracking updates
async function trackingTick() {
    const now = Date.now();
    const timeDiff = now - lastUpdate;
    lastUpdate = now;

    // Convert ms to minutes
    let minutesElapsedX = timeDiff / 60000;
    const minutesElapsed =
        Math.round((minutesElapsedX + Number.EPSILON) * 100) / 100;
    if (minutesElapsed > 0 && tGameID) {
        if (!window.ccPortedTrackingData.games[tGameID]) {
            window.ccPortedTrackingData.games[tGameID] = { playtime: 0 };
        }

        // Update game-specific playtime
        const currentPlaytime =
            getDeepValue(window.ccPortedTrackingData, `games.${tGameID}.playtime`) ||
            0;
        updateTracking(
            `games.${tGameID}.playtime`,
            currentPlaytime + minutesElapsed
        );

        // Update total playtime
        const totalPlaytime = window.ccPortedTrackingData.total_playtime || 0;
        updateTracking("total_playtime", totalPlaytime + minutesElapsed);
    }
    await saveTrackingData();
}
async function handleUserLoggedIn() {
    // Fetch tracking data if user exists
    const { data, error } = await window.ccSupaClient
        .from("u_profiles")
        .select("tracking_data")
        .eq("id", window.ccPorted.user.id)
        .single();
    if (error) log("Error fetching tracking data:", error);
    if (data && data.tracking_data) {
        window.ccPortedTrackingData = data.tracking_data;
    } else {
        window.ccPortedTrackingData = {
            games: {},
            total_playtime: 0,
            chat_messages_sent: 0,
            pages_visited: {},
        };
    }
    setupTracking();
    window.ccPorted.stateSync = new GameStateSync(
        window.ccPorted.user.id,
        window.ccSupaClient
    );
    window.ccPorted.stateSync.initialize();
}
async function init() {
    if (window.ccPorted.user) {
        handleUserLoggedIn();
    } else if (window.ccPorted.userPromise) {
        const user = await window.ccPorted.userPromise;
        if (user) {
            window.ccPorted.user = user;
            handleUserLoggedIn();
        }
    }
}

function decamelize(string) {
    // string are in camelcase
    // should end up as "Camel Case"
    let denormalized = "";
    for (let i = 0; i < string.length; i++) {
        if (string[i] === string[i].toUpperCase()) {
            denormalized += " " + string[i];
        } else {
            denormalized += string[i];
        }
    }
    // capitalize first character
    denormalized = denormalized[0].toUpperCase() + denormalized.slice(1);
    return denormalized;
}
function shortcut(keys, cb) {
    var keyMap = {};
    for (const key of keys) {
        keyMap[key] = false;
    }
    document.addEventListener("keydown", (e) => {
        if (keyMap[e.which] !== undefined) {
            keyMap[e.which] = true;
        }
        if (check()) {
            cb();
        }
    });
    document.addEventListener("keyup", (e) => {
        if (keyMap[e.which] !== undefined) {
            keyMap[e.which] = false;
        }
    });
    function check() {
        var allPressed = true;
        for (const key of keys) {
            if (!keyMap[key]) {
                allPressed = false;
            }
        }
        return allPressed;
    }
}
try {
    window.addEventListener("load", init);
} catch (err) {
    log(err);
}
