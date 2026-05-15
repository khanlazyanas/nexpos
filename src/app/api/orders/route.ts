import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';

// 1. Saare purane bills (Sales History) mangwane ke liye
export async function GET() {
  try {
    await connectToDatabase();
    // Sabse naye bills upar dikhane ke liye sort({ createdAt: -1 })
    const orders = await Order.find().sort({ createdAt: -1 });
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Orders Fetch Error:", error);
    return NextResponse.json({ error: 'Sales history load karne me problem aayi' }, { status: 500 });
  }
}

// 2. Refund process karne ke liye (Stock wapas badhana aur status change karna)
export async function PUT(req: Request) {
  try {
    await connectToDatabase();
    const { orderId } = await req.json(); // Ye database ka _id hai

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order nahi mila' }, { status: 404 });
    }

    if (order.status === 'Refunded') {
      return NextResponse.json({ error: 'Ye bill pehle hi refund ho chuka hai!' }, { status: 400 });
    }

    // A. Har item ka stock wapas inventory me add karo (Kyunki saaman wapas aaya hai)
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock_quantity: item.quantity } // Plus quantity
      });
    }

    // B. Bill ka status 'Refunded' set kar do
    order.status = 'Refunded';
    await order.save();

    return NextResponse.json({ success: true, message: 'Refund successful & Stock updated' }, { status: 200 });

  } catch (error) {
    console.error("Refund Error:", error);
    return NextResponse.json({ error: 'Refund process fail ho gaya' }, { status: 500 });
  }
}