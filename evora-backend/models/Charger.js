const mongoose = require('mongoose');

const chargerSchema = new mongoose.Schema(
  {
    station: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Station',
      required: true
    },
    connector: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Connector',
      required: false
    },
    connectorType: {
      type: String,
      required: false
    },
    powerKW: {
      type: Number,
      required: false
    },
    ratePerHour: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['Available', 'In Use', 'Maintenance', 'Booked'],
      default: 'Available'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.models.Charger || mongoose.model('Charger', chargerSchema, 'charger');
