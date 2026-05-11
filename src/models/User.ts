import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Cashier'], default: 'Cashier' }
}, { timestamps: true });

// Next.js fix: Check if model already exists before creating a new one
const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;