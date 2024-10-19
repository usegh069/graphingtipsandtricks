const SUPABASE_URL = 'https://dahljrdecyiwfjgklnvz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhaGxqcmRlY3lpd2ZqZ2tsbnZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgyNjE3NzMsImV4cCI6MjA0MzgzNzc3M30.8-YlXqSXsYoPTaDlHMpTdqLxfvm89-8zk2HG2MCABRI';
const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const chatMessages = document.getElementById('chat-messages');
const logoutBtn = document.getElementById('logout-btn');

const sidebar = document.querySelector(".sidebar");
sidebar.addEventListener("mouseover",(e)=>{
    sidebar.classList.add("expanded")
});
sidebar.addEventListener("mouseout",(e)=>{
    sidebar.classList.remove("expanded");
});
const sArrow = document.querySelector(".sidebar .arrow");
sArrow.addEventListener("click",()=>{
    sidebar.classList.toggle("expanded")
})
const url = new URL(window.location);
const query = new URLSearchParams(url);
const channel = query.get("channel") || "1b81d7ae-9035-4280-b667-ad9c8bad9311"; // public channel
let currentUser;
let penaltyCount = 0;
let lastMessageTime = 0;
let currentChannel = channel;

async function init() {
    const { data: { user } } = await client.auth.getUser();
    if (!user) {
        window.location.href = '/login';
        return;
    }
    currentUser = user;
    const { data, error } = await client
        .from('u_profiles')
        .update({ 'current_channel': currentChannel })
        .eq('id', user.id)
        const { data2, error2 } = await client
            .from('chat_channels')
            .update({ 'joined_users': supabase.sql`array_append(joined_users,${currentUser.id}` })
            //.update({ 'joined_users': client.raw('array_append(joined_users, ?)', [currentUser.id]) })
            .eq('id', currentChannel)
            .select();

    if (error) alert(JSON.stringify(error));
    if (error2) alert(JSON.stringify(error2));
    setupRealtime(currentChannel);
    loadMessages();
    loadChannels();
}

function setupRealtime(channelId) {
    client
        .channel('public:chat_messages')
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'chat_messages',
                filter: `channel_id=eq.${channelId}`
            },
            handleNewMessage
        )
        .subscribe();
}
async function loadChannels() {
    const { data: rows, error } = await client
        .from('chat_channels')
        .select('*')
        .contains('joined_users', [currentUser.id])
    if (error) throw error;
    var channelList = document.getElementById('channel-list');
    rows.forEach(channel => {
        var li = document.createElement("li");
        var a = document.createElement("a")
        a.setAttribute("href", `?channel=${channel.id}`);
        a.innerText = channel.friendly_name;

        li.appendChild(a);
        channelList.appendChild(li);
    })
}
async function loadMessages() {
    const { data, error } = await client
        .from('chat_messages')
        .select('*')
        .eq('channel_id', currentChannel)
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error loading messages:', error);
        return;
    }

    data.forEach(message => {
        appendMessage(message);
    });
}

function handleNewMessage(payload) {
    appendMessage(payload.new);
}

function appendMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.textContent = `${message.display_name}: ${message.content}`;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sanitizeMessage(message) {
    // Basic XSS protection
    // return message.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return message;
}

function containsSwearWords(message) {
    // Add your list of swear words here
    const swearWords = ['fuck', 'shit', 'ass'];
    return swearWords.some(word => message.toLowerCase().includes(word));
}

function calculatePenalty() {
    const penalties = [5, 25, 60, 180, 360, 720];
    const penaltyMinutes = penalties[Math.min(penaltyCount, penalties.length - 1)];
    return penaltyMinutes * 60 * 1000; // Convert to milliseconds
}

messageForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = sanitizeMessage(messageInput.value.trim());
    if (!message) return;

    const now = Date.now();
    if (now - lastMessageTime < calculatePenalty()) {
        alert(`You are temporarily blocked from sending messages. Please wait.`);
        return;
    }

    if (containsSwearWords(message)) {
        penaltyCount++;
        lastMessageTime = now;
        alert(`Your message contains inappropriate language. You are blocked for ${calculatePenalty() / (60 * 1000)} minutes.`);
        return;
    }

    try {
        const { data, error } = await client
            .from('chat_messages')
            .insert([{ content: message, user_id: currentUser.id, display_name: currentUser.user_metadata.display_name, channel_id: currentChannel }]);

        if (error) throw error;
        messageInput.value = '';
    } catch (error) {
        console.error('Error sending message:', error);
        alert("Error sending message")
    }
});

logoutBtn.addEventListener('click', async () => {
    await client.auth.signOut();
    window.location.href = 'login.html';
});

init();
