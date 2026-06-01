import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. DB Connect aur Branch Check
    await connectToDatabase();
    const cookieStore = await cookies();
    const activeBranch = cookieStore.get('selectedBranch')?.value || 'Main Branch';

    // 2. Sirf select ki hui branch ka data nikalo (Purana data bhi include karke)
    const filterQuery = activeBranch === 'Main Branch' 
      ? { $or: [{ branch: activeBranch }, { branch: { $exists: false } }] } 
      : { branch: activeBranch };

    const orders = await Order.find(filterQuery).sort({ createdAt: -1 });

    // 3. 📊 CSV File ka Header (Columns ke naam)
    let csvContent = "Date,Bill Number,Customer Name,Mobile,Payment Method,SubTotal (Rs),Discount (Rs),Tax/GST (Rs),Total Amount (Rs)\n";

    // 4. Data ko loop karke CSV rows me convert karna
    orders.forEach((order) => {
      const date = new Date(order.createdAt || order.date || Date.now()).toLocaleDateString('en-IN');
      const billNo = order.orderId || 'N/A';
      const customer = order.customerName || 'Guest';
      const mobile = order.customerMobile || 'N/A';
      const method = order.paymentMethod || 'Cash';
      
      const sub = order.subTotal || 0;
      const disc = order.discount || 0;
      const tax = order.tax || 0;
      const total = order.totalAmount || 0;

      // Ek row ko comma se separate karke string me jodo
      csvContent += `${date},${billNo},${customer},${mobile},${method},${sub},${disc},${tax},${total}\n`;
    });

    // 5. Browser ko batao ki ye ek Downloadable CSV File hai
    const branchFileName = activeBranch.replace(/\s+/g, '_'); // Space ko underscore se replace karo
    
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="NexPOS_GST_${branchFileName}.csv"`,
      },
    });

  } catch (error) {
    console.error("Export API Error:", error);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}