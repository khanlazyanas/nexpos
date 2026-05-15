import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount } = body;

    // 1. Check if keys are actually loading
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error("KEYS GAYAB HAIN!");
      return NextResponse.json({ error: "Backend me Razorpay keys missing hain." }, { status: 500 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // 2. Fix Math/Decimal precision error (Razorpay strongly strictly integer mangta hai)
    const options = {
      amount: Math.round(amount * 100), // Paise me convert karke round off kiya
      currency: 'INR',
      receipt: 'rcpt_' + Math.floor(Math.random() * 1000000),
    };

    const order = await razorpay.orders.create(options);
    
    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error("Razorpay Asli Error:", error);
    // 3. Jo asali error hai, wahi frontend ko bhejo
    const errorMessage = error?.error?.description || error.message || 'Payment gateway error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}