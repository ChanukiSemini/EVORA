// ============================================
// src/components/NavigationIcons.jsx
// ============================================

export const IconGrid = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2.5" y="2.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
        <rect x="11.5" y="2.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
        <rect x="2.5" y="11.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
        <rect x="11.5" y="11.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
);

export const IconSearch = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.6" />
        <path d="M17 17L13.5 13.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
);

export const IconBolt = ({ filled }) => (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <path
            d="M11.2 1.7 3.4 11.4c-.3.4 0 1 .5 1h4.9l-1.2 6c-.1.6.6 1 1 .5l8-9.7c.3-.4 0-1-.5-1H11.2l1.2-6c.1-.6-.6-1-1.2-.5Z"
            fill={filled ? 'currentColor' : 'none'}
            stroke={filled ? 'none' : 'currentColor'}
            strokeWidth="1.6"
            strokeLinejoin="round"
        />
    </svg>
);

export const IconCalendar = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="3" y="4" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M3 8H17" stroke="currentColor" strokeWidth="1.6" />
        <path d="M6.5 2.5V5.5M13.5 2.5V5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
);

export const IconStar = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
            d="M10 2.5l2.16 4.62 5.02.62-3.68 3.5.94 5.02L10 14.7l-4.44 2.56.94-5.02-3.68-3.5 5.02-.62L10 2.5Z"
            stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"
        />
    </svg>
);

export const IconCar = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3.5 12.5 4.8 8.2c.2-.7.9-1.2 1.6-1.2h7.2c.7 0 1.4.5 1.6 1.2l1.3 4.3"
            stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <rect x="2.5" y="12.5" width="15" height="4" rx="1.3" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="6" cy="16.5" r="1.2" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="14" cy="16.5" r="1.2" stroke="currentColor" strokeWidth="1.4" />
    </svg>
);

export const IconGear = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="2.6" stroke="currentColor" strokeWidth="1.6" />
        <path
            d="M10 2.8v1.6M10 15.6v1.6M17.2 10h-1.6M4.4 10H2.8M15 5l-1.1 1.1M6.1 13.9 5 15M15 15l-1.1-1.1M6.1 6.1 5 5"
            stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
        />
    </svg>
);

export const IconLogout = () => (
    <svg width="17" height="17" viewBox="0 0 20 20" fill="none">
        <path d="M7.5 17.5H4a1 1 0 0 1-1-1v-13a1 1 0 0 1 1-1h3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M12.5 13.5 17 9l-4.5-4.5M17 9H7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
