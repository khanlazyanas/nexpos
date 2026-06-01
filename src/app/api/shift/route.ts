import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/db';
import Shift from '@/models/Shift';
import Order from '@/models/Order'; // Tally logic ke liye orders include kiye hain

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const cookieStore = await cookies();
    const activeBranch = cookieStore.get('selectedBranch')?.value || 'Main Branch';
    
    const { searchParams } = new URL(req.url);
    const cashierName = searchParams.get('cashierName'); 
    
    // Agar kisi specific cashier ki active shift dekhni hai
    if (cashierName) {
      const activeShift = await Shift.findOne({ cashierName, status: 'Open', branch: activeBranch });
      
      let currentExpectedCash = 0;
      let totalCashSales = 0;

      // 🧮 LIVE CALCULATION LOGIC
      if (activeShift) {
        // Shift open hone ke baad ke saare CASH orders uthao
        const shiftOrders = await Order.find({
          branch: activeBranch,
          paymentMethod: 'Cash',
          createdAt: { $gte: activeShift.startTime }
        });
        
        // Total cash sales calculate karo
        totalCashSales = shiftOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        // Expected Cash in Drawer = Subah dala tha + Aaj Cash me bika hai
        currentExpectedCash = activeShift.openingCash + totalCashSales;
      }

      return NextResponse.json({ activeShift, currentExpectedCash, totalCashSales });
    }
    
    // Agar Admin ko saari shifts ki history dekhni hai
    const allShifts = await Shift.find({ branch: activeBranch }).sort({ createdAt: -1 }).limit(50);
    return NextResponse.json(allShifts);

  } catch (error) {
    return NextResponse.json({ error: 'Error fetching shifts' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const cookieStore = await cookies();
    const activeBranch = cookieStore.get('selectedBranch')?.value || 'Main Branch';

    const { cashierName, openingCash } = await req.json();
    
    // Check karein ki pehle se drawer open toh nahi hai is branch me
    const existing = await Shift.findOne({ cashierName, status: 'Open', branch: activeBranch });
    if (existing) return NextResponse.json({ error: 'Shift already open in this branch!' }, { status: 400 });

    const newShift = await Shift.create({ 
      cashierName, 
      openingCash, 
      status: 'Open',
      branch: activeBranch 
    });
    return NextResponse.json({ success: true, shift: newShift });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to open shift' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectToDatabase();
    const { shiftId, closingCash, expectedCash } = await req.json();
    
    // 📉 Shortage ya Overage ka pata lagana
    const cashDiscrepancy = closingCash - expectedCash; 

    const updatedShift = await Shift.findByIdAndUpdate(shiftId, {
      closingCash,
      expectedCash,
      cashDiscrepancy,
      status: 'Closed',
      endTime: new Date()
    }, { new: true });
    
    return NextResponse.json({ success: true, shift: updatedShift, cashDiscrepancy });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to close shift' }, { status: 500 });
  }
}