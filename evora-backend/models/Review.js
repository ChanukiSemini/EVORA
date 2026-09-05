import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EvDriver',
      required: true
    },
    station: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Station',
      required: true
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: false
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    ratingLabel: {
      type: String,
      required: false
    },
    chips: [
      {
        type: String
      }
    ],
    comment: {
      type: String,
      required: false
    },
    energyDeliveredKWh: {
      type: Number,
      required: false
    },
    cost: {
      type: Number,
      required: false
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Review', reviewSchema, 'reviews');

