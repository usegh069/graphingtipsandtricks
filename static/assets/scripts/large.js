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


function treat(text){
    if(!text) return null;
    return text.split('.').join('');
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
            console.error('Error saving tracking data:', error);
        }
    } catch (err) {
        console.error('Failed to save tracking data:', err);
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
    if(error) alert(error);
    if (data && data.tracking_data) {
        window.ccPortedTrackingData = data.tracking_data;
    } else {
        window.ccPortedTrackingData = { games: {}, total_playtime: 0, chat_messages_sent: 0, pages_visited: {} };
    }
    setupTracking();
    window.ccPorted.stateSync = new GameStateSync(window.ccPorted.user.id,window.ccSupaClient);
    window.ccPorted.stateSync.initialize();
}
async function init() {

    if (window.ccPorted.user) {
        handleUserLoggedIn();
    } else if(window.ccPorted.userPromise){
        const user = await window.ccPorted.userPromise;
        if(user){
            window.ccPorted.user = user;
            handleUserLoggedIn();
        }
    }
}
try{
    init();
}catch(err){
    alert(err);
}