import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Customer from '@/models/Customer';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get('phone');

    // Retail me 10 digit se kam par database me load nahi dalenge
    if (!phone || phone.length < 10) {
      return NextResponse.json({ error: 'Valid phone number required' }, { status: 400 });
    }

    await connectToDatabase();
    
    // Sirf us number ka customer dhundho
    const customer = await Customer.findOne({ phone });

    if (customer) {
      return NextResponse.json({ success: true, customer }, { status: 200 });
    } else {
      // Agar naya customer hai toh fail nahi karna, bas bata dena ki naya hai
      return NextResponse.json({ success: false, message: 'New walk-in customer' }, { status: 404 });
    }

  } catch (error) {
    console.error("Customer Lookup Error:", error);
    return NextResponse.json({ error: 'System error during lookup' }, { status: 500 });
  }
}