const mongoose = require('mongoose');

const favouriteStationSchema = new mongoose.Schema(
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
    addedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('FavouriteStation', favouriteStationSchema, 'favourite_station');
