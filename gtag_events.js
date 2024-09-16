const script = document.currentScript;
alert("script registered")

var gameID = script.getAttribute("data-gameID");

function emit(){
    alert(`logging event play ${gameID}, ${typeof gtag}`)
    gtag("event","play_game",{
        gameID,
        location: window.location.hostname
    });
}
emit();
setInterval(emit, 1000 * 60 * 10);