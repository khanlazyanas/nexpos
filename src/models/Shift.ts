import mongoose from 'mongoose';

const ShiftSchema = new mongoose.Schema({
  cashierName: { type: String, required: true },
  openingCash: { type: Number, required: true },
  closingCash: { type: Number, default: 0 },
  expectedCash: { type: Number, default: 0 },
  status: { type: String, enum: ['Open', 'Closed'], default: 'Open' },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date }
}, { timestamps: true });

export default mongoose.models.Shift || mongoose.model('Shift', ShiftSchema);