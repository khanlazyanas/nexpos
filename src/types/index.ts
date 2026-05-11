// src/types/index.ts

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Cashier';
}

export interface IProduct {
  _id: string;
  name: string;
  barcode_sku: string;
  price: number;
  stock_quantity: number;
}

// Ye POS screen par cart me items dikhane ke kaam aayega
export interface ICartItem extends IProduct {
  cartQuantity: number;
}