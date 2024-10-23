const SUPABASE_URL = 'https://dahljrdecyiwfjgklnvz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhaGxqcmRlY3lpd2ZqZ2tsbnZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgyNjE3NzMsImV4cCI6MjA0MzgzNzc3M30.8-YlXqSXsYoPTaDlHMpTdqLxfvm89-8zk2HG2MCABRI';
    
const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.getElementById('signup-form').addEventListener('submit', async (e) => {
    log(`Form submitted`);
    e.preventDefault();
    const displayName = document.getElementById('display-name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Sign up the user
        const { data: {user}, error: signUpError } = await client.auth.signUp({ 
            email, 
            password,
            options: {
                data: {
                    display_name: displayName
                }
            }
        });
        if (signUpError) throw signUpError;

        // If sign up is successful, update the user's profile in the profiles table
        if (!signUpError) {
            log(`User signed up with email ${email}`);
            const { error: insertError } = await client
                .from('u_profiles')
                .insert({ id: user.id });

            if (insertError) throw insertError;

            alert('Signup successful! Please check your email for verification.');
            if(localStorage.getItem('redirect')) {
                log(`Redirecting to ${localStorage.getItem('redirect')}`);
                window.location.href = localStorage.getItem('redirect');
                localStorage.removeItem('redirect');
                return;
            }
            window.location.href = '/login';
        }
    } catch (error) {
        alert(error.message);
    }
    return false;
});