const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      default: () => Math.floor(100000 + Math.random() * 900000).toString(),
    },
    driver: {
      type: mongoose.Schema.Types.Mixed,
      ref: 'EvDriver',
      required: false,
    },
    vehicle: {
      type: mongoose.Schema.Types.Mixed,
      ref: 'Vehicle',
      required: false,
    },
    station: {
      type: mongoose.Schema.Types.Mixed,
      ref: 'Station',
      required: false,
    },
    stationSlug: {
      type: String,
      default: '',
    },
    stationName: {
      type: String,
      default: '',
    },
    stationAddress: {
      type: String,
      default: '',
    },
    charger: {
      type: mongoose.Schema.Types.Mixed,
      ref: 'Charger',
      required: false,
    },
    bayId: {
      type: String,
      default: '',
    },
    bayName: {
      type: String,
      default: '',
    },
    connectorType: {
      type: String,
      default: 'CCS2 (DC Fast)',
    },
    slot: {
      type: String,
      default: '12:00 PM',
    },
    timeSlot: {
      type: mongoose.Schema.Types.Mixed,
      ref: 'TimeSlot',
      required: false,
    },
    bookeddate: {
      type: Date,
      default: Date.now,
    },
    date: {
      type: Date,
      required: [true, 'Booking date is required'],
      default: Date.now,
    },
    durationMinutes: {
      type: Number,
      required: true,
      default: 60,
    },
    energyDeliveredKWh: {
      type: Number,
      required: false,
    },
    estimatedTotalcost: {
      type: mongoose.Schema.Types.Mixed,
      default: '2,450',
    },
    estimatedTotalCost: {
      type: mongoose.Schema.Types.Mixed,
      default: '2,450',
    },
    canModify: {
      type: mongoose.Schema.Types.Mixed,
      default: 'true',
    },
    modify: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['upcoming', 'confirmed', 'completed', 'cancelled', 'pending'],
      default: 'confirmed',
    },
    cancelledDate: {
      type: Date,
      default: null,
    },
    cancelleddate: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'booking', // Explicitly maps to the booking collection in MongoDB Atlas
  }
);

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema, 'booking');

module.exports = Booking;
module.exports.default = Booking;
