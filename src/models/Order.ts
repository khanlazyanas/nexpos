import mongoose from 'mongoose';

// Har ek item jo bill me hai, uska structure
const OrderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true }
});

// Pure Bill/Order ka structure
const OrderSchema = new mongoose.Schema({
  items: [OrderItemSchema],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, default: 'Cash' }
}, { 
  timestamps: true // Ye automatically bill banne ka time aur date save karega
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);