import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    
    // Frontend se saara Advanced data lena
    const body = await req.json();
    const { 
      items, 
      totalAmount,
      orderId,
      customerName,
      customerMobile,
      subTotal,
      discount,
      tax,
      paymentMethod
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart empty hai' }, { status: 400 });
    }

    // 1. Order database format me convert karna
    const orderItems = items.map((item: any) => ({
      product: item._id,
      name: item.name,
      price: item.price,
      quantity: item.cartQuantity
    }));

    // 2. Naya Advanced Order (Bill) save karna
    const newOrder = await Order.create({
      orderId,
      customerName: customerName || 'Guest',
      customerMobile: customerMobile || '',
      items: orderItems,
      subTotal,
      discount,
      tax,
      totalAmount,
      paymentMethod: paymentMethod || 'Cash'
    });

    // 3. Products ka Stock kam karna (Loop chala kar)
    for (const item of items) {
      await Product.findByIdAndUpdate(item._id, {
        $inc: { stock_quantity: -item.cartQuantity } // Minus karke stock hatao
      });
    }

    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });

  } catch (error) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ error: 'Checkout fail ho gaya' }, { status: 500 });
  }
}