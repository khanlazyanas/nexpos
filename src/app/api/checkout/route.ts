import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import Customer from '@/models/Customer';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    
    // 🏢 MULTI-BRANCH: Inject branch into new order
    const cookieStore = await cookies();
    const activeBranch = cookieStore.get('selectedBranch')?.value || 'Main Branch';
    
    const body = await req.json();
    const { 
      items, totalAmount, orderId, customerName, customerMobile, subTotal, discount, tax, paymentMethod
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart empty hai' }, { status: 400 });
    }

    const orderItems = items.map((item: any) => ({
      product: item._id, name: item.name, price: item.price, quantity: item.cartQuantity
    }));

    const newOrder = await Order.create({
      orderId,
      customerName: customerName || 'Guest',
      customerMobile: customerMobile || '',
      items: orderItems,
      subTotal, discount, tax, totalAmount,
      paymentMethod: paymentMethod || 'Cash',
      branch: activeBranch // Assigning the bill to the specific store branch
    });

    for (const item of items) {
      await Product.findByIdAndUpdate(item._id, {
        $inc: { stock_quantity: -item.cartQuantity } 
      });
    }

    if (customerName && customerMobile) {
      const existingCustomer = await Customer.findOne({ phone: customerMobile });
      if (existingCustomer) {
        existingCustomer.totalPurchases += totalAmount;
        await existingCustomer.save();
      } else {
        await Customer.create({
          name: customerName, phone: customerMobile, totalPurchases: totalAmount, dueAmount: 0
        });
      }
    }

    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });

  } catch (error) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ error: 'Checkout fail ho gaya' }, { status: 500 });
  }
}