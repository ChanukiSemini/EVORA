import { useState } from 'react';
import Icon from './Icon.jsx';

/**
 * ProfileCard Component.
 * Renders user avatar and personal fields. In read-only mode, fields are displayed as text.
 * When isEditing is active, fields (Name, Email, Phone) transform into inputs.
 * The Password field's editing behaviour stays independent.
 *
 * Props:
 *  user           — driver object from backend (name, email, phone, avatarUrl)
 *  isEditing      — boolean, controls read/edit mode
 *  isSaving       — boolean, disables Save button while the PATCH request is in flight
 *  onSave(draft)  — called with the full draft object when Save Changes is submitted
 *  onEdit()       — called when the Edit Profile button is clicked
 *  onPasswordEdit()   — called when the password edit icon is clicked
 *  onDeleteRequest()  — called when the Delete Profile button is clicked
 */
export default function ProfileCard({ user, isEditing, isSaving, onSave, onEdit, onPasswordEdit, onDeleteRequest }) {
    const [draft, setDraft]             = useState(user);
    const [prevUser, setPrevUser]       = useState(user);
    const [isPhotoMenuOpen, setIsPhotoMenuOpen] = useState(false);

    // Keep draft in sync with any external updates to `user` (e.g. after a successful PATCH)
    if (user !== prevUser) {
        setPrevUser(user);
        setDraft(user);
    }

    const handleChange = (field, value) => {
        setDraft((current) => ({ ...current, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(draft);
    };

    return (
        <form className="card profile-card" onSubmit={handleSubmit}>
            <div className="profile-card__header">
                <div className="profile-avatar-shell" style={{ position: 'relative' }}>
                    <img src={draft.avatarUrl} alt={draft.name} className="profile-avatar" />
                    <button className="photo-btn" type="button" aria-label="Change profile photo" onClick={() => setIsPhotoMenuOpen((prev) => !prev)}>
                        <Icon name="icon-camera" size={16} />
                    </button>
                    {isPhotoMenuOpen && (
                        <div className="photo-menu-popover">
                            <button type="button" className="photo-menu-item" onClick={() => setIsPhotoMenuOpen(false)}>
                                <span style={{ marginRight: '8px' }}>📷</span> Take Photo
                            </button>
                            <button type="button" className="photo-menu-item" onClick={() => setIsPhotoMenuOpen(false)}>
                                <span style={{ marginRight: '8px' }}>📁</span> Upload Photo
                            </button>
                        </div>
                    )}
                </div>
                <div className="profile-card__intro">
                    <h2>{draft.name}</h2>
                    <br />
                </div>
            </div>

            <div className="profile-info-list grid-layout">
                {/* Full Name */}
                <div className="info-row profile-info-row">
                    <div className="profile-input-group">
                        <span className="profile-label">Full Name</span>
                        {isEditing ? (
                            <input
                                value={draft.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                required
                            />
                        ) : (
                            <div className="profile-value">{draft.name}</div>
                        )}
                    </div>
                </div>

                {/* Email */}
                <div className="info-row profile-info-row">
                    <div className="profile-input-group">
                        <span className="profile-label">Email</span>
                        {isEditing ? (
                            <input
                                type="email"
                                value={draft.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                required
                            />
                        ) : (
                            <div className="profile-value">{draft.email}</div>
                        )}
                    </div>
                </div>

                {/* Phone */}
                <div className="info-row profile-info-row">
                    <div className="profile-input-group">
                        <span className="profile-label">Phone</span>
                        {isEditing ? (
                            <input
                                type="tel"
                                value={draft.phone ?? ''}
                                onChange={(e) => handleChange('phone', e.target.value)}
                            />
                        ) : (
                            <div className="profile-value">{draft.phone || '—'}</div>
                        )}
                    </div>
                </div>

                {/* Password — edit stays independent of the profile info toggle */}
                <div className="info-row profile-info-row">
                    <div className="profile-input-group">
                        <span className="profile-label">Password</span>
                        <div className="profile-value">••••••••••••</div>
                    </div>
                    <button className="icon-action" type="button" aria-label="Edit password" onClick={onPasswordEdit}>
                        <Icon name="icon-edit" size={16} />
                    </button>
                </div>

                {/* Action row — Save/Edit toggle */}
                {isEditing ? (
                    <button
                        className="submit-btn full-width"
                        type="submit"
                        disabled={isSaving}
                        style={{ gridColumn: '1 / -1', marginTop: '1rem' }}
                    >
                        {isSaving ? 'Saving…' : 'Save Changes'}
                    </button>
                ) : (
                    <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                        <button className="btn-secondary secondary-btn" type="button" onClick={onEdit}>
                            <span>Edit Profile</span>
                        </button>
                    </div>
                )}

                {/* ── Delete Profile — only visible in read mode ── */}
                {!isEditing && (
                    <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                        <button className="btn-danger" type="button" onClick={onDeleteRequest}
                        >
                            Delete Profile
                        </button>
                    </div>
                )}
            </div>
        </form>
    );
}
