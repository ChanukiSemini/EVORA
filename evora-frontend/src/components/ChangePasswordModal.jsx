// src/components/ChangePasswordModal.jsx
import { useState } from 'react';

const ChangePasswordModal = ({ onClose, onSavePassword, isSaving, error }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [validationError, setValidationError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setValidationError('');

        if (newPassword.length < 6) {
            setValidationError('New password must be at least 6 characters long.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setValidationError('New passwords do not match.');
            return;
        }

        onSavePassword({ currentPassword, newPassword });
    };

    return (
        <div className="bc-modal-backdrop modal-overlay" onClick={onClose}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 420 }}>
                <div style={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    background: 'rgba(61, 220, 151, 0.12)',
                    border: '1.5px solid var(--accent-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto var(--space-4)',
                    color: 'var(--accent-primary)',
                    fontSize: 22
                }}>
                    🔒
                </div>

                <h3 style={{
                    fontSize: 'var(--text-xl)',
                    fontWeight: 'var(--font-bold)',
                    color: 'var(--text-primary)',
                    textAlign: 'center',
                    marginBottom: 'var(--space-2)'
                }}>
                    Change Password
                </h3>

                <p style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--text-secondary)',
                    textAlign: 'center',
                    marginBottom: 'var(--space-5)'
                }}>
                    Update your account password. Choose a strong combination of letters and numbers.
                </p>

                {(validationError || error) && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: 8,
                        padding: '8px 12px',
                        color: 'var(--status-cancelled, #ef4444)',
                        fontSize: 'var(--text-xs)',
                        marginBottom: 'var(--space-4)',
                        textAlign: 'center'
                    }}>
                        {validationError || error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div className="profile-input-group">
                        <span className="profile-label">Current Password</span>
                        <input
                            type="password"
                            placeholder="Enter current password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                    </div>

                    <div className="profile-input-group">
                        <span className="profile-label">New Password</span>
                        <input
                            type="password"
                            placeholder="At least 6 characters"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="profile-input-group">
                        <span className="profile-label">Confirm New Password</span>
                        <input
                            type="password"
                            placeholder="Re-enter new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={onClose}
                            style={{ flex: 1 }}
                            disabled={isSaving}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="submit-btn"
                            style={{ flex: 1.5 }}
                            disabled={isSaving}
                        >
                            {isSaving ? 'Updating…' : 'Update Password'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordModal;
