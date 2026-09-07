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
      ref: 'User',
      required: false,
    },
    vehicle: {
      type: mongoose.Schema.Types.Mixed,
      ref: 'VehicleModel',
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
    connectorType: {
      type: String,
      default: 'CCS2 (DC Fast)',
    },
    slot: {
      type: String,
      required: [true, 'Time slot is required'],
      default: '12:00 PM',
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
    estimatedTotalcost: {
      type: String,
      required: true,
      default: '0',
    },
    canModify: {
      type: String,
      default: 'true',
    },
    status: {
      type: String,
      enum: ['confirmed', 'completed', 'cancelled', 'pending'],
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

const Booking = mongoose.model('Booking', bookingSchema, 'booking');

module.exports = Booking;
