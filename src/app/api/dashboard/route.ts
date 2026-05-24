import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();

    const orders = await Order.find();
    let totalRevenue = 0;
    const totalOrders = orders.length;
    const dailySalesMap: { [key: string]: number } = {};

    // For Today's Summary
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let todayBills = 0;
    let todayCash = 0;
    let todayOnline = 0;

    // For Top Products
    const productCount: Record<string, number> = {};

    orders.forEach((order) => {
      totalRevenue += order.totalAmount;
      
      const rawDate = order.createdAt || order.date || new Date();
      const dateObj = new Date(rawDate);
      const dateStr = dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

      // Build daily map for main chart
      if (!dailySalesMap[dateStr]) dailySalesMap[dateStr] = 0;
      dailySalesMap[dateStr] += order.totalAmount;

      // Calculate Today's Stats
      if (dateObj >= today) {
        todayBills += 1;
        if (order.paymentMethod === 'Cash') todayCash += order.totalAmount;
        else todayOnline += order.totalAmount;
      }

      // Calculate Top Products
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach((item: any) => {
          const name = item.productName || item.name || 'Unknown';
          const qty = item.quantity || item.cartQuantity || 1;
          productCount[name] = (productCount[name] || 0) + qty;
        });
      }
    });

    const chartData = Object.keys(dailySalesMap).map(date => ({
      name: date,
      Sales: dailySalesMap[date]
    }));

    const topProducts = Object.entries(productCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    const products = await Product.find();
    const totalProducts = products.length;
    const lowStockItems = products.filter(p => p.stock_quantity <= 5);
    const lowStockCount = lowStockItems.length;

    return NextResponse.json({
      totalRevenue,
      totalOrders,
      totalProducts,
      lowStockCount,
      lowStockItems,
      chartData,
      todayBills,      // NEW
      todayCash,       // NEW
      todayOnline,     // NEW
      topProducts      // NEW
    }, { status: 200 });

  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
  }
}