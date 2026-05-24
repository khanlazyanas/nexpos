import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Shift from '@/models/Shift';

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const cashierName = searchParams.get('cashierName'); 
    
    // Agar kisi specific cashier ki active shift dekhni hai
    if (cashierName) {
      const activeShift = await Shift.findOne({ cashierName, status: 'Open' });
      return NextResponse.json({ activeShift });
    }
    
    // Agar Admin ko saari shifts ki history dekhni hai
    const allShifts = await Shift.find().sort({ createdAt: -1 }).limit(50);
    return NextResponse.json(allShifts);

  } catch (error) {
    return NextResponse.json({ error: 'Error fetching shifts' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { cashierName, openingCash } = await req.json();
    
    // Check karein ki pehle se drawer open toh nahi hai
    const existing = await Shift.findOne({ cashierName, status: 'Open' });
    if (existing) return NextResponse.json({ error: 'Shift already open!' }, { status: 400 });

    const newShift = await Shift.create({ cashierName, openingCash, status: 'Open' });
    return NextResponse.json({ success: true, shift: newShift });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to open shift' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectToDatabase();
    const { shiftId, closingCash, expectedCash } = await req.json();
    
    const updatedShift = await Shift.findByIdAndUpdate(shiftId, {
      closingCash,
      expectedCash,
      status: 'Closed',
      endTime: new Date()
    }, { new: true });
    
    return NextResponse.json({ success: true, shift: updatedShift });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to close shift' }, { status: 500 });
  }
}