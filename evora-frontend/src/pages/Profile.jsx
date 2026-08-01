// ============================================
// src/pages/Profile.jsx
// EVORA - Personal Details Page
// ============================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import IconSprite from '../components/IconSprite';
import ProfileCard from '../components/ProfileCard.jsx';

/* ---------- Mock Data ---------- */
const USER = {
    name: 'Sarah Jenkins',
    email: 'sarah.j@evora-charge.com',
    avatarUrl:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    phone: '+1 (512) 555-0147',
    password: 'password123',
};

export default function Profile() {
    const navigate = useNavigate();

    // ── Layout state ──
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // ── Profile state ──
    const [userState, setUserState] = useState({ ...USER });
    const [isEditing, setIsEditing] = useState(false);

    const enableEdit = () => setIsEditing(true);

    const saveAndExit = (updatedUser) => {
        // TODO: send updated profile to backend API
        if (updatedUser) setUserState(updatedUser);
        setIsEditing(false);
    };

    const handlePasswordEdit = () => {
        alert('Mock action: Redirecting to dedicated Change Password flow.');
    };

    /* ---------- Shared page content ---------- */
    const ProfileContent = () => (
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

                <ProfileContent />

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
                                <div className="mobile-menu-item" onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }}>
                                    <span>⭐</span> Rate Your Session
                                </div>
                                <div className="mobile-menu-item" onClick={() => { navigate('/vehicles'); setIsMobileMenuOpen(false); }}>
                                    <span>🚗</span> My Vehicles
                                </div>
                                <div className="mobile-menu-item" onClick={() => { navigate('/settings'); setIsMobileMenuOpen(false); }}>
                                    <span>⚙️</span> Settings
                                </div>
                            </nav>
                            <div className="mobile-menu-footer">
                                <div className="mobile-user-card">
                                    <div className="mobile-user-avatar">SJ</div>
                                    <div className="mobile-user-info">
                                        <span className="mobile-user-name">{userState.name}</span>
                                        <span className="mobile-user-email">{userState.email}</span>
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
                        <ProfileContent />
                    </div>
                </main>
            </div>
        </>
    );
}
