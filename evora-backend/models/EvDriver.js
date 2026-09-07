const mongoose = require('mongoose');

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

module.exports = mongoose.models.EvDriver || mongoose.model('EvDriver', evDriverSchema, 'ev_driver');
