import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Customer from '@/models/Customer';

export const dynamic = 'force-dynamic';

// Saare customers mangwane ke liye
export async function GET() {
  try {
    await connectToDatabase();
    // Jiska udhaar sabse zyada hai, wo upar dikhega (-1 mtlb descending order)
    const customers = await Customer.find().sort({ dueAmount: -1, totalPurchases: -1 });
    return NextResponse.json(customers, { status: 200 });
  } catch (error) {
    console.error("Customers Fetch Error:", error);
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}

// 📓 NAYA: Admin Khata Settlement Logic
export async function PATCH(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { customerId, amountToClear } = body;

    if (!customerId || !amountToClear || amountToClear <= 0) {
      return NextResponse.json({ error: 'Valid Customer ID and Settlement Amount required!' }, { status: 400 });
    }

    const customer = await Customer.findById(customerId);
    
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found in database.' }, { status: 404 });
    }

    // Amount minus karna, aur dhyan rakhna ki 0 se kam negative udhaar na ho jaye
    customer.dueAmount = Math.max(0, customer.dueAmount - amountToClear);
    await customer.save();

    return NextResponse.json({ success: true, customer }, { status: 200 });

  } catch (error) {
    console.error("Khata Settle Error:", error);
    return NextResponse.json({ error: 'Failed to settle Khata amount' }, { status: 500 });
  }
}