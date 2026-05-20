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