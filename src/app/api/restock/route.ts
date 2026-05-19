import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';

export async function PUT(req: Request) {
  try {
    await connectToDatabase();
    const { productId, addedQuantity } = await req.json();

    if (!productId || !addedQuantity) {
      return NextResponse.json({ error: 'Data missing' }, { status: 400 });
    }

    // $inc ka matlab hai 'increment' (purane stock me naya stock jod do)
    const product = await Product.findByIdAndUpdate(
      productId,
      { $inc: { stock_quantity: Number(addedQuantity) } },
      { new: true }
    );

    if (!product) {
      return NextResponse.json({ error: 'Product nahi mila' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Stock Updated!' }, { status: 200 });
  } catch (error) {
    console.error("Restock Error:", error);
    return NextResponse.json({ error: 'Restock fail ho gaya' }, { status: 500 });
  }
}