// ============================================
// src/components/Sidebar.jsx
// Desktop app-shell sidebar — shared across all
// dashboard pages (Home, Stations, Booking, etc).
// NO css import here — everything is in index.css
// ============================================

import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { NAV_ITEMS } from './navigation.js';
import { IconBolt, IconLogout } from './NavigationIcons.jsx';

// ─────────────────────────────────────────────
// API base URL — falls back to localhost in development
// ─────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// TEMPORARY: hardcoded driver ID used to simulate a logged-in user
// until real login/authentication is built. Every page and the
// Sidebar use this exact same ID so they all reflect the same driver.
const DRIVER_ID = '6a9925827fb2502dd5392d22';

/** Fetch the driver's profile for sidebar display. */
async function getDriver(driverId) {
    const res = await fetch(`${BASE_URL}/api/drivers/${driverId}`);
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to load profile.');
    }
    return res.json();
}

const Sidebar = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getDriver(DRIVER_ID)
            .then((data) => setUser(data))
            .catch((err) => {
                console.error('Failed to fetch driver in Sidebar:', err);
            });
    }, []);

    const displayName = user?.name || 'Guest';
    const displayEmail = user?.email || '';
    const initials = displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

    return (
        <aside className="app-sidebar">
            <div className="sidebar-logo" onClick={() => navigate('/dashboard')} role="button" tabIndex={0}>
                <span className="sidebar-logo-icon"><IconBolt filled /></span>
                <span className="sidebar-logo-text">Evora</span>
            </div>

            <nav className="sidebar-nav">
                {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) => 'sidebar-nav-item' + (isActive ? ' active' : '')}
                    >
                        <span className="sidebar-nav-icon"><Icon /></span>
                        <span>{label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-bottom">
                <div className="sidebar-user-card" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }} role="button" tabIndex={0}>
                    <div className="sidebar-user-avatar">{initials}</div>
                    <div className="sidebar-user-info">
                        <span className="sidebar-user-name">{displayName}</span>
                        <span className="sidebar-user-email">{displayEmail}</span>
                    </div>
                </div>
                <button className="sidebar-logout-btn" onClick={() => navigate('/login')}>
                    <IconLogout /> Log Out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
