const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingNumber: {
      type: String,
      required: true
    },
    driver: {
      type: mongoose.Schema.Types.Mixed,
      ref: 'EvDriver',
      required: true
    },
    vehicle: {
      type: mongoose.Schema.Types.Mixed,
      ref: 'Vehicle',
      required: true
    },
    charger: {
      type: mongoose.Schema.Types.Mixed,
      ref: 'Charger',
      required: true
    },
    slot: {
      type: mongoose.Schema.Types.Mixed,
      ref: 'TimeSlot',
      required: false
    },
    date: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    time: {
      type: String,
      required: false
    },
    timeSlot: {
      type: String,
      required: false
    },
    durationMinutes: {
      type: Number,
      required: false
    },
    energyDeliveredKWh: {
      type: Number,
      required: false
    },
    estimatedTotalCost: {
      type: mongoose.Schema.Types.Mixed,
      required: false
    },
    estimatedTotalcost: {
      type: mongoose.Schema.Types.Mixed,
      required: false
    },
    canModify: {
      type: mongoose.Schema.Types.Mixed,
      required: false
    },
    status: {
      type: String,
      enum: ['upcoming', 'completed', 'cancelled'],
      default: 'upcoming'
    },
    cancelledDate: {
      type: String,
      required: false
    },
    cancelleddate: {
      type: String,
      required: false
    }
  },
  {
    timestamps: true,
    strict: false,
    collection: 'booking'
  }
);

module.exports = mongoose.models.Booking || mongoose.model('Booking', bookingSchema, 'booking');
