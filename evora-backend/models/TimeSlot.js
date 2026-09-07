import mongoose from 'mongoose';

const timeSlotSchema = new mongoose.Schema(
  {
    time: { type: String, required: true }
  },
  { timestamps: true, collection: 'timeslot' }
);

export default mongoose.model('TimeSlot', timeSlotSchema, 'timeslot');
