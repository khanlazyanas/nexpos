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
  orderId: { type: String, required: true, unique: true }, 
  
  customerName: { type: String, default: 'Guest' },
  customerMobile: { type: String, default: '' },
  
  items: [OrderItemSchema],
  
  subTotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  
  paymentMethod: { type: String, enum: ['Cash', 'Card', 'UPI'], default: 'Cash' },
  status: { type: String, enum: ['Completed', 'Refunded'], default: 'Completed' },
  
  // 🏢 NAYA FIELD: Multi-Branch Store Tracking
  branch: { type: String, default: 'Main Branch', required: true }
}, { 
  timestamps: true 
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);