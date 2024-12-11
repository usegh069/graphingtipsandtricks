window.ccPorted = window.ccPorted || {};
if (typeof supabase === "undefined") {
    log("Supabase script not installed, installing");
    installSupascript().then(() => {
        log("Supabase script loaded");
        postSupaInstall();
    });
} else {
    try {
        if (!window.ccSupaClient) window.ccSupaClient = createClient();
        postSupaInstall();
    } catch (e) {
        log("Error occured when creating client, or during postSupaInstall"+"\n"+e.stack);
    }
}
async function postSupaInstall() {
    window.ccPorted.userPromise = new Promise((resolve, reject) => {
        window.ccSupaClient.auth.getUser().then(({ data }) => {
            try {
                const { user } = data;
                window.user = user;
                window.ccPorted.user = user;
                if (user && document.getElementById("loggedInReplacable")) {
                    document.getElementById("loggedInReplacable").innerHTML = `<a href="/profile/" class="cc">${user.user_metadata.display_name}</a>`;
                }
                resolve(user);
            } catch (err) {
                reject(err);
            }
        });
    });
    window.user = {};
    window.ccPorted = window.ccPorted || {};
}
function log(...args) {
    console.log("[CCPORTED]: ", ...args);
    if (window.ccPorted?.stats) {
        window.ccPorted.stats.log(...args);
    }
}
async function importJSON(path) {
    let url;
    if (path.startsWith("/") && !path.startsWith("//")) {
        url = new URL(path, window.location.origin);
    } else {
        url = new URL(path);
    }
    url.searchParams.append('_', Date.now());

    const res = await fetch(path, {
        method: "GET",
        headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        }
    });
    return res.json();
}
function installSupascript() {
    log("Installing Supabase script");
    const script = document.createElement("script");
    script.src = "https://unpkg.com/@supabase/supabase-js@2";
    document.head.appendChild(script);
    const loadPromise = new Promise((r, rr) => {
        script.onload = () => {
            window.ccSupaClient = createClient();
            r();
        }
    });

    return loadPromise;
}
function createClient() {
    const SUPABASE_URL = 'https://dahljrdecyiwfjgklnvz.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhaGxqcmRlY3lpd2ZqZ2tsbnZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgyNjE3NzMsImV4cCI6MjA0MzgzNzc3M30.8-YlXqSXsYoPTaDlHMpTdqLxfvm89-8zk2HG2MCABRI';
    return supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
function shortcut(keys, cb) {
    log(`Creating shortcut for keys ${keys}, calling ${cb.name}`);
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