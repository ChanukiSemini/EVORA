// ============================================
// src/components/Icons.jsx
// Shared inline icons (stroke = currentColor)
// for the Home / Details pages + mobile nav.
// Kept separate so Sidebar.jsx stays untouched.
// ============================================

export const IconSearch = () => (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.6" />
        <path d="M17 17L13.5 13.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
);

export const IconHeart = ({ filled }) => (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <path
            d="M10 17.2s-6.8-4.1-8.6-8.1C.4 6.1 2 3.2 5.1 3c1.9-.1 3.6 1 4.9 2.6C11.3 4 13 2.9 14.9 3c3.1.2 4.7 3.1 3.7 6.1-1.8 4-8.6 8.1-8.6 8.1Z"
            fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"
        />
    </svg>
);

export const IconBell = () => (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <path d="M5 8a5 5 0 0 1 10 0c0 4 1.5 5 1.5 5h-13S5 12 5 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M8 15.5a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

export const IconMenu = () => (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <path d="M3 5.5H17M3 10H17M3 14.5H17" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
);

export const IconBack = () => (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <path d="M12.5 16 6.5 10l6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const IconChevronDown = ({ open }) => (
    <svg
        width="14" height="14" viewBox="0 0 20 20" fill="none"
        style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .18s' }}
    >
        <path d="M5 7.5 10 12.5 15 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const IconCheck = () => (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
        <path d="M4 10.5 8 14.5 16 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const IconStarFilled = () => (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 2.5l2.16 4.62 5.02.62-3.68 3.5.94 5.02L10 14.7l-4.44 2.56.94-5.02-3.68-3.5 5.02-.62L10 2.5Z" />
    </svg>
);

export const IconPin = () => (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
        <path d="M10 18s6-5.6 6-10a6 6 0 1 0-12 0c0 4.4 6 10 6 10Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <circle cx="10" cy="8" r="2.2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
);

export const IconClock = () => (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="7.3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 6v4.3l3 1.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const IconNav = () => (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
        <path d="M10 2 17.5 17 10 13.5 2.5 17 10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
);

export const IconPlug = () => (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <path d="M7 2v4M13 2v4M5.5 6h9v3a4.5 4.5 0 0 1-9 0V6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M10 13.5V17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

export const IconCarSmall = ({ crossed }) => (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
        <path d="M3.5 12.5 4.8 8.2c.2-.7.9-1.2 1.6-1.2h7.2c.7 0 1.4.5 1.6 1.2l1.3 4.3"
            stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <rect x="2.5" y="12.5" width="15" height="4" rx="1.3" stroke="currentColor" strokeWidth="1.5" />
        {crossed && <path d="M2.5 3.5 17.5 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />}
    </svg>
);

export const IconLocate = () => (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 2v2.6M10 15.4V18M18 10h-2.6M4.6 10H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

export const IconPlus = () => (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
        <path d="M10 3v14M3 10h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
);

export const IconMinus = () => (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
        <path d="M3 10h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
);

export const IconRoute = () => (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
        <circle cx="4.5" cy="15.5" r="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="15.5" cy="4.5" r="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6.3 14 14 6.3" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" strokeLinecap="round" />
    </svg>
);
