// ============================================
// src/components/MobileDrawer.jsx
// Mobile navigation drawer — extracted from the
// reference repo's BookCharger page inline drawer.
// Shared across all pages via App.jsx.
// ============================================

import { NavLink, useNavigate } from 'react-router-dom';
import { NAV_ITEMS } from './navigation.js';
import { IconLogout } from './NavigationIcons.jsx';

const MobileDrawer = ({ isOpen, onClose, user }) => {
    const navigate = useNavigate();

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

    if (!isOpen) return null;

    const handleLogout = () => {
        localStorage.removeItem('evora_token');
        localStorage.removeItem('evora_current_user');
        localStorage.removeItem('evora_driver_user');
        localStorage.removeItem('evora_host_user');
        onClose();
        navigate('/login');
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
                    <div className="mobile-user-card" onClick={() => { onClose(); navigate('/profile'); }} style={{ cursor: 'pointer' }}>
                        <div className="mobile-user-avatar">{initials}</div>
                        <div className="mobile-user-info">
                            <span className="mobile-user-name">{currentUser.name}</span>
                            <span className="mobile-user-email">{currentUser.email}</span>
                        </div>
                    </div>
                    <button className="mobile-logout-btn" onClick={handleLogout}>
                        <IconLogout /> Log Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MobileDrawer;
