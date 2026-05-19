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
    
    let totalRevenue = 0;
    const totalOrders = orders.length;
    
    // NAYA: Chart Data ke liye rozana ki kamai ka hisaab rakhne wala object
    const dailySalesMap: { [key: string]: number } = {};

    orders.forEach((order) => {
      // Total revenue calculate karna
      totalRevenue += order.totalAmount;

      // Order ki date nikalna (Agar createdAt nahi hai toh fallback current date)
      const rawDate = order.createdAt || order.date || new Date();
      const dateObj = new Date(rawDate);
      
      // Date ko chote format me badalna (e.g., "19 May")
      const dateStr = dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

      // Us din ki sales me amount jodna
      if (!dailySalesMap[dateStr]) {
        dailySalesMap[dateStr] = 0;
      }
      dailySalesMap[dateStr] += order.totalAmount;
    });

    // 2. Products se Total Items aur Low Stock calculate karna
    const products = await Product.find();
    const totalProducts = products.length;
    const lowStockCount = products.filter(p => p.stock_quantity <= 5).length;

    // NAYA: dailySalesMap ko Object se Array me badalna taaki Recharts graph padh sake
    const chartData = Object.keys(dailySalesMap).map(date => ({
      name: date,
      Sales: dailySalesMap[date]
    }));

    return NextResponse.json({
      totalRevenue,
      totalOrders,
      totalProducts,
      lowStockCount,
      chartData // NAYA: Ab graph ko uski zaroorat ka data mil jayega!
    }, { status: 200 });

  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
  }
}