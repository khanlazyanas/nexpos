import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    
    // 🏢 MULTI-BRANCH: Extract active branch from cookies
    const cookieStore = await cookies();
    const activeBranch = cookieStore.get('selectedBranch')?.value || 'Main Branch';

    // Filter only current branch orders
    const orders = await Order.find({ branch: activeBranch });
    let totalRevenue = 0;
    const totalOrders = orders.length;
    const dailySalesMap: { [key: string]: number } = {};

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let todayBills = 0;
    let todayCash = 0;
    let todayOnline = 0;

    const productCount: Record<string, number> = {};

    orders.forEach((order) => {
      totalRevenue += order.totalAmount;
      
      const rawDate = order.createdAt || order.date || new Date();
      const dateObj = new Date(rawDate);
      const dateStr = dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

      if (!dailySalesMap[dateStr]) dailySalesMap[dateStr] = 0;
      dailySalesMap[dateStr] += order.totalAmount;

      if (dateObj >= today) {
        todayBills += 1;
        if (order.paymentMethod === 'Cash') todayCash += order.totalAmount;
        else todayOnline += order.totalAmount;
      }

      if (order.items && Array.isArray(order.items)) {
        order.items.forEach((item: any) => {
          const name = item.productName || item.name || 'Unknown';
          const qty = item.quantity || item.cartQuantity || 1;
          productCount[name] = (productCount[name] || 0) + qty;
        });
      }
    });

    const chartData = Object.keys(dailySalesMap).map(date => ({ name: date, Sales: dailySalesMap[date] }));
    const topProducts = Object.entries(productCount).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 5);

    // Filter only current branch products
    const products = await Product.find({ branch: activeBranch });
    const totalProducts = products.length;
    const lowStockItems = products.filter(p => p.stock_quantity <= 5);
    const lowStockCount = lowStockItems.length;

    // AI SMART INSIGHTS ENGINE
    const aiInsights = [];
    if (lowStockCount > 0) aiInsights.push({ type: 'warning', title: 'Critical Restock Alert', text: `You have ${lowStockCount} items running low. Restock '${lowStockItems[0]?.name || 'items'}' immediately.` });
    else aiInsights.push({ type: 'success', title: 'Inventory Optimized', text: 'Stock levels are healthy across all categories in this branch.' });
    if (topProducts.length > 0) aiInsights.push({ type: 'insight', title: 'Sales Opportunity', text: `Trend detected: '${topProducts[0].name}' is your top seller here. Consider creating a bundle offer.` });
    if (todayOnline > todayCash) aiInsights.push({ type: 'info', title: 'Digital Payments Surging', text: `Online transactions (₹${todayOnline}) exceeded Cash (₹${todayCash}) today. Ensure your UPI QR stands are clearly visible.` });
    else if (todayCash > 0 && todayCash >= todayOnline) aiInsights.push({ type: 'info', title: 'Cash Heavy Operations', text: `High cash collection today (₹${todayCash}). Reminder to reconcile the cash drawer before closing.` });

    return NextResponse.json({
      totalRevenue, totalOrders, totalProducts, lowStockCount, lowStockItems, chartData,
      todayBills, todayCash, todayOnline, topProducts, aiInsights
    }, { status: 200 });

  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
  }
}