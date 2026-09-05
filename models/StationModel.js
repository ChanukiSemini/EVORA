const mongoose = require('mongoose');
const { Schema } = mongoose;

// A single bay indicator used by the small availability strip on the cards
const BayDetailSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['available', 'limited', 'unavailable'],
      required: true,
    },
    label: { type: String, required: true, trim: true },
  },
  { _id: false }
);

// A physical connector / port at the station
const ConnectorSchema = new Schema(
  {
    name: { type: String, required: true, trim: true }, // e.g. "CCS Combo 2"
    kw: { type: String, required: true, trim: true }, // display string, e.g. "50kW – 150kW"
    available: { type: Boolean, default: false },
  },
  { _id: false }
);

const RatesSchema = new Schema(
  {
    fast: { type: Number, required: true, min: 0 },
    slow: { type: Number, required: true, min: 0 },
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
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug must be lowercase, hyphen-separated'],
      index: true,
    },

    name: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },

    lat: { type: Number, required: true, min: -90, max: 90 },
    lng: { type: Number, required: true, min: -180, max: 180 },

    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0, min: 0 },

    status: {
      type: String,
      enum: ['available', 'soon', 'full'],
      default: 'available',
      index: true,
    },

    // Distance/ETA are normally computed relative to the requesting user,
    // but are kept here as station-level defaults / fallback values.
    distanceMins: { type: Number, default: 0 },
    distanceKm: { type: Number, default: 0 },

    pluggedAvailable: { type: Number, default: 0, min: 0 },
    pluggedTotal: { type: Number, default: 0, min: 0 },

    tags: { type: [String], default: [] },

    image: { type: String, trim: true }, // primary/cover photo URL
    images: { type: [String], default: [] }, // gallery photo URLs

    bays: {
      type: [String],
      default: [],
      // simplified parallel array of bay statuses, mirrors baysDetail
    },
    baysDetail: { type: [BayDetailSchema], default: [] },

    openHours: { type: String, default: 'Open 24 hrs', trim: true },

    pricingText: { type: String, trim: true },
    idleFeeText: { type: String, trim: true },
    parkingText: { type: String, trim: true },
    amenitiesText: { type: String, trim: true },

    accessType: { type: String, trim: true }, // e.g. "Public · Mall Parking"
    network: { type: String, trim: true }, // e.g. "Evora Power · Rapid DC (100kW+)"

    priceHeadline: { type: String, trim: true }, // e.g. "LKR 62.00"
    rates: { type: RatesSchema, required: true },

    maxChargingSpeedKw: { type: Number, default: 0, index: true },
    portsCount: { type: Number, default: 0 },

    supportedModels: { type: [String], default: [], index: true },

    amenities: {
      type: [String],
      default: [],
      // keys should match src/data/amenities.js: wifi, cafe, parking, restroom, security, shopping
    },

    connectors: { type: [ConnectorSchema], default: [] },
  },
  { timestamps: true }
);

// Supports the FindStation.jsx search box (name/address) and general text search
StationSchema.index({ name: 'text', address: 'text' });

module.exports = mongoose.model('Station', StationSchema);
