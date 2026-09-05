import mongoose from 'mongoose';

const connectorSchema = new mongoose.Schema(
  {
    connectorType: {
      type: String,
      required: true
    },
    powerKW: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Connector', connectorSchema, 'connectors');
