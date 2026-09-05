import mongoose from 'mongoose';

const stationSchema = new mongoose.Schema(
  {
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChargerHost',
      required: true
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
    rating: {
      type: Number,
      default: 0
    },
    tag: {
      type: String,
      required: true
    },
    amenities: [
      {
        type: String
      }
    ]
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Station', stationSchema, 'station');
