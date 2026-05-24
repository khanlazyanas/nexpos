import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import mongoose from 'mongoose';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    
    // Check if model exists or compile it safely
    const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({}, { strict: false }));
    
    // orderId unique string se fetch karenge (e.g. ORD-123456)
    const order = await Order.findOne({ orderId: params.id });
    
    if (!order) {
      return NextResponse.json({ error: 'Receipt not found' }, { status: 404 });
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error("Public Receipt API Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}