function onload() {
    const navigation = document.querySelector('header .r-side-nav');
    window.ccPorted = window.ccPorted || {};
    if (navigation) {
        const currentLocation = window.location.pathname;
        log("Current location", currentLocation);
        navigation.querySelectorAll('a').forEach((link) => {
            if (link.getAttribute('href') == currentLocation) {
                link.classList.add('link-active');
                link.classList.add('cc');
            }
        });
        if (currentLocation !== "/") {
            log("Adding back button");
            document.querySelector("header").querySelector("h1").innerHTML = "";
            const back = document.createElement("a");
            back.href = "/";
            back.innerHTML = "Home";
            back.classList.add("cc");
            document.querySelector("header").querySelector("h1").appendChild(back);

        }
    }
}
window.onload = onload;
function log(...args) {
    console.log("[CCPORTED]: ", ...args);
}
window.user = {};
window.ccPorted = window.ccPorted || {};

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