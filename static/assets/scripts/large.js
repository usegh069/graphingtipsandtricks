
let trackingWorker = null;

async function registerTrackingWorker() {
    if ('serviceWorker' in navigator) {
        try {
            trackingWorker = await navigator.serviceWorker.register('/tracking_worker.js');
            console.log('Tracking service worker registered');
        } catch (err) {
            alert(err);
            alert('Failed to register tracking service worker:', err);
        }
    }
}

async function initializeTracking() {
    if (!window.ccPorted.user || !navigator.serviceWorker.controller) return;

    // Fetch initial tracking data
    const { data, error } = await window.ccSupaClient
        .from('u_profiles')
        .select('tracking_data')
        .eq('id', window.ccPorted.user.id)
        .single();

    if (error) alert(error);
    
    const trackingData = data?.tracking_data || { 
        games: {}, 
        total_playtime: 0, 
        chat_messages_sent: 0, 
        pages_visited: {} 
    };

    // Initialize the service worker with required data
    navigator.serviceWorker.controller.postMessage({
        type: 'INIT',
        data: {
            supabaseClient: window.ccSupaClient,
            user: window.ccPorted.user,
            trackingData,
            gameID: window.gameID
        }
    });

    // Initialize state sync
    window.ccPorted.stateSync = new GameStateSync(window.ccPorted.user.id, window.ccSupaClient);
    await window.ccPorted.stateSync.initialize();
}

// Update location tracking
function updateLocation() {
    if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
            type: 'UPDATE_LOCATION',
            data: {
                pathname: window.location.pathname
            }
        });
    }
}

// Cleanup function
async function cleanupTracking() {
    if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
            type: 'CLEANUP',
            data: {
                stateSync: window.ccPorted.stateSync
            }
        });
    }
}

// Initialize everything
async function init() {
    await registerTrackingWorker();

    if (window.ccPorted.user) {
        await initializeTracking();
    } else if (window.ccPorted.userPromise) {
        const user = await window.ccPorted.userPromise;
        if (user) {
            window.ccPorted.user = user;
            await initializeTracking();
        }
    }

    // Set up location tracking
    updateLocation();
}

// Event listeners
window.addEventListener('beforeunload', cleanupTracking);
window.addEventListener('popstate', updateLocation);

// Start initialization
try {
    init();
} catch (err) {
    alert('Failed to initialize tracking:', err);
}