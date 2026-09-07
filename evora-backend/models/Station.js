import mongoose from 'mongoose';

const stationSchema = new mongoose.Schema(
  {
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChargerHost',
      required: false
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      required: true
    },
    totalRatingSum: {
      type: Number,
      default: 0
    },
    numberOfRatings: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 0
    },
    tag: {
      type: String,
      required: false
    },
    amenities: [
      {
        type: String
      }
    ]
  },
  {
    timestamps: true,
    strict: false,
    collection: 'station'
  }
);

export default mongoose.model('Station', stationSchema, 'station');
