try {
    shortcut([17, 81], toggleStats);

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
            dom.style.display = 'none';
            this.contentBeforeLoad = {};
            this.customUpdates = {
                "logs": (content) => {
                    if (document.getElementById('cc_stats_logs')) {
                        document.getElementById('cc_stats_logs').textContent += content;
                    } else {
                        this.contentBeforeLoad.logs.push(content);
                    }
                },
                "requestsIntercepted": (content) => {
                    if (document.getElementById('cc_stats_requestsIntercepted')) {
                        document.getElementById('cc_stats_requestsIntercepted').innerHTML += content;
                    } else {
                        this.contentBeforeLoad.requestsIntercepted.push(content);
                    }
                }
            }
            this.tick();
            document.addEventListener('mousemove', (e) => {
                this.mouseX = e.clientX
                this.mouseY = e.clientY
                this.objectHovering = e.target;
            });
            window.addEventListener('load', () => {
                document.body.appendChild(dom);
                Object.entries(this.contentBeforeLoad).forEach(([key, value]) => {
                    value.forEach(val => {
                        this.customUpdates[key](val);
                    })
                });
                const style = document.createElement('style');
                style.textContent = `
                .cc_stats_table_row:hover {
                    background-color: #333;
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
            this.dom.style.display = 'flex';
            this.tick();
        }
        close() {
            this.isOpen = false;
            this.dom.style.display = 'none';
        }
        generateDom() {
            const dom = document.createElement('div');
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
                    dom.style.width = e.clientX + 'px';
                }
                // 10 px from right edge of dom
                if (e.clientX > dom.getBoundingClientRect().right - 20 && e.clientX < dom.getBoundingClientRect().right + 40) {
                    this.ableToDrag = true;
                    // set cursor
                    dom.style.cursor = 'ew-resize';
                } else {
                    this.ableToDrag = false;
                    dom.style.cursor = 'default';
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
                "stats": ["time", "requestInterceptionLoaded", "memory", "cpu", "user", "game", "lastTrackingTick",
                    "lastAutoSync", "mouse", "mouseCovering", "trackingData"
                ],
                "logs": ["logs"],
                "requests": ["requestsIntercepted"]
            }
            const formats = {
                "stats": (content) => {
                    return `<h1>${content.panel}</h1>
                    ${content.aspects.map(aspect => `<div><strong>${decamelize(aspect)}:</strong> <span id="cc_stats_${aspect}"></span></div>`).join('')}`;
                },
                "logs": (content) => {
                    return `<h1>${content.panel}</h1>
                    <button onclick="window.ccPorted.stats.logs = []">Clear</button>
                    <pre style="white-space: pre-wrap;" id="cc_stats_logs"></pre>
                    <input type="text" placeholder="Eval" onkeydown="if(event.key === 'Enter') { window.ccPorted.stats.log('<',this.value);try{let o = eval(this.value);window.ccPorted.stats.log('>',o);}catch(err){window.ccPorted.stats.log(err)} this.value = '' }">`
                },
                "requests": (content) => {
                    return `<h1>${content.panel}</h1>
                    <button onclick="fetch('/assets/images/ovo.jpg')">Test Request</button>
                    ${content.aspects.map(aspect => `<div id = "cc_stats_${aspect}">testing testing</div>`).join('')}`;
                }
            }

            // build everything:
            const panelHTMLs = [];
            Object.keys(panels).forEach(panel => {
                const aspectsToRender = panels[panel];
                const content = {
                    panel,
                    aspects: aspectsToRender
                }
                const finished = `<div id="${panel}" style="width: ${100 / Object.keys(panels).length}vw;max-height:100vh;overflow:scroll;padding:5px;box-sizing:border-box;">${formats[panel](content)}</div>`;
                panelHTMLs.push(finished);
            });
            dom.innerHTML = panelHTMLs.join('');
            return [dom];
        }
        timeAgo(date) {
            const now = Date.now();
            const diff = now - date;
            const seconds = Math.floor(diff / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);
            if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
            if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
            if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''}`;
            if (seconds > 0) return `${seconds} second${seconds > 1 ? 's' : ''}`;
            return 'just now';
        }
        formatTracking(tracking) {
            try {
                const table = document.createElement('table');
                table.style.borderCollapse = 'collapse';

                const headerRow = document.createElement('tr');
                const headerPage = document.createElement('th');
                headerPage.style.border = '1px solid #0ff';
                headerPage.textContent = 'Pages Visited';
                const headerCount = document.createElement('th');
                headerCount.style.border = '1px solid #0ff';
                headerCount.textContent = 'Count';
                headerRow.appendChild(headerPage);
                headerRow.appendChild(headerCount);
                table.appendChild(headerRow);
                Object.entries(tracking.pages_visited || {}).forEach(([page, data]) => {
                    const row = document.createElement('tr');
                    row.style.border = '1px solid #0ff';
                    row.style.cursor = 'pointer';

                    // add hover event
                    const cellPage = document.createElement('td');
                    cellPage.style.border = '1px solid #0ff';
                    cellPage.textContent = page;
                    const cellCount = document.createElement('td');
                    cellCount.style.border = '1px solid #0ff';
                    cellCount.textContent = data.count;
                    row.appendChild(cellPage);
                    row.appendChild(cellCount);
                    table.appendChild(row);
                });

                const gamesTable = document.createElement('table');
                gamesTable.style.borderCollapse = 'collapse';
                gamesTable.style.marginTop = '10px';

                const gamesHeaderRow = document.createElement('tr');
                const gamesHeaderGame = document.createElement('th');
                gamesHeaderGame.style.border = '1px solid #0ff';
                gamesHeaderGame.textContent = 'Games Played';
                const gamesHeaderPlaytime = document.createElement('th');
                gamesHeaderPlaytime.style.border = '1px solid #0ff';
                gamesHeaderPlaytime.textContent = 'Playtime';
                gamesHeaderRow.appendChild(gamesHeaderGame);
                gamesHeaderRow.appendChild(gamesHeaderPlaytime);
                gamesTable.appendChild(gamesHeaderRow);

                Object.entries(tracking.games || {}).forEach(([game, data]) => {
                    const row = document.createElement('tr');
                    row.style.border = '1px solid #0ff';
                    row.style.cursor = 'pointer';
                    const cellGame = document.createElement('td');
                    cellGame.style.border = '1px solid #0ff';
                    cellGame.textContent = game;
                    const cellPlaytime = document.createElement('td');
                    cellPlaytime.style.border = '1px solid #0ff';
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
            if(!json) {
                this.log("No JSON to render");
                return '';
            };
            const table = document.createElement('table');
            table.style.borderCollapse = 'collapse';
            const headerRow = document.createElement('tr');
            ["Key", "Value"].forEach(header => {
                const th = document.createElement('th');
                th.style.border = '1px solid #0ff';
                th.textContent = header;
                headerRow.appendChild(th);
            });
            table.appendChild(headerRow);
            Object.entries(json).forEach(([key,value]) => {
                if(key == undefined) return;
                if(value == undefined) return;
                if(value.length > 100) {
                    value = value.slice(0, 100) + '...';
                }
                const row = document.createElement('tr');
                row.style.border = '1px solid #0ff';
                // make the row wrap
                row.style.wordWrap = 'break-word';
                row.style.maxWidth = '100%';
                const cellKey = document.createElement('td');
                cellKey.style.maxWidth = '20%';
                const code = document.createElement('code');
                code.textContent = key;
                code.cssText = 'background-color: #999; color: orange; border-radius:3px;';

                cellKey.appendChild(code);
                const cellValue = document.createElement('td');
                cellValue.style.maxWidth = '80%';
                cellValue.style.wordWrap = 'break-word';
                cellValue.style.border = '1px solid #0ff';
                cellValue.textContent = (typeof value == 'object') ? JSON.stringify(value) : value;
                row.appendChild(cellKey);
                row.classList.add("cc_stats_table_row");
                cellValue.classList.add("cc_stats_table_cell");
                cellKey.classList.add("cc_stats_table_cell");
                row.appendChild(cellValue);
                table.appendChild(row);
            });
            table.style.width = '100%';
            table.style.overflow = 'auto';

            return table.outerHTML;
        }
        formatRawRes(rawResponse) {
            if (rawResponse.length > 1000) {
                return rawResponse.slice(0, 1000) + '...';
            }
            // test if it's json
            try {
                const json = JSON.parse(rawResponse);
                return JSON.stringify(json, null, 2);
            } catch (err) {
                return rawResponse;
            }
        };
        formatRequest(request) {
            const id = request.id;
            const requestt = request.request;
            const type = requestt.type;
            if (!request) return '';
            switch (type) {
                case "request-start":
                    return `
                    <details id = "cc_stats_request_${id}">
                        <summary title="${requestt.url}">[${new Date(requestt.timestamp).toLocaleTimeString()}] ${id} (${requestt.method}): ${new URL(requestt.url).pathname} <span id="cc_stats_request_${id}_status">Pending...</span></summary>
                        <div>
                            <strong>Request Headers:</strong>
                            ${this.renderTableFromJSON(requestt.headers)}
                        </div>
                        <div>
                            <strong>Request Data:</strong>
                            ${this.renderTableFromJSON({
                        "Body Used": requestt.bodyUsed,
                        "Cache": requestt.cache,
                        "Credentials": requestt.credentials,
                        "Destination": requestt.destination,
                        "Integrity": requestt.integrity,
                        "Keepalive": requestt.keepalive,
                        "Method": requestt.method,
                        "Mode": requestt.mode,
                        "Referrer": requestt.referrer,
                        "URL": requestt.url
                    })}
                        <div>
                            <strong>Request Body:</strong>
                            <pre>${requestt.body}</pre>
                        </div>
                    </details>
                    `;
                    break;
                case "request-complete":
                    if (document.getElementById(`cc_stats_request_${id}`)) {
                        document.getElementById(`cc_stats_request_${id}_status`).textContent = requestt.status;
                        // add headers
                        document.getElementById(`cc_stats_request_${id}`).innerHTML += `
                            <div>
                                <strong>Response Headers:</strong>
                                <pre style = "white-space:pre-wrap;border:1px solid #ccc; border-radius: 6px; background-color: #222;">${JSON.stringify(requestt.headers, null, 2)}</pre>
                            </div>
                        `;
                        // add preview as iframe
                        // use srcdoc to prevent CORS issues
                        // get the raw text
                        const relement = document.getElementById(`cc_stats_request_${id}`);
                        if (relement) {
                            const rawResponse = requestt.response;
                            let previewHtml = '';
                            let dangerous = false;
                            switch (requestt.responseFormat) {
                                case 'image':
                                    previewHtml = `<img src="${rawResponse}" style="max-width:100%; max-height:300px;">`;
                                    break;

                                case 'json':
                                    try {
                                        const formattedJson = JSON.stringify(JSON.parse(rawResponse), null, 2);
                                        previewHtml = `<pre style="white-space:pre-wrap;border:1px solid #ccc; border-radius: 6px; background-color: #222;padding:5px;padding:5px">FORMATTED: ${formattedJson}</pre>`;
                                    } catch (e) {
                                        this.log(e)
                                        previewHtml = `<pre style="white-space:pre-wrap;">Raw: ${rawResponse}</pre>`;
                                    }
                                    break;

                                case 'html':
                                    previewHtml = `<iframe id="cc_stats_request_${id}_iframe" style="width:500px;height:500px;border:1px solid #ccc;background-color: white;"></iframe>`;
                                    break;

                                default:
                                    previewHtml = `<pre style="white-space:pre-wrap;white-space:pre-wrap;border:1px solid #ccc; border-radius: 6px; background-color: #22;padding:5px;max-width:100%; overflow-x:scroll;"">${this.formatRawRes(rawResponse)}</pre>`;
                            }


                            // const viewToggle = `
                            //     <div class="response-toggle" style="margin-bottom:10px;">
                            //     <button id="view_${id}_preview" data-val="preview">Preview</button>
                            //     <button id="view_${id}_raw" data-val="raw">Raw</button>
                            //     </div>
                            // `;

                            relement.innerHTML += `
                                <div>
                                    <strong>Response:</strong>
                                    <div class="response-content">
                                        <div class="preview-view">${previewHtml}</div>
                                    </div>
                                </div>
                            `;
                            if(requestt.responseFormat == 'html') {
                                const iframe = document.getElementById(`cc_stats_request_${id}_iframe`);
                                iframe.srcdoc = rawResponse;
                            }


                            
                        }else{
                            this.log("element not found")
                        }
                        break;
                    } else {
                        try{
                        return `
                            <details id = "cc_stats_request_${id}">
                                <summary title="${requestt.url}">[${new Date(requestt.timestamp).toLocaleTimeString()}] ${id} (${requestt.method}): ${new URL(requestt.url).pathname} <span id="cc_stats_request_${id}_status">Pending...</span></summary>
                                <div>
                                    <strong>Request Headers:</strong>
                                    ${this.renderTableFromJSON(requestt.headers)}
                                </div>
                                <div>
                                    <strong>Request Data:</strong>
                                    ${this.renderTableFromJSON({
                                    "Body Used": requestt.bodyUsed,
                                    "Cache": requestt.cache,
                                    "Credentials": requestt.credentials,
                                    "Destination": requestt.destination,
                                    "Integrity": requestt.integrity,
                                    "Keepalive": requestt.keepalive,
                                    "Method": requestt.method,
                                    "Mode": requestt.mode,
                                    "Referrer": requestt.referrer,
                                    "URL": requestt.url
                                })}
                                <div>
                                    <strong>Request Body:</strong>
                                    <pre>${requestt.body}</pre>
                                </div>
                            </details>
                    `;
                            } catch (err) {
                                this.log(err + "\n" + err.stack);
                                return `Error when rendering request data: ${err}`;
                            }
                    }
                    break;
                case "request-error":
                    if (document.getElementById(`cc_stats_request_${id}`)) {
                        document.getElementById(`cc_stats_request_${id}_status`).textContent = requestt.status;
                        // add headers
                        document.getElementById(`cc_stats_request_${id}`).innerHTML += `
                            <div>Errored</div>
                        `;
                    }
                    return '';
                    break;
            }
            return '';
            // return `
            //         <details id = "cc_stats_request_${id}">
            //             <summary title="${requestt.url}">[${new Date(requestt.timestamp).toLocaleTimeString()}] ${id} (${(type == "request-start" ? requestt.method : "UNK")}): ${new URL(requestt.url).pathname} <span id="cc_stats_request_${id}_status">${(type == "request-complete" || type == "request-error") ? requestt.status : "Pending..."}</span></summary>
            //             <div>
            //                 <strong>Request Headers:</strong>
            //                 <pre>${JSON.stringify(requestt.headers, null, 2)}</pre>
            //             </div>
            //         </details>
            //     `;
        }
        getMouse() {
            return [this.mouseX, this.mouseY];
        }
        setupRequestInterception() {
            // using /assets/scripts/sw_request_interceptor.js
            // service worker
            // client.js
            if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                    navigator.serviceWorker.register('/service-worker.js')
                        .then(registration => {
                            this.log('Service Worker registered successfully:', registration.scope);
                        })
                        .catch(error => {
                            console.error('Service Worker registration failed:', error);
                        });
                });

                // Listen for messages from the service worker
                navigator.serviceWorker.addEventListener('message', event => {
                    const data = event.data;

                    switch (data.type) {
                        case 'request-start':
                            this.customUpdates['requestsIntercepted'](this.formatRequest({
                                id: data.id,
                                request: data
                            }));
                            break;

                        case 'request-complete':
                            this.customUpdates['requestsIntercepted'](this.formatRequest({
                                id: data.id,
                                request: data
                            }));
                            break;

                        case 'request-error':
                            this.customUpdates['requestsIntercepted'](this.formatRequest({
                                id: data.id,
                                request: data
                            }));
                            break;
                    }
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
            const lastAutoSync = window.ccPorted.stateSync?.lastSync || 'N/A';
            const aspects = {
                time: `${new Date().toLocaleTimeString()} (${((new Date().getTime() - this.initTime) / 1000).toFixed(3)} seconds up)`,
                requestInterceptionLoaded: this.workerLoaded,
                memory: memoryUsage,
                cpu: cpuUsage,
                user: `${user ? user.id : 'N/A'} (${user ? user.user_metadata.display_name : 'Guest'})`,
                game: game || 'N/A',
                lastTrackingTick: `${lastTrackingTick} (${this.timeAgo(lastTrackingTick)} ago)`,
                lastAutoSync: `${lastAutoSync} (${this.timeAgo(lastAutoSync)} ago)`,
                mouse: this.getMouse()[0] + '|' + this.getMouse()[1],
                mouseCovering: this.objectHovering ? this.objectHovering.tagName + "#" + this.objectHovering.id + "." + this.objectHovering.classList : 'N/A',
                trackingData: this.formatTracking(trackingData),
            }
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
            if (!memory) return 'N/A';
            return `${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`;
        }
        getCpuUsage() {
            const cpu = window.performance.getEntriesByType('navigation')[0];
            if (!cpu) return 'N/A';
            return `${cpu.duration.toFixed(2)} ms`;
        }
        log(...msg) {
            msg = msg.map(m => {
                switch(typeof m) {
                    case 'object':
                        switch(m.constructor) {
                            case Object:
                                return JSON.stringify(m);
                            case Array:
                                return JSON.stringify(m);
                            case Error:
                                return m + "\n" + m.stack;
                        }
                    default:
                        return m;
                }
            })
            this.customUpdates.logs(`[${new Date().toLocaleTimeString()}] ${msg.join(" ")}\n`);
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
        updateTracking(`pages_visited.${treat(window.location.pathname)}.count`, (getDeepValue(window.ccPortedTrackingData, `pages_visited.${treat(window.location.pathname)}.count`) || 0) + 1);
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
    window.addEventListener('beforeunload', cleanupTracking);

    // Global tracking state
    let trackingInterval = null;
    let lastUpdate = Date.now();


    function treat(text) {
        if (!text) return null;
        return text.split('.').join('-');
    }
    // Helper function to deep set object values using dot notation
    function setDeepValue(obj, path, value) {
        const parts = path.split('.');
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
        return path.split('.').reduce((curr, part) => curr && curr[part], obj);
    }

    // Update tracking data in database
    async function saveTrackingData() {
        try {
            const { error } = await window.ccSupaClient
                .from('u_profiles')
                .update({ tracking_data: window.ccPortedTrackingData })
                .eq('id', window.ccPorted.user.id);

            if (error) {
                log('Error saving tracking data:', error);
            }
        } catch (err) {
            log('Failed to save tracking data:', err);
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
        let minutesElapsedX = (timeDiff / 60000);
        const minutesElapsed = Math.round((minutesElapsedX + Number.EPSILON) * 100) / 100
        if (minutesElapsed > 0 && tGameID) {
            if (!window.ccPortedTrackingData.games[tGameID]) {
                window.ccPortedTrackingData.games[tGameID] = { playtime: 0 };
            }

            // Update game-specific playtime
            const currentPlaytime = getDeepValue(window.ccPortedTrackingData, `games.${tGameID}.playtime`) || 0;
            updateTracking(`games.${tGameID}.playtime`, currentPlaytime + minutesElapsed);

            // Update total playtime
            const totalPlaytime = window.ccPortedTrackingData.total_playtime || 0;
            updateTracking('total_playtime', totalPlaytime + minutesElapsed);
        }
        await saveTrackingData();
    }
    async function handleUserLoggedIn() {
        // Fetch tracking data if user exists
        const { data, error } = await window.ccSupaClient
            .from('u_profiles')
            .select('tracking_data')
            .eq('id', window.ccPorted.user.id)
            .single();
        if (error) log('Error fetching tracking data:', error);
        if (data && data.tracking_data) {
            window.ccPortedTrackingData = data.tracking_data;
        } else {
            window.ccPortedTrackingData = { games: {}, total_playtime: 0, chat_messages_sent: 0, pages_visited: {} };
        }
        setupTracking();
        window.ccPorted.stateSync = new GameStateSync(window.ccPorted.user.id, window.ccSupaClient);
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
        window.addEventListener('load', init);
    } catch (err) {
        log("x" + err);
    }
} catch (err) {
    log(err);
}