// ============================================
// src/data/stations.js
// Mock station data shared between the Home
// (Find Your Station) page and the Station
// Details page. Swap for a real API response
// later — every field consumed by the UI is
// listed here so the shape is easy to match.
// ============================================

import { images } from '../assets/images';

export const STATIONS = [
    {
        id: 'one-galle-face',
        name: 'One Galle Face Mall',
        address: 'Colombo 05, Sri Lanka',
        lat: 6.9218,
        lng: 79.8478,
        rating: 4.6,
        reviews: 142,
        status: 'available', // available | soon | full
        distanceMins: 30,
        distanceKm: 1.2,
        pluggedAvailable: 4,
        pluggedTotal: 6,
        tags: ['CCS2', 'Type 2', 'Tesla NACS'],
        image: images.oneGalleFace,
        bays: ['unavailable', 'available', 'available', 'unavailable', 'available', 'available'],
        openHours: '10am – 10pm',
        accessType: 'Public · Mall Parking',
        network: 'Evora Power · Rapid DC (100kW+)',
        priceHeadline: 'LKR 62.00',
        rates: { fast: 45, slow: 20 },
        connectors: [
            { name: 'Tesla NACS', kw: '50kW', available: true },
            { name: 'CHAdeMO DC', kw: '50kW', available: true },
            { name: 'CCS Combo 2', kw: '50kW – 150kW', available: false },
            { name: 'Type 2 AC', kw: '3.7kW – 22kW', available: false },
        ],
    },
    {
        id: 'colombo-city-center',
        name: 'Colombo City Center Mall',
        address: '137, Sir James Peiris Mawatha, Colombo 00200',
        lat: 6.9270,
        lng: 79.8612,
        rating: 4.3,
        reviews: 98,
        status: 'soon',
        distanceMins: 18,
        distanceKm: 3.4,
        pluggedAvailable: 2,
        pluggedTotal: 6,
        tags: ['Type 2', 'CCS2'],
        image: images.colomboCityCenter,
        bays: ['available', 'unavailable', 'unavailable', 'available', 'unavailable', 'unavailable'],
        openHours: '9am – 9pm',
        accessType: 'Public · Mall Parking',
        network: 'Evora Power · Fast DC (60kW+)',
        priceHeadline: 'LKR 58.00',
        rates: { fast: 42, slow: 18 },
        connectors: [
            { name: 'Type 2 AC', kw: '3.7kW – 22kW', available: true },
            { name: 'CCS Combo 2', kw: '50kW – 150kW', available: true },
            { name: 'Tesla NACS', kw: '50kW', available: false },
            { name: 'CHAdeMO DC', kw: '50kW', available: false },
        ],
    },
    {
        id: 'independence-arcade',
        name: 'Independence Arcade',
        address: 'Colombo 07, Sri Lanka',
        lat: 6.9058,
        lng: 79.8607,
        rating: 4.0,
        reviews: 54,
        status: 'full',
        distanceMins: 42,
        distanceKm: 5.1,
        pluggedAvailable: 0,
        pluggedTotal: 4,
        tags: ['CCS2', 'Tesla NACS'],
        image: images.independenceArcade,
        bays: ['unavailable', 'unavailable', 'unavailable', 'unavailable'],
        openHours: '8am – 11pm',
        accessType: 'Public · Street Parking',
        network: 'Evora Power · Rapid DC (100kW+)',
        priceHeadline: 'LKR 64.00',
        rates: { fast: 47, slow: 21 },
        connectors: [
            { name: 'CCS Combo 2', kw: '50kW – 150kW', available: false },
            { name: 'Tesla NACS', kw: '50kW', available: false },
            { name: 'Type 2 AC', kw: '3.7kW – 22kW', available: false },
            { name: 'CHAdeMO DC', kw: '50kW', available: false },
        ],
    },
    {
        id: 'havelock-city',
        name: 'Havelock City Mall',
        address: 'Colombo 05, Sri Lanka',
        lat: 6.8862,
        lng: 79.8636,
        rating: 4.5,
        reviews: 120,
        status: 'available',
        distanceMins: 25,
        distanceKm: 2.6,
        pluggedAvailable: 5,
        pluggedTotal: 6,
        tags: ['Type 2', 'CCS2', 'Tesla NACS'],
        image: images.havelockCity,
        bays: ['available', 'available', 'unavailable', 'available', 'available', 'available'],
        openHours: '24 hours',
        accessType: 'Public · Mall Parking',
        network: 'Evora Power · Rapid DC (100kW+)',
        priceHeadline: 'LKR 60.00',
        rates: { fast: 44, slow: 19 },
        connectors: [
            { name: 'Type 2 AC', kw: '3.7kW – 22kW', available: true },
            { name: 'Tesla NACS', kw: '50kW', available: true },
            { name: 'CCS Combo 2', kw: '50kW – 150kW', available: true },
            { name: 'CHAdeMO DC', kw: '50kW', available: false },
        ],
    },
];

export const getStationById = (id) => STATIONS.find((s) => s.id === id);

export default STATIONS;
