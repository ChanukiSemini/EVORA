// ============================================
// src/components/navigation.js
// Shared navigation items array
// ============================================

import {
    IconGrid,
    IconBolt,
    IconCalendar,
    IconStar,
    IconCar,
    IconGear,
} from './NavigationIcons.jsx';

export const NAV_ITEMS = [
    { label: 'Home', to: '/dashboard', icon: IconGrid },
    { label: 'Book a Charger', to: '/book-charger', icon: IconBolt },
    { label: 'My Reservations', to: '/bookings', icon: IconCalendar },
    { label: 'Rate Your Charging Session', to: '/rate-session', icon: IconStar },
    { label: 'My Vehicles', to: '/vehicles', icon: IconCar },
    { label: 'Settings', to: '/settings', icon: IconGear },
];
