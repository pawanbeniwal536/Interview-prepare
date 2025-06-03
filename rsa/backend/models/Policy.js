import mongoose from 'mongoose';

const policySchema = new mongoose.Schema({
  policyId: { type: String, required: true, unique: true },
  customeNumber: { type: String, required: true },
  duratiorName: { type: String, required: true },
  vehiclen: { type: String, required: true },
  startDate: { type: Date, required: true },
  expiryDate: { type: Date, required: true },
  status: { type: String, required: true } // e.g., 'Active', 'Cancelled'
}, { timestamps: true });

export default mongoose.model('Policy', policySchema);
