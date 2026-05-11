import mongoose, { Schema } from 'mongoose';

const saleSchema = new Schema({
  cashier_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  total_amount: { type: Number, required: true },
  items: [{
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }]
}, { timestamps: true });

const Sale = mongoose.models.Sale || mongoose.model('Sale', saleSchema);
export default Sale;