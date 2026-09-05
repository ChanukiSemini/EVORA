// Loads a handful of sample stations, in the same shape as the frontend's
// src/data/stations.js, so the API has real data to return during development.
// Run with: npm run seed
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Station = require('../models/StationModel');

const sampleStations = [
  {
    slug: 'one-galle-face',
    name: 'One Galle Face Mall',
    address: 'Colombo 05, Sri Lanka',
    lat: 6.9218,
    lng: 79.8478,
    rating: 4.6,
    reviews: 142,
    status: 'available',
    distanceMins: 30,
    distanceKm: 1.2,
    pluggedAvailable: 4,
    pluggedTotal: 6,
    tags: ['CCS2', 'Type 2', 'AC', 'DC Fast'],
    image: '',
    images: [],
    bays: ['available', 'available', 'limited', 'unavailable'],
    baysDetail: [
      { name: 'Bay 1', status: 'available', label: 'Available' },
      { name: 'Bay 2', status: 'available', label: 'Available' },
      { name: 'Bay 3', status: 'limited', label: 'Limited' },
      { name: 'Bay 4', status: 'unavailable', label: 'Unavailable' },
    ],
    openHours: 'Open 24 hrs',
    pricingText: 'LKR 62 / kWh',
    idleFeeText: 'LKR 12 / min',
    parkingText: 'Mall Rate',
    amenitiesText: 'Wi-Fi, Shop',
    accessType: 'Public · Mall Parking',
    network: 'Evora Power · Rapid DC (100kW+)',
    priceHeadline: 'LKR 62.00',
    rates: { fast: 45, slow: 20 },
    maxChargingSpeedKw: 150,
    portsCount: 6,
    supportedModels: ['Tesla Model 3/Y', 'Nissan Leaf', 'BYD Atto 3', 'Hyundai Ioniq 5'],
    amenities: ['wifi', 'cafe', 'parking', 'restroom', 'shopping'],
    connectors: [
      { name: 'Tesla NACS', kw: '50kW', available: true },
      { name: 'CHAdeMO DC', kw: '50kW', available: true },
      { name: 'CCS Combo 2', kw: '50kW – 150kW', available: false },
      { name: 'Type 2 AC', kw: '3.7kW – 22kW', available: false },
    ],
  },
  {
    slug: 'colombo-city-center',
    name: 'Colombo City Center Mall',
    address: '137, Sir James Peiris Mawatha, Colombo 00200',
    lat: 6.927,
    lng: 79.8612,
    rating: 4.3,
    reviews: 98,
    status: 'soon',
    distanceMins: 18,
    distanceKm: 3.4,
    pluggedAvailable: 2,
    pluggedTotal: 6,
    tags: ['Type 2', 'CCS2', 'AC', 'DC Fast'],
    image: '',
    images: [],
    bays: ['available', 'available', 'limited', 'unavailable'],
    baysDetail: [
      { name: 'Bay 1', status: 'available', label: 'Available' },
      { name: 'Bay 2', status: 'available', label: 'Available' },
      { name: 'Bay 3', status: 'limited', label: 'Limited' },
      { name: 'Bay 4', status: 'unavailable', label: 'Unavailable' },
    ],
    openHours: 'Open 24 hrs',
    pricingText: 'LKR 58 / kWh',
    idleFeeText: 'LKR 10 / min',
    parkingText: 'Free',
    amenitiesText: 'Wi-Fi, Cafe',
    accessType: 'Public · Mall Parking',
    network: 'Evora Power · Fast DC (60kW+)',
    priceHeadline: 'LKR 58.00',
    rates: { fast: 42, slow: 18 },
    maxChargingSpeedKw: 60,
    portsCount: 6,
    supportedModels: ['Nissan Leaf', 'Hyundai Kona', 'MG ZS EV', 'BYD Atto 3'],
    amenities: ['wifi', 'cafe', 'parking', 'restroom', 'shopping'],
    connectors: [
      { name: 'Type 2 AC', kw: '3.7kW – 22kW', available: true },
      { name: 'CCS Combo 2', kw: '50kW – 150kW', available: true },
      { name: 'Tesla NACS', kw: '50kW', available: false },
      { name: 'CHAdeMO DC', kw: '50kW', available: false },
    ],
  },
];

const run = async () => {
  await connectDB();
  await Station.deleteMany({});
  await Station.insertMany(sampleStations);
  console.log(`Seeded ${sampleStations.length} stations`);
  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
