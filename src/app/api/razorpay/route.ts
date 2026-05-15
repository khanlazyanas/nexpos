import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
});

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();

    // Razorpay amount paise (paise) me leta hai, rupees me nahi (isliye * 100)
    const options = {
      amount: amount * 100, 
      currency: 'INR',
      receipt: 'rcpt_' + Math.floor(Math.random() * 10000),
    };

    const order = await razorpay.orders.create(options);
    
    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Razorpay Error:", error);
    return NextResponse.json({ error: 'Payment gateway error' }, { status: 500 });
  }
}