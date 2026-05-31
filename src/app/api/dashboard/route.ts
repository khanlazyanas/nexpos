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

    // 🤖 AI SMART INSIGHTS ENGINE (Dynamically generated based on live data)
    const aiInsights = [];

    // 1. Inventory Insight
    if (lowStockCount > 0) {
      aiInsights.push({
        type: 'warning',
        title: 'Critical Restock Alert',
        text: `You have ${lowStockCount} items running low. Restock '${lowStockItems[0]?.name || 'items'}' immediately to avoid lost sales.`
      });
    } else {
      aiInsights.push({
        type: 'success',
        title: 'Inventory Optimized',
        text: 'Stock levels are healthy across all categories. Capital is well-distributed.'
      });
    }

    // 2. Sales Trend Insight
    if (topProducts.length > 0) {
      aiInsights.push({
        type: 'insight',
        title: 'Sales Opportunity',
        text: `Trend detected: '${topProducts[0].name}' is your top seller. Consider creating a bundle offer around it to boost AOV.`
      });
    }

    // 3. Financial Insight
    if (todayOnline > todayCash) {
       aiInsights.push({
         type: 'info',
         title: 'Digital Payments Surging',
         text: `Online transactions (₹${todayOnline}) exceeded Cash (₹${todayCash}) today. Ensure your UPI QR stands are clearly visible.`
       });
    } else if (todayCash > 0 && todayCash >= todayOnline) {
       aiInsights.push({
         type: 'info',
         title: 'Cash Heavy Operations',
         text: `High cash collection today (₹${todayCash}). Reminder to reconcile the cash drawer in the Shift Manager before closing.`
       });
    }

    return NextResponse.json({
      totalRevenue,
      totalOrders,
      totalProducts,
      lowStockCount,
      lowStockItems,
      chartData,
      todayBills,
      todayCash,
      todayOnline,
      topProducts,
      aiInsights // 🚀 Added AI Insights to payload
    }, { status: 200 });

  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
  }
}