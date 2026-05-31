import mongoose, { Schema } from 'mongoose';

const productSchema = new Schema({
  name: { type: String, required: true },
  barcode_sku: { type: String, required: true }, // Note: Removed 'unique: true' so same barcode can exist in different branches
  price: { type: Number, required: true },
  stock_quantity: { type: Number, required: true, default: 0 },
  
  // 🏢 NAYA FIELD: Multi-Branch Store Tracking
  branch: { type: String, default: 'Main Branch', required: true }
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;