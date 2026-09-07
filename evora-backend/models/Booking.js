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
    bookeddate: {
      type: Date,
      default: Date.now
    },
    timeSlot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TimeSlot',
      required: true
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
    modify: {
      type: boolean,
      default: true,
      required: true
    },
    cancelledDate: {
      type: Date,
      required: false
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Booking', bookingSchema, 'booking');
