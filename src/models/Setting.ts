import mongoose from 'mongoose';

const SettingSchema = new mongoose.Schema({
  storeName: { type: String, default: 'NexPOS Pro' },
  storeAddress: { type: String, default: 'Lucknow, Uttar Pradesh' },
  storePhone: { type: String, default: '1234567890' },
  gstPercentage: { type: Number, default: 0 }, 
}, { timestamps: true });

export default mongoose.models.Setting || mongoose.model('Setting', SettingSchema);