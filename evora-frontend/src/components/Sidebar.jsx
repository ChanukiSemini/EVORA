// ============================================
// src/components/Sidebar.jsx
// Desktop app-shell sidebar — shared across all
// dashboard pages (Home, Stations, Booking, etc).
// NO css import here — everything is in index.css
// ============================================

import { NavLink, useNavigate } from 'react-router-dom';
import { NAV_ITEMS } from './navigation.js';
import { IconBolt, IconLogout } from './NavigationIcons.jsx';

const Sidebar = ({ user = { name: 'Sarah Jenkins', email: 'sarah.j@evora-charge.com' } }) => {
    const navigate = useNavigate();
    const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

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
                        <span className="sidebar-user-name">{user.name}</span>
                        <span className="sidebar-user-email">{user.email}</span>
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
