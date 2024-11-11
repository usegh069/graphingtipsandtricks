document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const profilePicture = document.getElementById('profilePicture');
    const displayName = document.getElementById('displayName');
    const currentPassword = document.getElementById('currentPassword');
    const newPassword = document.getElementById('newPassword');
    const saveButton = document.getElementById('saveChanges');
    const achievementsContainer = document.getElementById('achievementsContainer');
    const profilePictureInput = document.getElementById("profile-picture-upload");

    setProfilePictureLoading();

    // Load user data
    async function loadUserData() {
        try {
            const { data: { user } } = await window.ccSupaClient.auth.getUser();
            if (!user) {
                window.location.href = '/login/';
                return;
            };

            const { data: profile } = await window.ccSupaClient
                .from('u_profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profile) {
                displayName.value = profile.display_name || '';
                if (profile.avatar_url) {
                    profilePicture.src = profile.avatar_url;
                }
                let {data: achievements, error } = await window.ccSupaClient
                    .from('achievements')
                    .select('*')
                    .in('id', profile.achievements);
                if (error) throw error;
                renderAchievements(achievements);
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }
    // Set profile picture loading state
    function setProfilePictureLoading() {
        profilePicture.src = '/assets/images/loading.gif';
    }
    // Handle profile picture upload
    async function handleFileUpload(file) {
        if (!file || !file.type.startsWith('image/')) return;

        try {
            const { data: { user } } = await window.ccSupaClient.auth.getUser();
            if (!user) return;

            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Date.now()}.${fileExt}`;
            const { error: uploadError } = await window.ccSupaClient.storage
                .from('avatars')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = window.ccSupaClient.storage
                .from('avatars')
                .getPublicUrl(fileName);

            profilePicture.src = publicUrl;

            await window.ccSupaClient
                .from('u_profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', user.id);

        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Failed to upload image. Please try again.');
        }
    }

    // Save profile changes
    async function saveChanges() {
        try {
            const { data: { user } } = await window.ccSupaClient.auth.getUser();
            if (!user) return;

            if (displayName.value) {
                await window.ccSupaClient
                    .from('u_profiles')
                    .update({ display_name: displayName.value })
                    .eq('id', user.id);
            }

            if (currentPassword.value && newPassword.value) {
                const { error } = await window.ccSupaClient.auth.updateUser({
                    password: newPassword.value
                });

                if (error) throw error;
                
                currentPassword.value = '';
                newPassword.value = '';
            }

            alert('Changes saved successfully!');
        } catch (error) {
            console.error('Error saving changes:', error);
            alert('Failed to save changes. Please try again.');
        }
    }

    // Render achievements
    function renderAchievements(achievements) {
        achievementsContainer.innerHTML = achievements.map(achievement => `
            <div class="achievement-card" style="border-color: ${achievement.color}">
                <div class="achievement-icon" style="background-color: ${achievement.color}">
                    ${achievement.icon}
                </div>
                <div class="achievement-info">
                    <h3>${achievement.name}</h3>
                    <p>${achievement.description}</p>
                </div>
            </div>
        `).join('');
    }

    // Event Listeners
    profilePictureInput.onchange = (e) => {
        setProfilePictureLoading();
        handleFileUpload(e.target.files[0])
    };

    // Drag and drop support
    const pictureContainer = document.querySelector('.profile-picture-container');

    pictureContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        pictureContainer.classList.add('drag-over');
    });

    pictureContainer.addEventListener('dragleave', () => {
        pictureContainer.classList.remove('drag-over');
    });

    pictureContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        pictureContainer.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        setProfilePictureLoading();
        handleFileUpload(file);
    });

    saveButton.addEventListener('click', saveChanges);

    // Initialize
    loadUserData();
});