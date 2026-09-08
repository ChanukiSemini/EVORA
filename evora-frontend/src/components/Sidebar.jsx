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

const Sidebar = ({ user }) => {
    const navigate = useNavigate();

    // Dynamically retrieve authenticated user
    const getActiveUser = () => {
        if (user && user.name && user.name !== 'Sarah Jenkins') return user;
        try {
            const stored = JSON.parse(
                localStorage.getItem('evora_current_user') ||
                localStorage.getItem('evora_driver_user') ||
                localStorage.getItem('evora_host_user') ||
                '{}'
            );
            const name = stored.fullName || stored.name || (user && user.name) || 'EV Driver';
            const email = stored.email || (user && user.email) || 'driver@evora.lk';
            return { name, email, ...stored };
        } catch {
            return user || { name: 'EV Driver', email: 'driver@evora.lk' };
        }
    };

    const currentUser = getActiveUser();
    const initials = (currentUser.name || 'EV')
        .split(' ')
        .filter(Boolean)
        .map(n => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'EV';

    const handleLogout = () => {
        localStorage.removeItem('evora_token');
        localStorage.removeItem('evora_current_user');
        localStorage.removeItem('evora_driver_user');
        localStorage.removeItem('evora_host_user');
        navigate('/login');
    };

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
                        <span className="sidebar-user-name">{currentUser.name}</span>
                        <span className="sidebar-user-email">{currentUser.email}</span>
                    </div>
                </div>
                <button className="sidebar-logout-btn" onClick={handleLogout}>
                    <IconLogout /> Log Out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
