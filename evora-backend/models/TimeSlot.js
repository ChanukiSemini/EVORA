const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema(
  {
    time: { type: String, required: true, unique: true }
  },
  { timestamps: true, collection: 'timeslot' }
);

module.exports = mongoose.models.TimeSlot || mongoose.model('TimeSlot', timeSlotSchema, 'timeslot');
