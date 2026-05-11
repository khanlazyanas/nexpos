import mongoose, { Schema } from 'mongoose';

const productSchema = new Schema({
  name: { type: String, required: true },
  barcode_sku: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  stock_quantity: { type: Number, required: true, default: 0 },
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;