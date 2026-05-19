import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await connectToDatabase();

    // 🛠️ Note: Agar aapke Checkout model ka naam alag hai toh use import karein. 
    // Hum direct database collection 'orders' se aggregate kar rahe hain taaki koi model issue na ho.
    const OrderCollection = mongoose.connection.collection('orders');
    const orders = await OrderCollection.find({}).toArray();

    if (!orders || orders.length === 0) {
      return NextResponse.json({
        todayRevenue: 0,
        totalOrders: 0,
        avgBill: 0,
        cashSales: 0,
        upiSales: 0,
        chartData: []
      }, { status: 200 });
    }

    // 🗓️ Format dates to calculate Today's Sales
    const todayStr = new Date().toLocaleDateString('en-IN');

    let todayRevenue = 0;
    let totalOrders = orders.length;
    let totalRevenue = 0;
    let cashSales = 0;
    let upiSales = 0;

    // Daily Sales Data Mapping for Chart
    const dailySalesMap: { [key: string]: number } = {};

    orders.forEach((order: any) => {
      const amount = Number(order.totalAmount) || 0;
      totalRevenue += amount;

      // Extract date string from order date (handling local format variations)
      const orderDateStr = order.date ? order.date.split(',')[0].trim() : '';
      
      if (orderDateStr === todayStr) {
        todayRevenue += amount;
      }

      // Payment Method Split
      if (order.paymentMethod === 'Cash') cashSales += amount;
      if (order.paymentMethod === 'UPI' || order.paymentMethod === 'Card') upiSales += amount;

      // Group by date for Charting
      if (orderDateStr) {
        dailySalesMap[orderDateStr] = (dailySalesMap[orderDateStr] || 0) + amount;
      }
    });

    const avgBill = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    // Convert sales map to array format for Recharts (showing last 7 unique days)
    const chartData = Object.keys(dailySalesMap).map(date => ({
      name: date,
      Sales: dailySalesMap[date]
    })).slice(-7);

    return NextResponse.json({
      todayRevenue,
      totalOrders,
      avgBill,
      cashSales,
      upiSales,
      chartData
    }, { status: 200 });

  } catch (error) {
    console.error("Dashboard backend stats error:", error);
    return NextResponse.json({ error: 'Stats fetch fail ho gaya' }, { status: 500 });
  }
}