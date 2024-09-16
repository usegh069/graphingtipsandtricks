const script = document.currentScript;
alert("gtag script registered")
var gameID = script.getAttribute("data-gameID");

function emit(){
    gtag("event","play_game",{
        gameID,
        location: window.location.hostname
    });
}
emit();
setInterval(emit, 1000 * 60 * 10);