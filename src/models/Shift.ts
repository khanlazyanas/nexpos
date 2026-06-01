import mongoose from 'mongoose';

const ShiftSchema = new mongoose.Schema({
  cashierName: { type: String, required: true },
  openingCash: { type: Number, required: true },
  closingCash: { type: Number, default: 0 },
  expectedCash: { type: Number, default: 0 },
  cashDiscrepancy: { type: Number, default: 0 }, // 📉 NAYA: Shortage/Overage check
  status: { type: String, enum: ['Open', 'Closed'], default: 'Open' },
  branch: { type: String, default: 'Main Branch', required: true }, // 🏢 NAYA: Multi-Branch Support
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date }
}, { timestamps: true });

export default mongoose.models.Shift || mongoose.model('Shift', ShiftSchema);