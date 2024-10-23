const SUPABASE_URL = 'https://dahljrdecyiwfjgklnvz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhaGxqcmRlY3lpd2ZqZ2tsbnZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgyNjE3NzMsImV4cCI6MjA0MzgzNzc3M30.8-YlXqSXsYoPTaDlHMpTdqLxfvm89-8zk2HG2MCABRI';

const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
var query = new URLSearchParams(window.location.search);

document.getElementById('login-form').addEventListener('submit', async (e) => {
    log(`Form submitted`);
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const { user, error } = await client.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (localStorage.getItem('redirect')) {
            log(`Redirecting to ${localStorage.getItem('redirect')}`);
            window.location.href = localStorage.getItem('redirect');
            localStorage.removeItem('redirect');
            return;
        }
        window.location.href = '/chat/index.html';
    } catch (error) {
        log(`Error:`, error);
        alert(error.message);
    }
});