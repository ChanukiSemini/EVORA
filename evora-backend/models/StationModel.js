const mongoose = require('mongoose');
const { Schema } = mongoose;

// A single bay / charger slot at the station
const BayDetailSchema = new Schema(
  {
    bayId: { type: String, trim: true },
    name: { type: String, required: true, trim: true }, // e.g. "Bay 1"
    status: {
      type: String,
      enum: ['available', 'limited', 'unavailable', 'occupied', 'maintenance', 'faulty', 'in-use', 'reserved'],
      default: 'available',
      required: true,
    },
    label: { type: String, default: 'Available', trim: true },
    type: { type: String, default: 'CCS2', trim: true }, // e.g. "CCS2", "Type 2", "CHAdeMO"
    power: { type: String, default: '150kW', trim: true }, // e.g. "150kW", "22kW"
    ratePerHour: { type: Number, default: 2450 },
    chargerId: { type: String, trim: true },
    portId: { type: String, trim: true },
  },
  { _id: false }
);

// A port in the admin charger hardware
const PortSchema = new Schema(
  {
    portId: { type: String, required: true },
    status: {
      type: String,
      enum: ['available', 'occupied', 'reserved', 'faulty', 'charging', 'maintenance', 'out-of-order', 'unavailable', 'limited'],
      default: 'available',
    },
    type: { type: String, default: 'CCS2' },
    power: { type: String, default: '50kW' },
  },
  { _id: false }
);

// Admin-managed Charger Hardware attached to the station
const ChargerSchema = new Schema(
  {
    chargerId: { type: String, required: true },
    type: { type: String, default: 'CCS2' },
    power: { type: String, default: '50kW' },
    ports: [PortSchema],
  },
  { _id: false }
);

// A physical connector / port at the station (driver facing summary)
const ConnectorSchema = new Schema(
  {
    name: { type: String, required: true, trim: true }, // e.g. "CCS Combo 2"
    kw: { type: String, required: true, trim: true }, // display string, e.g. "50kW – 150kW"
    available: { type: Boolean, default: true },
  },
  { _id: false }
);

const RatesSchema = new Schema(
  {
    fast: { type: Number, default: 45, min: 0 },
    slow: { type: Number, default: 20, min: 0 },
  },
  { _id: false }
);

const StationSchema = new Schema(
  {
    // Human-friendly, URL-safe id used by the frontend routes (/station/:id)
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    branchId: { type: String, trim: true, index: true },
    hostId: { type: mongoose.Schema.Types.Mixed, ref: 'ChargerHost', default: null, index: true },
    hostEmail: { type: String, default: '', trim: true, lowercase: true, index: true },

    name: { type: String, required: true, trim: true },
    address: { type: String, default: '', trim: true },
    phone: { type: String, default: '', trim: true },

    lat: { type: Number, default: 6.9271, min: -90, max: 90 },
    lng: { type: Number, default: 79.8612, min: -180, max: 180 },

    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    reviews: { type: Number, default: 0, min: 0 },

    status: {
      type: String,
      enum: ['available', 'soon', 'full', 'online', 'offline', 'maintenance'],
      default: 'available',
      index: true,
    },

    // Distance/ETA are normally computed relative to the requesting user
    distanceMins: { type: Number, default: 15 },
    distanceKm: { type: Number, default: 2.5 },

    pluggedAvailable: { type: Number, default: 4, min: 0 },
    pluggedTotal: { type: Number, default: 4, min: 0 },

    tags: { type: [String], default: ['CCS2', 'Type 2', 'AC', 'DC Fast'] },

    image: { type: String, default: '', trim: true }, // primary/cover photo URL
    images: { type: [String], default: [] }, // gallery photo URLs

    bays: {
      type: [String],
      default: ['available', 'available', 'available', 'available'],
    },
    baysDetail: { type: [BayDetailSchema], default: [] },
    chargers: { type: [ChargerSchema], default: [] },

    openHours: { type: String, default: 'Open 24 hrs', trim: true },

    pricingText: { type: String, default: 'LKR 60 / kWh', trim: true },
    idleFeeText: { type: String, default: 'LKR 10 / min', trim: true },
    parkingText: { type: String, default: 'Free', trim: true },
    amenitiesText: { type: String, default: 'Wi-Fi, Cafe', trim: true },

    accessType: { type: String, default: 'Public · Parking', trim: true },
    network: { type: String, default: 'Evora Power · Rapid DC (100kW+)', trim: true },

    priceHeadline: { type: String, default: 'LKR 60.00', trim: true },
    rates: { type: RatesSchema, default: () => ({ fast: 45, slow: 20 }) },

    maxChargingSpeedKw: { type: Number, default: 150, index: true },
    portsCount: { type: Number, default: 4 },

    supportedModels: {
      type: [String],
      default: ['Tesla Model 3/Y', 'Nissan Leaf', 'BYD Atto 3', 'Hyundai Ioniq 5'],
      index: true,
    },

    amenities: {
      type: [String],
      default: ['wifi', 'cafe', 'parking', 'restroom'],
    },

    connectors: { type: [ConnectorSchema], default: [] },
  },
  {
    timestamps: true,
    collection: 'stations', // Explicitly maps to the stations collection in MongoDB Atlas
  }
);

// Supports search box (name/address)
StationSchema.index({ name: 'text', address: 'text' });

const Station = mongoose.models.Station || mongoose.model('Station', StationSchema, 'stations');

module.exports = Station;
module.exports.default = Station;

