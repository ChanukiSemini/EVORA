const mongoose = require('mongoose');

const chargerSchema = new mongoose.Schema(
  {
    station: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Station',
      required: true,
    },
    connector: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Connector',
      required: true,
    },
    ratePerHour: {
      type: Number,
      required: true,
      default: 2450,
    },
    status: {
      type: String,
      enum: ['Available', 'Occupied', 'Maintenance', 'Unavailable'],
      default: 'Available',
    },
  },
  {
    timestamps: true,
    collection: 'charger', // Explicitly maps to the charger collection in MongoDB Atlas
  }
);

const Charger = mongoose.model('Charger', chargerSchema, 'charger');

module.exports = Charger;
