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
      required: false,
    },
    connectorType: {
      type: String,
      required: false,
    },
    powerKW: {
      type: Number,
      required: false,
    },
    ratePerHour: {
      type: Number,
      required: true,
      default: 2450,
    },
    status: {
      type: String,
      enum: ['Available', 'In Use', 'Occupied', 'Maintenance', 'Unavailable', 'Booked'],
      default: 'Available',
    },
  },
  {
    timestamps: true,
    collection: 'charger', // Explicitly maps to the charger collection in MongoDB Atlas
  }
);

const Charger = mongoose.models.Charger || mongoose.model('Charger', chargerSchema, 'charger');

module.exports = Charger;
module.exports.default = Charger;
