import mongoose from 'mongoose';

const evDriverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    avatarUrl: { type: String },
    roleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model('EvDriver', evDriverSchema);
