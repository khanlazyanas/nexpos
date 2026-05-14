import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic'; // Ye line Next.js ko hamesha fresh data lane ko kehti hai

export async function GET() {
  try {
    await connectToDatabase();

    // 1. Orders se Revenue aur Total Sales calculate karna
    const orders = await Order.find();
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalOrders = orders.length;

    // 2. Products se Total Items aur Low Stock calculate karna
    const products = await Product.find();
    const totalProducts = products.length;
    // Agar stock 5 ya usse kam hai, toh low stock alert
    const lowStockCount = products.filter(p => p.stock_quantity <= 5).length;

    return NextResponse.json({
      totalRevenue,
      totalOrders,
      totalProducts,
      lowStockCount
    }, { status: 200 });

  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
  }
}