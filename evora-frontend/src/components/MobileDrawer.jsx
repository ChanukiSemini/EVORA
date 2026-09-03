// ============================================
// src/components/MobileDrawer.jsx
// Mobile navigation drawer — extracted from the
// reference repo's BookCharger page inline drawer.
// Shared across all pages via App.jsx.
// ============================================

import { NavLink, useNavigate } from 'react-router-dom';
import { NAV_ITEMS } from './navigation.js';
import { IconLogout } from './NavigationIcons.jsx';

const MobileDrawer = ({ isOpen, onClose, user = { name: 'Sarah Jenkins', email: 'sarah.j@evora-charge.com' } }) => {
    const navigate = useNavigate();
    const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

    if (!isOpen) return null;

    const handleNavClick = (to) => {
        navigate(to);
        onClose();
    };

    return (
        <div className="mobile-menu-overlay" onClick={onClose}>
            <div className="mobile-menu-drawer" onClick={(e) => e.stopPropagation()}>
                <div className="mobile-menu-header">
                    <div className="mobile-menu-logo">
                        <span className="logo-icon">⚡</span>
                        <span className="logo-text">Evora</span>
                    </div>
                    <button className="mobile-menu-close" onClick={onClose}>✕</button>
                </div>

                <nav className="mobile-menu-nav">
                    {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) => 'mobile-menu-item' + (isActive ? ' active' : '')}
                            onClick={() => onClose()}
                        >
                            <span className="mobile-menu-item-icon"><Icon /></span>
                            <span>{label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="mobile-menu-footer">
                    <div className="mobile-user-card">
                        <div className="mobile-user-avatar">{initials}</div>
                        <div className="mobile-user-info">
                            <span className="mobile-user-name">{user.name}</span>
                            <span className="mobile-user-email">{user.email}</span>
                        </div>
                    </div>
                    <button className="mobile-logout-btn" onClick={() => handleNavClick('/login')}>
                        <IconLogout /> Log Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MobileDrawer;
