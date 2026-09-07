const mongoose = require('mongoose')

const vehicleModelSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      trim: true,
      default: '',
    },
    model: {
      type: String,
      trim: true,
      default: '',
    },
    vehicleType: {
      type: String,
      trim: true,
      default: 'car',
    },
    batteryCapacity: {
      type: Number,
      default: 0,
    },
    range: {
      type: Number,
      default: 0,
    },
    chargingSpeed: {
      type: Number,
      default: 0,
    },
  },
  {
    collection: 'VehicleModel', // Maps to VehicleModel collection in MongoDB Atlas
  }
)

const VehicleModel = mongoose.model('VehicleModel', vehicleModelSchema, 'VehicleModel')

module.exports = VehicleModel
