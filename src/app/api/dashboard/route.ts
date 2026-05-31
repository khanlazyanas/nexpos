import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Database Connection Setup
    await connectToDatabase();

    // 2. Extract active branch from browser cookies securely
    const cookieStore = await cookies();
    const activeBranch = cookieStore.get('selectedBranch')?.value || 'Main Branch';

    // 3. Smart Filter Query: Agar Main Branch hai, toh purana (bina branch tag wala) data bhi fetch hoga
    const filterQuery = activeBranch === 'Main Branch' 
      ? { $or: [{ branch: activeBranch }, { branch: { $exists: false } }] } 
      : { branch: activeBranch };

    // Fetch orders based on the branch filter configuration
    const orders = await Order.find(filterQuery);
    
    let totalRevenue = 0;
    const totalOrders = orders.length;
    const dailySalesMap: { [key: string]: number } = {};

    // Today's operational analytics counters
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let todayBills = 0;
    let todayCash = 0;
    let todayOnline = 0;

    // Track items frequency for top sellers analytics
    const productCount: Record<string, number> = {};

    orders.forEach((order) => {
      totalRevenue += order.totalAmount || 0;
      
      const rawDate = order.createdAt || order.date || new Date();
      const dateObj = new Date(rawDate);
      const dateStr = dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

      // Formulate Recharts sequential timeline array map
      if (!dailySalesMap[dateStr]) {
        dailySalesMap[dateStr] = 0;
      }
      dailySalesMap[dateStr] += order.totalAmount || 0;

      // Extract current date specific statistics
      if (dateObj >= today) {
        todayBills += 1;
        if (order.paymentMethod === 'Cash') {
          todayCash += order.totalAmount || 0;
        } else {
          todayOnline += order.totalAmount || 0;
        }
      }

      // Compute item quantities to calculate premium best sellers metrics
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach((item: any) => {
          const name = item.productName || item.name || 'Unknown Item';
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

    // Fetch products filtered strictly by current enterprise tenant context
    const products = await Product.find(filterQuery);
    const totalProducts = products.length;
    const lowStockItems = products.filter(p => p.stock_quantity <= 5);
    const lowStockCount = lowStockItems.length;

    // 🤖 ENGINE: AI SMART INSIGHTS GENERATION BLOCK
    const aiInsights = [];

    // Rule 1: Inventory Health Check
    if (lowStockCount > 0) {
      aiInsights.push({
        type: 'warning',
        title: 'Critical Restock Alert',
        text: `You have ${lowStockCount} items running low in this branch. Restock '${lowStockItems[0]?.name || 'items'}' immediately to avoid lost sales.`
      });
    } else {
      aiInsights.push({
        type: 'success',
        title: 'Inventory Optimized',
        text: 'Stock levels are completely healthy across all categories in this branch.'
      });
    }

    // Rule 2: Top Selling Product Promotion Analysis
    if (topProducts.length > 0) {
      aiInsights.push({
        type: 'insight',
        title: 'Sales Opportunity',
        text: `Trend detected: '${topProducts[0].name}' is your top seller in this area. Consider setting up a special combo promotion.`
      });
    }

    // Rule 3: Monetary Flow Ledger Reminders
    if (todayOnline > todayCash) {
      aiInsights.push({
        type: 'info',
        title: 'Digital Payments Surging',
        text: `Online transactions (₹${todayOnline}) exceeded Cash (₹${todayCash}) today. Ensure UPI QR code setups are properly placed at checkouts.`
      });
    } else if (todayCash > 0 && todayCash >= todayOnline) {
      aiInsights.push({
        type: 'info',
        title: 'Cash Heavy Operations',
        text: `High cash collection today (₹${todayCash}). Ensure a full drawer reconciliation is processed in Shift Manager before locking up.`
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
      aiInsights 
    }, { status: 200 });

  } catch (error) {
    console.error("Dashboard API Structural Error:", error);
    return NextResponse.json({ error: 'Failed to fetch comprehensive dashboard metrics' }, { status: 500 });
  }
}