const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
})

const supportCaseSchema = new mongoose.Schema(
  {
    caseId: { type: String, required: true, unique: true },
    userName: { type: String, required: true },
    phone: { type: String, default: '' },
    vehicle: { type: String, default: '' },
    issue: { type: String, required: true },
    branchId: { type: String, default: '' },
    chargerId: { type: String, default: '' },
    portId: { type: String, default: '' },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'resolved'],
      default: 'open',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    messages: [messageSchema],
  },
  { timestamps: true }
)

module.exports = mongoose.model('SupportCase', supportCaseSchema)
