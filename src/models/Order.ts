import mongoose from 'mongoose';

// Har ek item jo bill me hai, uska structure
const OrderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true }
});

// Pure Bill/Order ka naya Advanced structure
const OrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true }, // Auto-generated Bill Number
  
  // Naye Customer Details
  customerName: { type: String, default: 'Guest' },
  customerMobile: { type: String, default: '' },
  
  items: [OrderItemSchema],
  
  // Finance Calculation
  subTotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  
  // Payment Option
  paymentMethod: { type: String, enum: ['Cash', 'Card', 'UPI'], default: 'Cash' }
}, { 
  timestamps: true // Ye automatically bill banne ka time aur date save karega
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);