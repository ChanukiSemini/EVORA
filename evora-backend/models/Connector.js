const mongoose = require('mongoose')

const connectorSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      trim: true,
      default: '',
    },
    shortLabel: {
      type: String,
      trim: true,
      default: '',
    },
    specs: {
      type: String,
      trim: true,
      default: '',
    },
    maxPower: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    collection: 'connectors', // Maps to connectors collection in MongoDB Atlas
  }
)

const Connector = mongoose.model('Connector', connectorSchema, 'connectors')

module.exports = Connector
