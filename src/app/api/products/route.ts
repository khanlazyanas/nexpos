import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';

export async function GET() {
  try {
    await connectToDatabase(); 
    
    // 🏢 MULTI-BRANCH: Extract active branch
    const cookieStore = await cookies();
    const activeBranch = cookieStore.get('selectedBranch')?.value || 'Main Branch';
    
    // Fetch products ONLY for this branch
    const products = await Product.find({ branch: activeBranch }).sort({ createdAt: -1 }); 
    
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: 'Products lane me error aayi' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    
    // 🏢 MULTI-BRANCH: Inject branch into new product
    const cookieStore = await cookies();
    const activeBranch = cookieStore.get('selectedBranch')?.value || 'Main Branch';
    
    const body = await req.json(); 
    const { name, barcode_sku, price, stock_quantity } = body;

    if (!name || !barcode_sku || !price) {
      return NextResponse.json({ error: 'Name, Barcode, aur Price zaroori hain' }, { status: 400 });
    }

    const newProduct = await Product.create({
      name,
      barcode_sku,
      price,
      stock_quantity: stock_quantity || 0,
      branch: activeBranch // Assigning to correct store
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    console.error("Error creating product:", error);
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Ye barcode pehle se exist karta hai' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Product save nahi ho paya' }, { status: 500 });
  }
}