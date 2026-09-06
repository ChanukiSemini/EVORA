const mongoose = require('mongoose')

const portSchema = new mongoose.Schema({
  portId: { type: String, required: true },
  status: {
    type: String,
    enum: ['available', 'occupied', 'reserved', 'faulty', 'charging', 'maintenance', 'out-of-order'],
    default: 'available',
  },
})

const chargerSchema = new mongoose.Schema({
  chargerId: { type: String, required: true },
  type: { type: String, default: 'CCS2' },
  power: { type: String, default: '50kW' },
  ports: [portSchema],
})

const branchSchema = new mongoose.Schema(
  {
    branchId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    openHours: { type: String, default: '24/7' },
    address: { type: String, default: '' },
    phone: { type: String, default: '' },
    status: {
      type: String,
      enum: ['online', 'offline', 'maintenance'],
      default: 'online',
    },
    chargers: [chargerSchema],
  },
  { timestamps: true }
)

module.exports = mongoose.model('Branch', branchSchema)
