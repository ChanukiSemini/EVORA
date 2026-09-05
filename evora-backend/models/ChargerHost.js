import mongoose from 'mongoose';

const chargerHostSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true,unique },
    phone: { type: String, required: true, unique },
    role: {mongoose.Schema.Types.ObjectId,
      ref: 'Role',
      required: true}
    company: { type: String },
    brNo:{type: String, required: true, unique} ,
  },
  { timestamps: true }
);

export default mongoose.model('ChargerHost', chargerHostSchema);
