// ============================================
// src/pages/Profile.jsx
// EVORA - Personal Details & Profile Management Page
// Connected directly to MongoDB Atlas via EVORA Backend API
// Features: Live profile fetch, profile update (name, email, phone, avatar),
// password update, and profile deletion/deactivation.
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import IconSprite from '../components/IconSprite';
import ProfileCard from '../components/ProfileCard.jsx';
import ChangePasswordModal from '../components/ChangePasswordModal.jsx';

// ─────────────────────────────────────────────
// API Base URL
// ─────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Helper to resolve the active user/driver ID from localStorage
const getActiveDriverId = () => {
    try {
        const stored = JSON.parse(
            localStorage.getItem('evora_current_user') ||
            localStorage.getItem('evora_driver_user') ||
            localStorage.getItem('evora_host_user') ||
            '{}'
        );
        if (stored._id || stored.id) {
            return stored._id || stored.id;
        }
    } catch {
        // ignore
    }
    return '6a9ecddc103ad8f044455e39';
};

// ─────────────────────────────────────────────
// API calls
// ─────────────────────────────────────────────
async function fetchDriverProfile(driverId) {
    const res = await fetch(`${BASE_URL}/api/drivers/${driverId}`);
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to load profile.');
    }
    return res.json();
}

async function updateDriverProfile(driverId, updates) {
    const res = await fetch(`${BASE_URL}/api/drivers/${driverId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to update profile.');
    }
    return res.json();
}

async function updateDriverPassword(driverId, passwords) {
    const res = await fetch(`${BASE_URL}/api/drivers/${driverId}/password`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(passwords),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to update password.');
    }
    return res.json();
}

async function deleteDriverProfile(driverId) {
    const res = await fetch(`${BASE_URL}/api/drivers/${driverId}`, {
        method: 'DELETE',
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to delete profile.');
    }
    return res.json();
}

// ─────────────────────────────────────────────
// Shared Inner Profile Content Component
// ─────────────────────────────────────────────
function ProfileContent({
    driver,
    isEditing,
    isSaving,
    onSave,
    onEdit,
    onPasswordEdit,
    onDeleteRequest
}) {
    return (
        <section className="profile-page">
            <div className="profile-shell">
                <div className="section-heading">
                    <h3>Personal Details</h3>
                </div>
                <div className="profile-stack">
                    <ProfileCard
                        user={driver}
                        isEditing={isEditing}
                        isSaving={isSaving}
                        onSave={onSave}
                        onEdit={onEdit}
                        onPasswordEdit={onPasswordEdit}
                        onDeleteRequest={onDeleteRequest}
                    />
                </div>
            </div>
        </section>
    );
}

export default function Profile() {
    const navigate = useNavigate();

    // ── Layout state ──
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // ── Profile data state ──
    const [driver, setDriver] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);

    // ── Edit & Save state ──
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveFeedback, setSaveFeedback] = useState(null); // { type: 'success' | 'error', message: string }

    // ── Password Modal state ──
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [isSavingPassword, setIsSavingPassword] = useState(false);
    const [passwordError, setPasswordError] = useState(null);

    // ── Delete Confirmation state ──
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);
    const [isDeletedSuccess, setIsDeletedSuccess] = useState(false);

    // ── Fetch Profile from Database ──
    const loadProfile = useCallback(async () => {
        setIsLoading(true);
        setLoadError(null);
        const driverId = getActiveDriverId();

        try {
            const data = await fetchDriverProfile(driverId);
            setDriver(data);
            setIsLoading(false);
        } catch (err) {
            console.error('Error fetching driver profile:', err);
            setLoadError(err.message || 'Unable to load profile data');
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    // ── Handle Save Profile ──
    const handleSave = async (draft) => {
        setIsSaving(true);
        setSaveFeedback(null);
        const driverId = driver?._id || driver?.id || getActiveDriverId();

        try {
            const result = await updateDriverProfile(driverId, {
                name: draft.name,
                fullName: draft.name,
                email: draft.email,
                phone: draft.phone,
                avatarUrl: draft.avatarUrl,
            });

            const updatedData = result.driver || result;
            setDriver(updatedData);
            setIsEditing(false);
            setIsSaving(false);

            // Synchronize with localStorage
            try {
                const stored = JSON.parse(localStorage.getItem('evora_current_user') || '{}');
                localStorage.setItem('evora_current_user', JSON.stringify({
                    ...stored,
                    ...updatedData,
                    name: updatedData.name,
                    fullName: updatedData.fullName || updatedData.name,
                    email: updatedData.email,
                    phone: updatedData.phone,
                    avatarUrl: updatedData.avatarUrl
                }));
            } catch {
                // ignore
            }

            setSaveFeedback({ type: 'success', message: 'Profile updated successfully!' });
            setTimeout(() => setSaveFeedback(null), 4000);
        } catch (err) {
            console.error('Save profile error:', err);
            setIsSaving(false);
            setSaveFeedback({ type: 'error', message: err.message || 'Failed to save changes.' });
        }
    };

    // ── Handle Password Update ──
    const handleSavePassword = async ({ currentPassword, newPassword }) => {
        setIsSavingPassword(true);
        setPasswordError(null);
        const driverId = driver?._id || driver?.id || getActiveDriverId();

        try {
            await updateDriverPassword(driverId, { currentPassword, newPassword });
            setIsSavingPassword(false);
            setShowPasswordModal(false);
            setSaveFeedback({ type: 'success', message: 'Password updated successfully!' });
            setTimeout(() => setSaveFeedback(null), 4000);
        } catch (err) {
            console.error('Password update error:', err);
            setIsSavingPassword(false);
            setPasswordError(err.message || 'Failed to update password.');
        }
    };

    // ── Handle Delete / Deactivate Profile ──
    const handleDeleteConfirm = async () => {
        setIsDeleting(true);
        setDeleteError(null);
        const driverId = driver?._id || driver?.id || getActiveDriverId();

        try {
            await deleteDriverProfile(driverId);
            setIsDeleting(false);
            setShowDeleteConfirm(false);
            setIsDeletedSuccess(true);

            // Clear session storage
            localStorage.removeItem('evora_token');
            localStorage.removeItem('evora_current_user');
            localStorage.removeItem('evora_driver_user');
            localStorage.removeItem('evora_host_user');

            setTimeout(() => {
                navigate('/login');
            }, 2500);
        } catch (err) {
            console.error('Delete profile error:', err);
            setIsDeleting(false);
            setDeleteError(err.message || 'Failed to delete profile. Please try again.');
        }
    };

    // ─── Guard: Loading State ───
    if (isLoading) {
        return (
            <div className="app-shell desktop-only" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                <p style={{ color: 'var(--text-secondary)' }}>Loading profile details from database…</p>
            </div>
        );
    }

    // ─── Guard: Load Error State ───
    if (loadError) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: '#ff4d6d', flexDirection: 'column', gap: '1rem', textAlign: 'center', padding: '2rem' }}>
                <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>{loadError}</p>
                <button className="btn-secondary secondary-btn" onClick={loadProfile}>
                    Retry
                </button>
            </div>
        );
    }

    // ─── Guard: Deleted / Deactivated State ───
    if (isDeletedSuccess) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '1rem', color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(239,68,68,0.12)', border: '2px solid var(--status-cancelled)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--status-cancelled)', fontSize: 28 }}>
                    ✓
                </div>
                <h2 style={{ color: 'var(--text-primary)', marginTop: '0.5rem' }}>Profile Deleted</h2>
                <p>Your account has been deleted from the database. Redirecting to login…</p>
            </div>
        );
    }

    return (
        <>
            <IconSprite />

            {/* ════════════════════════════════
                MOBILE LAYOUT (hidden ≥ 768px)
                ════════════════════════════════ */}
            <div className="evora-screen mobile-only">
                <div className="nav-bar">
                    <button className="nav-back" onClick={() => navigate(-1)} title="Back">←</button>
                    <span className="nav-title">Personal Details</span>
                    <button className="nav-hamburger" onClick={() => setIsMobileMenuOpen(true)} title="Menu">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                            <line x1="4" y1="6" x2="20" y2="6" />
                            <line x1="4" y1="12" x2="20" y2="12" />
                            <line x1="4" y1="18" x2="20" y2="18" />
                        </svg>
                    </button>
                </div>

                <ProfileContent
                    driver={driver}
                    isEditing={isEditing}
                    isSaving={isSaving}
                    onSave={handleSave}
                    onEdit={(val) => setIsEditing(val ?? true)}
                    onPasswordEdit={() => { setPasswordError(null); setShowPasswordModal(true); }}
                    onDeleteRequest={() => { setDeleteError(null); setShowDeleteConfirm(true); }}
                />

                {/* Mobile Navigation Drawer Overlay */}
                {isMobileMenuOpen && (
                    <div className="mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)}>
                        <div className="mobile-menu-drawer" onClick={(e) => e.stopPropagation()}>
                            <div className="mobile-menu-header">
                                <div className="mobile-menu-logo">
                                    <span className="logo-icon">⚡</span>
                                    <span className="logo-text">Evora</span>
                                </div>
                                <button className="mobile-menu-close" onClick={() => setIsMobileMenuOpen(false)}>✕</button>
                            </div>
                            <nav className="mobile-menu-nav">
                                <div className="mobile-menu-item" onClick={() => { navigate('/dashboard'); setIsMobileMenuOpen(false); }}>
                                    <span>📊</span> Dashboard / Home
                                </div>
                                <div className="mobile-menu-item" onClick={() => { navigate('/book-charger'); setIsMobileMenuOpen(false); }}>
                                    <span>⚡</span> Book a Charger
                                </div>
                                <div className="mobile-menu-item" onClick={() => { navigate('/bookings'); setIsMobileMenuOpen(false); }}>
                                    <span>📅</span> My Reservations
                                </div>
                                <div className="mobile-menu-item" onClick={() => { navigate('/vehicles'); setIsMobileMenuOpen(false); }}>
                                    <span>🚗</span> My Vehicles
                                </div>
                                <div className="mobile-menu-item active" onClick={() => { navigate('/profile'); setIsMobileMenuOpen(false); }}>
                                    <span>👤</span> Personal Details
                                </div>
                            </nav>
                            <div className="mobile-menu-footer">
                                <div className="mobile-user-card">
                                    <div className="mobile-user-avatar">
                                        {(driver?.name || 'EV').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                    </div>
                                    <div className="mobile-user-info">
                                        <span className="mobile-user-name">{driver?.name}</span>
                                        <span className="mobile-user-email">{driver?.email}</span>
                                    </div>
                                </div>
                                <button
                                    className="mobile-logout-btn"
                                    onClick={() => {
                                        localStorage.clear();
                                        navigate('/login');
                                        setIsMobileMenuOpen(false);
                                    }}
                                >
                                    Log Out
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ════════════════════════════════
                DESKTOP LAYOUT (hidden < 768px)
                ════════════════════════════════ */}
            <div className="app-shell desktop-only">
                <Sidebar user={driver} />
                <main className="app-main">
                    <div className="dt-topbar">
                        <button className="dt-back-btn" onClick={() => navigate(-1)}>←</button>
                        <div>
                            <h1 className="dt-page-title">Personal Details</h1>
                            <p className="dt-page-subtitle">Manage your account information and preferences</p>
                        </div>
                    </div>
                    <div className="dt-content">
                        <ProfileContent
                            driver={driver}
                            isEditing={isEditing}
                            isSaving={isSaving}
                            onSave={handleSave}
                            onEdit={(val) => setIsEditing(val ?? true)}
                            onPasswordEdit={() => { setPasswordError(null); setShowPasswordModal(true); }}
                            onDeleteRequest={() => { setDeleteError(null); setShowDeleteConfirm(true); }}
                        />
                    </div>
                </main>
            </div>

            {/* ════════════════════════════════
                Save Feedback Toast / Banner
                ════════════════════════════════ */}
            {saveFeedback && (
                <div style={{
                    position: 'fixed',
                    bottom: '2rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: saveFeedback.type === 'success' ? '#064e3b' : 'var(--status-cancelled, #ef4444)',
                    color: '#fff',
                    border: `1px solid ${saveFeedback.type === 'success' ? 'var(--accent-primary)' : '#ff6b6b'}`,
                    padding: '0.85rem 1.75rem',
                    borderRadius: 'var(--radius-full, 9999px)',
                    zIndex: 9999,
                    boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: 'var(--text-sm)'
                }}>
                    <span>{saveFeedback.type === 'success' ? '✓' : '⚠️'}</span>
                    <span>{saveFeedback.message}</span>
                    <button
                        onClick={() => setSaveFeedback(null)}
                        style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 16 }}
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* ════════════════════════════════
                Change Password Modal
                ════════════════════════════════ */}
            {showPasswordModal && (
                <ChangePasswordModal
                    onClose={() => setShowPasswordModal(false)}
                    onSavePassword={handleSavePassword}
                    isSaving={isSavingPassword}
                    error={passwordError}
                />
            )}

            {/* ════════════════════════════════
                Delete Confirmation Modal
                ════════════════════════════════ */}
            {showDeleteConfirm && (
                <div
                    className="bc-modal-backdrop modal-overlay"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Delete profile confirmation"
                    onClick={() => setShowDeleteConfirm(false)}
                >
                    <div className="modal-card cancel-modal-card" onClick={(e) => e.stopPropagation()}>
                        <div style={{
                            width: 56,
                            height: 56,
                            borderRadius: '50%',
                            background: 'rgba(239,68,68,0.12)',
                            border: '1.5px solid var(--status-cancelled)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto var(--space-4)'
                        }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--status-cancelled)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                <path d="M10 11v6M14 11v6" />
                                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                            </svg>
                        </div>
                        <h3 style={{
                            fontSize: 'var(--text-xl)',
                            fontWeight: 'var(--font-bold)',
                            color: 'var(--text-primary)',
                            textAlign: 'center',
                            marginBottom: 'var(--space-2)'
                        }}>
                            Delete Profile?
                        </h3>
                        <p style={{
                            fontSize: 'var(--text-sm)',
                            color: 'var(--text-secondary)',
                            textAlign: 'center',
                            lineHeight: 1.6,
                            marginBottom: 'var(--space-6)'
                        }}>
                            Are you sure you want to permanently delete your account? All your personal details will be removed from the database. This action cannot be undone.
                        </p>
                        {deleteError && (
                            <p style={{
                                color: 'var(--status-cancelled, #ef4444)',
                                textAlign: 'center',
                                fontSize: 'var(--text-xs)',
                                marginBottom: 'var(--space-4)',
                                background: 'rgba(239, 68, 68, 0.1)',
                                padding: '8px',
                                borderRadius: 8
                            }}>
                                {deleteError}
                            </p>
                        )}
                        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                            <button
                                className="btn-secondary"
                                type="button"
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={isDeleting}
                                style={{ flex: 1 }}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn-danger-filled"
                                type="button"
                                onClick={handleDeleteConfirm}
                                disabled={isDeleting}
                                style={{
                                    flex: 1,
                                    background: 'var(--status-cancelled, #ef4444)',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: 'var(--radius-full, 9999px)',
                                    fontWeight: 'var(--font-bold)',
                                    cursor: 'pointer'
                                }}
                            >
                                {isDeleting ? 'Deleting…' : 'Delete Account'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
