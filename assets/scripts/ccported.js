const navigation = document.querySelector('header .r-side-nav');
if(navigation){
    const currentLocation = window.location.pathname;
    log("Current location",currentLocation);
    navigation.querySelectorAll('a').forEach((link)=>{
        if(link.getAttribute('href') == currentLocation){
            link.classList.add('link-active');
            link.classList.add('cc');
        }
    });
}
function log(...args){
    alert(`[CCPORTED]: ` + args.join(" "))
    console.log("[CCPORTED]: ",...args);
}