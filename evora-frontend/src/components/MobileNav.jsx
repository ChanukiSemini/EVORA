// ============================================
// src/components/MobileNav.jsx
// Hamburger drawer used on small screens for
// pages that render the desktop <Sidebar/> at
// >=768px. Reuses the .mobile-menu-* classes
// that already exist in index.css (same ones
// used by the Book a Charger flow) so it's a
// pure addition — no existing CSS is touched.
// ============================================

import { useNavigate } from 'react-router-dom';

const IconGrid = () => (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <rect x="2.5" y="2.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
        <rect x="11.5" y="2.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
        <rect x="2.5" y="11.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
        <rect x="11.5" y="11.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
);
const IconBolt = () => (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
        <path d="M11.2 1.7 3.4 11.4c-.3.4 0 1 .5 1h4.9l-1.2 6c-.1.6.6 1 1 .5l8-9.7c.3-.4 0-1-.5-1H11.2l1.2-6c.1-.6-.6-1-1.2-.5Z"
            stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
);
const IconCalendar = () => (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <rect x="3" y="4" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M3 8H17" stroke="currentColor" strokeWidth="1.6" />
        <path d="M6.5 2.5V5.5M13.5 2.5V5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
);
const IconStar = () => (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <path d="M10 2.5l2.16 4.62 5.02.62-3.68 3.5.94 5.02L10 14.7l-4.44 2.56.94-5.02-3.68-3.5 5.02-.62L10 2.5Z"
            stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
);
const IconCar = () => (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <path d="M3.5 12.5 4.8 8.2c.2-.7.9-1.2 1.6-1.2h7.2c.7 0 1.4.5 1.6 1.2l1.3 4.3"
            stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <rect x="2.5" y="12.5" width="15" height="4" rx="1.3" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="6" cy="16.5" r="1.2" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="14" cy="16.5" r="1.2" stroke="currentColor" strokeWidth="1.4" />
    </svg>
);
const IconGear = () => (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="2.6" stroke="currentColor" strokeWidth="1.6" />
        <path d="M10 2.8v1.6M10 15.6v1.6M17.2 10h-1.6M4.4 10H2.8M15 5l-1.1 1.1M6.1 13.9 5 15M15 15l-1.1-1.1M6.1 6.1 5 5"
            stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
);

const NAV_ITEMS = [
    { label: 'Home', to: '/dashboard', icon: IconGrid },
    { label: 'Book a Charger', to: '/book-charger', icon: IconBolt },
    { label: 'My Reservations', to: '/bookings', icon: IconCalendar },
    { label: 'Rate Your Charging Session', to: '/rate-session', icon: IconStar },
    { label: 'My Vehicles', to: '/vehicles', icon: IconCar },
    { label: 'Settings', to: '/settings', icon: IconGear },
];

const MobileNav = ({ open, onClose, active, user = { name: 'Sarah Jenkins', email: 'sarah.j@evora-charge.com' } }) => {
    const navigate = useNavigate();
    const initials = user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

    if (!open) return null;

    const go = (to) => {
        onClose();
        navigate(to);
    };

    return (
        <div className="mobile-menu-overlay" onClick={onClose}>
            <div className="mobile-menu-drawer" onClick={(e) => e.stopPropagation()}>
                <div className="mobile-menu-header">
                    <div className="mobile-menu-logo">
                        <span className="logo-icon"><IconBolt /></span>
                        <span className="logo-text">Evora</span>
                    </div>
                    <button className="mobile-menu-close" onClick={onClose} aria-label="Close menu">✕</button>
                </div>

                <nav className="mobile-menu-nav">
                    {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
                        <div
                            key={to}
                            className={'mobile-menu-item' + (active === to ? ' active' : '')}
                            onClick={() => go(to)}
                            role="button"
                            tabIndex={0}
                        >
                            <Icon /> {label}
                        </div>
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
                    <button className="mobile-logout-btn" onClick={() => go('/login')}>Log Out</button>
                </div>
            </div>
        </div>
    );
};

export default MobileNav;
