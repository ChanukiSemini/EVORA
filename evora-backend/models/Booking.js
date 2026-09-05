import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    bookingNumber: {
      type: String,
      required: true,
      unique: true
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EvDriver',
      required: true
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true
    },
    charger: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Charger',
      required: true
    },
    date: {
      type: String,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    timeSlot: {
      type: String,
      required: false
    },
    durationMinutes: {
      type: Number,
      required: true
    },
    energyDeliveredKWh: {
      type: Number,
      required: false
    },
    estimatedTotalCost: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['upcoming', 'completed', 'cancelled'],
      default: 'upcoming'
    },
    cancelledDate: {
      type: String,
      required: false
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Booking', bookingSchema, 'booking');
