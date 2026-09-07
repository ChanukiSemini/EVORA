// ============================================
// src/pages/Profile.jsx
// EVORA - Personal Details Page
// ============================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import IconSprite from '../components/IconSprite';
import ProfileCard from '../components/ProfileCard.jsx';

// ─────────────────────────────────────────────
// API base URL — falls back to localhost in development
// ─────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function getDriver(driverId) {
    const res = await fetch(`${BASE_URL}/api/drivers/${driverId}`);
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to load profile.');
    }
    return res.json();
}


// ─────────────────────────────────────────────
// Backend calls — kept local to this page since we're not
// using a shared api.js file. Each function maps to one endpoint.
// ─────────────────────────────────────────────


/** Patch whitelisted profile fields (name, email, phone, avatarUrl). */
async function updateDriver(driverId, updates) {
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

/** Soft-delete: sets active → false without removing the record. */
async function deactivateDriver(driverId) {
    const res = await fetch(`${BASE_URL}/api/drivers/${driverId}/deactivate`, {
        method: 'PATCH',
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to deactivate account.');
    }
    return res.json();
}

// ─────────────────────────────────────────────
// Shared inner content — used by both mobile and desktop layouts
// ─────────────────────────────────────────────
function ProfileContent({ driver, isEditing, isSaving, onSave, onEdit, onPasswordEdit, onDeleteRequest }) {
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

// TEMPORARY: hardcoded driver ID used to simulate a logged-in user
// until real login/authentication is built. Every page and the
// Sidebar use this exact same ID so they all reflect the same driver.
const DRIVER_ID = '6a9925827fb2502dd5392d22';

// ─────────────────────────────────────────────
// Page component
// ─────────────────────────────────────────────
export default function Profile() {
    const navigate = useNavigate();

    // ── Layout state ──
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // ── Driver data state ──
    const [driver, setDriver]       = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);

    // ── Edit state ──
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving]   = useState(false);
    const [saveError, setSaveError] = useState(null);

    // ── Delete confirmation state ──
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting]               = useState(false);
    const [deleteError, setDeleteError]             = useState(null);
    const [isDeactivated, setIsDeactivated]         = useState(false);

    // ── Fetch driver on mount ──
    useEffect(() => {
        setIsLoading(true);
        getDriver(DRIVER_ID)
            .then((data) => {
                setDriver(data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error('Failed to fetch driver in Profile:', err);
                setLoadError(err.message);
                setIsLoading(false);
            });
    }, []);

    // ── Save handler: PATCH updated fields then sync local state ──
    const handleSave = async (updatedFields) => {
        setSaveError(null);
        setIsSaving(true);
        try {
            const saved = await updateDriver(DRIVER_ID, {
                name:     updatedFields.name,
                email:    updatedFields.email,
                phone:    updatedFields.phone,
                avatarUrl: updatedFields.avatarUrl,
            });
            setDriver(saved);
            setIsEditing(false);
        } catch (err) {
            console.error('Failed to update driver in Profile:', err);
            setSaveError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    // ── Delete handlers ──
    const handleDeleteRequest  = () => { setShowDeleteConfirm(true); setDeleteError(null); };
    const handleDeleteCancel   = () => { setShowDeleteConfirm(false); setDeleteError(null); };

    const handleDeleteConfirm = async () => {
        setIsDeleting(true);
        setDeleteError(null);
        try {
            await deactivateDriver(DRIVER_ID);
            setIsDeactivated(true);
            setShowDeleteConfirm(false);
            navigate('/');
        } catch (err) {
            console.error('Failed to deactivate driver in Profile:', err);
            setDeleteError(err.message);
        } finally {
            setIsDeleting(false);
        }
    };

    const handlePasswordEdit = () => {
        alert('Change Password flow — coming soon.');
    };

    // ─── Guard: loading / error / deactivated ───
    if (isLoading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: 'var(--color-text-secondary, #90afb7)' }}>
                Loading profile…
            </div>
        );
    }

    if (loadError) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: 'var(--color-danger, #ff4d6d)', flexDirection: 'column', gap: '1rem' }}>
                <p>{loadError}</p>
                <button className="btn-secondary secondary-btn" onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    if (isDeactivated) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '1rem', color: 'var(--color-text-secondary, #90afb7)', textAlign: 'center', padding: '2rem' }}>
                <p style={{ fontSize: '1.5rem', color: 'var(--color-accent, #3ddc97)' }}>✓ Profile deactivated</p>
                <p>Your account has been deactivated.</p>
                {/* TODO: redirect to login once auth is built */}
                <button className="btn-secondary secondary-btn" onClick={() => navigate('/')}>Go to Home</button>
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
                    onEdit={() => setIsEditing(true)}
                    onPasswordEdit={handlePasswordEdit}
                    onDeleteRequest={handleDeleteRequest}
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
                                <div className="mobile-menu-item" onClick={() => { navigate('/find'); setIsMobileMenuOpen(false); }}>
                                    <span>🔍</span> Find Charging Stations
                                </div>
                                <div className="mobile-menu-item" onClick={() => { navigate('/book-charger'); setIsMobileMenuOpen(false); }}>
                                    <span>⚡</span> Book a Charger
                                </div>
                                <div className="mobile-menu-item" onClick={() => { navigate('/bookings'); setIsMobileMenuOpen(false); }}>
                                    <span>📅</span> My Bookings
                                </div>
                                <div className="mobile-menu-item" onClick={() => { navigate('/vehicles'); setIsMobileMenuOpen(false); }}>
                                    <span>🚗</span> My Vehicles
                                </div>
                            </nav>
                            <div className="mobile-menu-footer">
                                {/* Name/email here now come from the fetched driver, not a hardcoded constant */}
                                <div className="mobile-user-card">
                                    <div className="mobile-user-avatar">
                                        {driver.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                    </div>
                                    <div className="mobile-user-info">
                                        <span className="mobile-user-name">{driver.name}</span>
                                        <span className="mobile-user-email">{driver.email}</span>
                                    </div>
                                </div>
                                <button className="mobile-logout-btn" onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}>
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
                <Sidebar />
                <main className="app-main">
                    <div className="dt-topbar">
                        <button className="dt-back-btn" onClick={() => navigate(-1)}>←</button>
                        <div>
                            <h1 className="dt-page-title">Personal Details</h1>
                            <p className="dt-page-subtitle">Manage your account information</p>
                        </div>
                    </div>
                    <div className="dt-content">
                        <ProfileContent
                            driver={driver}
                            isEditing={isEditing}
                            isSaving={isSaving}
                            onSave={handleSave}
                            onEdit={() => setIsEditing(true)}
                            onPasswordEdit={handlePasswordEdit}
                            onDeleteRequest={handleDeleteRequest}
                        />
                    </div>
                </main>
            </div>

            {/* ════════════════════════════════
                Inline error banner (save failures)
                ════════════════════════════════ */}
            {saveError && (
                <div style={{
                    position: 'fixed', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)',
                    background: 'var(--color-danger, #ff4d6d)', color: '#fff',
                    padding: '0.75rem 1.5rem', borderRadius: '8px', zIndex: 9999,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)', maxWidth: '90vw', textAlign: 'center',
                }}>
                    {saveError}
                    <button onClick={() => setSaveError(null)} style={{ marginLeft: '1rem', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 700 }}>✕</button>
                </div>
            )}

            {/* ════════════════════════════════
                Delete confirmation modal
                ════════════════════════════════ */}
            {showDeleteConfirm && (
                <div
                    className="modal-overlay"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Delete profile confirmation"
                    onClick={handleDeleteCancel}
                >
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(239,68,68,0.12)', border: '1.5px solid var(--status-cancelled)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-4)' }}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--status-cancelled)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                <path d="M10 11v6M14 11v6" />
                                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                            </svg>
                        </div>
                        <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', textAlign: 'center', marginBottom: 'var(--space-2)' }}>
                            Delete Profile?
                        </h3>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.6, marginBottom: 'var(--space-6)' }}>
                            Your account will be <strong style={{ color: 'var(--text-primary)' }}>deactivated</strong>. You won't be able to log in until it's restored. This action cannot be undone here.
                        </p>
                        {deleteError && (
                            <p style={{ color: 'var(--status-cancelled, #ef4444)', textAlign: 'center', fontSize: 'var(--text-xs)', marginBottom: 'var(--space-4)' }}>
                                {deleteError}
                            </p>
                        )}
                        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                            <button
                                className="btn-secondary"
                                type="button"
                                onClick={handleDeleteCancel}
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
                                style={{ flex: 1 }}
                            >
                                {isDeleting ? 'Deactivating…' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
