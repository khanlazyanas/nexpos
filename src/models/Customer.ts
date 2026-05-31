import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  totalPurchases: { type: Number, default: 0 },
  dueAmount: { type: Number, default: 0 }, // Udhaar ka hisaab
  
  // 🎁 NAYA FIELD: Retail Loyalty Points Tracker
  loyaltyPoints: { type: Number, default: 0 } 
}, { timestamps: true });

export default mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);