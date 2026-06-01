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
      items, totalAmount, orderId, customerName, customerMobile, subTotal, discount, tax, paymentMethod, usedPoints = 0
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart empty hai' }, { status: 400 });
    }

    // 📓 KHATA SECURITY CHECK: Udhaar bina 10 digit number ke nahi diya ja sakta
    if (paymentMethod === 'Khata' && (!customerMobile || customerMobile.length < 10)) {
      return NextResponse.json({ error: 'Khata ke liye mobile number zaroori hai!' }, { status: 400 });
    }

    const orderItems = items.map((item: any) => ({
      product: item._id, name: item.name, price: item.price, quantity: item.cartQuantity
    }));

    // 1. Order create karo (Isme Khata bhi as a paymentMethod save hoga)
    const newOrder = await Order.create({
      orderId,
      customerName: customerName || 'Guest',
      customerMobile: customerMobile || '',
      items: orderItems,
      subTotal, discount, tax, totalAmount, // totalAmount me pehle se hi usedPoints minus hokar frontend se aayenge
      paymentMethod: paymentMethod || 'Cash',
      branch: activeBranch
    });

    // 2. Stock minus karo
    for (const item of items) {
      await Product.findByIdAndUpdate(item._id, {
        $inc: { stock_quantity: -item.cartQuantity } 
      });
    }

    // 3. 🎁 NAYA: Loyalty Points & 📓 CRM KHATA Calculation
    let earnedPoints = 0;
    if (customerName && customerMobile) {
      // Har ₹100 ki shopping par 1 Point (Khata walo ko bhi milega)
      earnedPoints = Math.floor(totalAmount / 100); 

      const existingCustomer = await Customer.findOne({ phone: customerMobile });
      
      if (existingCustomer) {
        existingCustomer.totalPurchases += totalAmount;
        
        // Points Calculation
        const currentPoints = existingCustomer.loyaltyPoints || 0;
        existingCustomer.loyaltyPoints = Math.max(0, currentPoints - usedPoints) + earnedPoints;
        
        // 📓 KHATA MUTATION: Agar Payment Method 'Khata' hai, toh Due Amount badhao
        if (paymentMethod === 'Khata') {
          existingCustomer.dueAmount = (existingCustomer.dueAmount || 0) + totalAmount;
        }

        await existingCustomer.save();
      } else {
        // Naya Customer First Time Entry
        await Customer.create({
          name: customerName, 
          phone: customerMobile, 
          totalPurchases: totalAmount, 
          dueAmount: paymentMethod === 'Khata' ? totalAmount : 0, // Pehla bill hi udhaar hai toh yahan aayega
          loyaltyPoints: earnedPoints 
        });
      }
    }

    // Response me usedPoints aur earnedPoints bhi bhej do taaki receipt me dikhe
    return NextResponse.json({ success: true, order: newOrder, usedPoints, earnedPoints }, { status: 201 });

  } catch (error) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ error: 'Checkout fail ho gaya' }, { status: 500 });
  }
}