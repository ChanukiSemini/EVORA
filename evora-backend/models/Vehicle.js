import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EvDriver',
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    brand: {
      type: String,
      required: false
    },
    model: {
      type: String,
      required: false
    },
    type: {
      type: String,
      required: false
    },
    connector: {
      type: String,
      required: false
    },
    battery: {
      type: String,
      required: false
    },
    range: {
      type: String,
      required: false
    },
    status: {
      type: String,
      default: 'Ready to charge'
    },
    color: {
      type: String,
      required: false
    },
    licensePlate: {
      type: String,
      required: false
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Vehicle', vehicleSchema, 'ev_vehicle');
