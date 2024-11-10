document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const profilePicture = document.getElementById('profilePicture');
    const displayName = document.getElementById('displayName');
    const currentPassword = document.getElementById('currentPassword');
    const newPassword = document.getElementById('newPassword');
    const saveButton = document.getElementById('saveChanges');
    const achievementsContainer = document.getElementById('achievementsContainer');
    const profilePictureInput = document.getElementById("profile-picture-upload");

    // Achievement data
    const achievements = [
        {
            name: "Early Adopter",
            description: "Joined during the beta phase",
            color: "#FF6B6B",
            icon: "🌟"
        },
        {
            name: "Social Butterfly",
            description: "Connected with 10 other users",
            color: "#4ECDC4",
            icon: "🦋"
        },
        {
            name: "Code Master",
            description: "Successfully ported 5 games",
            color: "#45B7D1",
            icon: "💻"
        },
        {
            name: "Bug Hunter",
            description: "Reported 3 critical bugs",
            color: "#96CEB4",
            icon: "🐛"
        },
        {
            name: "Contributor",
            description: "Made 10 meaningful contributions",
            color: "#FFEEAD",
            icon: "🎮"
        }
    ];

    // Load user data
    async function loadUserData() {
        try {
            const { data: { user } } = await window.ccSupaClient.auth.getUser();
            if (!user) return;

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
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
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
    function renderAchievements() {
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
        handleFileUpload(file);
    });

    saveButton.addEventListener('click', saveChanges);

    // Initialize
    loadUserData();
    renderAchievements();
});