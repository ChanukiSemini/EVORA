import { useState } from 'react';
import ProfileCard from '../components/ProfileCard.jsx';
const USER = {
    name: 'Sarah Jenkins',
    email: 'sarah.j@evora-charge.com',
    avatarUrl:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
};

/**
 * Personal Details Page Component.
 * Displays the user profile card and manages global edit/read states.
 */
export default function Profile() {
    const [userState, setUserState] = useState({
        ...USER,
        phone: '+1 (512) 555-0147',
        password: 'password123',
    });

    // Save callback commits state to mock DB placeholder
    const [isEditing, setIsEditing] = useState(false);

    const enableEdit = () => setIsEditing(true);

    const saveAndExit = (updatedUser) => {
        // TODO: send updated profile to backend API
        if (updatedUser) {
            setUserState(updatedUser);
        }
        setIsEditing(false);
    };

    const handlePasswordEdit = () => {
        alert('Mock action: Redirecting to dedicated Change Password flow.');
    };

    return (
        <section className="profile-page">
            <div className="profile-shell">
                <div className="section-heading">
                    <h3>Personal Details</h3>
                </div>
                <div className="profile-stack">
                    <ProfileCard
                        user={userState}
                        isEditing={isEditing}
                        onSave={saveAndExit}
                        onEdit={enableEdit}
                        onPasswordEdit={handlePasswordEdit}
                    />
                </div>
            </div>
        </section>
    );
}
