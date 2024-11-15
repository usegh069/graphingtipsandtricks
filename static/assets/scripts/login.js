const client = window.ccSupaClient;

let query = new URLSearchParams(window.location.search);

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
        window.location.href = '/profile/';
    } catch (error) {
        log(`Error:`, error);
        alert(error.message);
    }
});