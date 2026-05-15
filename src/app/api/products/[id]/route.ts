import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';

// UPDATE (Edit) Product
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    
    // Naya Next.js Rule: Params ko await karna padta hai
    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    const data = await req.json();

    const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true });

    if (!updatedProduct) {
      return NextResponse.json({ error: 'Product nahi mila' }, { status: 404 });
    }

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: 'Product update fail ho gaya' }, { status: 500 });
  }
}

// DELETE Product
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    
    // Naya Next.js Rule: Params ko await karna padta hai
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({ error: 'Product nahi mila' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Product deleted' }, { status: 200 });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: 'Product delete fail ho gaya' }, { status: 500 });
  }
}