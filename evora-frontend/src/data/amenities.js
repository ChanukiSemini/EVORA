// ============================================
// src/data/amenities.js
// Maps each amenity key used in stations.js to
// its display icon + label. Kept out of
// Icons.jsx so that file only exports components.
// ============================================

import {
    IconWifi, IconCafe, IconParkingP, IconRestroom, IconShield, IconShoppingBag,
} from '../components/Icons';

export const AMENITY_ICONS = {
    wifi: IconWifi,
    cafe: IconCafe,
    parking: IconParkingP,
    restroom: IconRestroom,
    security: IconShield,
    shopping: IconShoppingBag,
};

export const AMENITY_LABELS = {
    wifi: 'Wi-Fi',
    cafe: 'Cafe',
    parking: 'Parking',
    restroom: 'Restroom',
    security: 'CCTV Security',
    shopping: 'Shopping',
};

export default AMENITY_ICONS;
