import { useState, useRef, useEffect } from 'react';
import Icon from './Icon.jsx';

/**
 * ProfileCard Component.
 * Renders user avatar and personal fields. In read-only mode, fields are displayed as text.
 * When isEditing is active, fields (Name, Email, Phone) transform into inputs.
 * The Password field's editing behaviour triggers onPasswordEdit modal.
 */
export default function ProfileCard({ user, isEditing, isSaving, onSave, onEdit, onPasswordEdit, onDeleteRequest }) {
    const defaultUser = {
        name: user?.name || user?.fullName || 'EV Driver',
        email: user?.email || '',
        phone: user?.phone || '',
        avatarUrl: user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    };

    const [draft, setDraft] = useState(defaultUser);
    const [isPhotoMenuOpen, setIsPhotoMenuOpen] = useState(false);
    const fileInputRef = useRef(null);

    // Keep draft in sync with external user state
    useEffect(() => {
        if (user) {
            setDraft({
                name: user.name || user.fullName || 'EV Driver',
                email: user.email || '',
                phone: user.phone || '',
                avatarUrl: user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
            });
        }
    }, [user]);

    const handleChange = (field, value) => {
        setDraft((current) => ({ ...current, [field]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (typeof reader.result === 'string') {
                    setDraft((current) => ({ ...current, avatarUrl: reader.result }));
                }
            };
            reader.readAsDataURL(file);
        }
        setIsPhotoMenuOpen(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(draft);
    };

    return (
        <form className="card profile-card" onSubmit={handleSubmit}>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleFileChange}
            />

            <div className="profile-card__header">
                <div className="profile-avatar-shell" style={{ position: 'relative' }}>
                    <img
                        src={draft.avatarUrl}
                        alt={draft.name}
                        className="profile-avatar"
                        onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';
                        }}
                    />
                    <button
                        className="photo-btn"
                        type="button"
                        aria-label="Change profile photo"
                        onClick={() => setIsPhotoMenuOpen((prev) => !prev)}
                    >
                        <Icon name="icon-camera" size={16} />
                    </button>
                    {isPhotoMenuOpen && (
                        <div className="photo-menu-popover">
                            <button
                                type="button"
                                className="photo-menu-item"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <span style={{ marginRight: '8px' }}>📁</span> Upload Photo
                            </button>
                            <button
                                type="button"
                                className="photo-menu-item"
                                onClick={() => {
                                    setDraft(curr => ({ ...curr, avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80' }));
                                    setIsPhotoMenuOpen(false);
                                }}
                            >
                                <span style={{ marginRight: '8px' }}>👤</span> Use Default Avatar
                            </button>
                        </div>
                    )}
                </div>
                <div className="profile-card__intro">
                    <h2>{draft.name}</h2>
                    <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)' }}>
                        {user?.role ? user.role.toUpperCase() : 'DRIVER'} ACCOUNT
                    </span>
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

                {/* Password — edit stays independent */}
                <div className="info-row profile-info-row">
                    <div className="profile-input-group">
                        <span className="profile-label">Password</span>
                        <div className="profile-value">••••••••••••</div>
                    </div>
                    <button
                        className="icon-action"
                        type="button"
                        aria-label="Edit password"
                        onClick={onPasswordEdit}
                        title="Change Password"
                    >
                        <Icon name="icon-edit" size={16} />
                    </button>
                </div>

                {/* Action row — Save/Edit toggle */}
                {isEditing ? (
                    <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px', marginTop: '1rem' }}>
                        <button
                            className="btn-secondary secondary-btn"
                            type="button"
                            onClick={() => {
                                setDraft(defaultUser);
                                onEdit(false);
                            }}
                            style={{ flex: 1 }}
                        >
                            Cancel
                        </button>
                        <button
                            className="submit-btn"
                            type="submit"
                            disabled={isSaving}
                            style={{ flex: 2 }}
                        >
                            {isSaving ? 'Saving…' : 'Save Changes'}
                        </button>
                    </div>
                ) : (
                    <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                        <button
                            className="btn-secondary secondary-btn"
                            type="button"
                            onClick={() => onEdit(true)}
                        >
                            <span>Edit Profile</span>
                        </button>
                    </div>
                )}

                {/* ── Delete Profile — only visible in read mode ── */}
                {!isEditing && (
                    <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                        <button
                            className="btn-danger"
                            type="button"
                            onClick={onDeleteRequest}
                        >
                            Delete Profile
                        </button>
                    </div>
                )}
            </div>
        </form>
    );
}
