
const supabaseUrl = 'https://dahljrdecyiwfjgklnvz.supabase.co';
const supabaseKey = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhaGxqcmRlY3lpd2ZqZ2tsbnZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgyNjE3NzMsImV4cCI6MjA0MzgzNzc3M30.8-YlXqSXsYoPTaDlHMpTdqLxfvm89-8zk2HG2MCABRI`
const client = supabase.createClient(supabaseUrl, supabaseKey);

var searchInput = document.getElementById("searchBox");
const cards = document.querySelectorAll('.card');
const cardsContainer = document.querySelector(".cards");
const cardsList = Array.from(cards)
cards.forEach(card => {
    const id = card.getAttribute('id');
    markGameSeen(id);
});
function markGameSeen(id) {
    localStorage.setItem(`seen-${id}`, "yes");
}

var feilds = [".card-content .card-title", ".card-content .card-description", ".card-content .card-tags .tag"];

searchInput.addEventListener("input", (e) => {
    var matching = cardsList.map((card) => {
        var score = 0;
        feilds.forEach(feild => {
            var allFeilds = card.querySelectorAll(feild);
            for (var i = 0; i < allFeilds.length; i++) {
                var string = normalize(allFeilds[i].innerText);
                if (string.indexOf(normalize(searchInput.value)) !== -1) {
                    score++;
                }
            }
        })
        return [score, card]
    });
    matching = matching.sort((a, b) => {
        return b[0] - a[0]
    });
    cardsContainer.innerHTML = "";
    matching.forEach((card) => {
        if (card[0] == 0) return;
        cardsContainer.appendChild(card[1])
    })
});

function normalize(string) {
    string = string.toLowerCase();
    string = string.replace(/[^a-z0-9]/g, "");
    string = string.replace(/\s/g, "");
    return string;
}

var allTags = document.querySelectorAll(".tag");
allTags.forEach(tag => {
    tag.addEventListener("click", () => {
        searchInput.value = tag.innerText;
        searchInput.dispatchEvent(new Event("input"));
    })
})


const addGameRequest = async (game_name) => {
    try {
        const { data, error } = await client
            .from('CCPorted Game RQs')
            .insert([
                { game_name: game_name }
            ]);

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error adding game request:', error.message);
        throw error;
    }
};
window.gameRQPopupOpen = false;
const addGameRequestButton = document.getElementById("addGameRequestButton");
addGameRequestButton.addEventListener("click", () => {
    createAddGamePopup();
    const sendButton = document.getElementById("sendGameRequestButton");
    const nvmdButton = document.getElementById("nvmd");
    const popup = document.querySelector(".popup");

    popup.addEventListener("click", (e) => {
        if (e.target == popup) {
            closePopup();
        }
    });
    nvmdButton.addEventListener("click", () => {
        closePopup();
    });
    sendButton.addEventListener("click", () => {
        const input = document.getElementById("gameRequestInput");
        addGameRequest(input.value);
        closePopup();
    });

})
function createAddGamePopup(){
    const popup = document.createElement("div");
    popup.classList.add("popup");
    popup.innerHTML = `
        <div class="popup-content">
            <h2>Request a game</h2>
            <input type="text" id="gameRequestInput" placeholder="Game name">
            <div class = "popup-buttons">
                <button id = "nvmd">Close</button><button id="sendGameRequestButton">Send</button>
            </div>
        </div>
    `;
    document.body.appendChild(popup);
    window.gameRQPopupOpen = true;
    return popup;
}

function closePopup(){
    document.querySelector(".popup").remove();
    window.gameRQPopupOpen = false;
}

document.addEventListener("keydown", (e) => {
    if (e.key == "Escape" && window.gameRQPopupOpen) {
        closePopup();
    }
    if(e.key == "Enter" && window.gameRQPopupOpen){
        document.getElementById("sendGameRequestButton").click();
    }
});