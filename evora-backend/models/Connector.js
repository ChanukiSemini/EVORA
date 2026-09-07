import mongoose from 'mongoose';

const connectorSchema = new mongoose.Schema(
  {
    label: { type: String },
    shortLabel: { type: String },
    specs: { type: String },
    maxPower: { type: String },
    connectorType: { type: String },
    powerKW: { type: Number }
  },
  { timestamps: true, strict: false, collection: 'connectors' }
);

export default mongoose.model('Connector', connectorSchema, 'connectors');
