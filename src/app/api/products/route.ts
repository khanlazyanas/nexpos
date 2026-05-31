import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';

// GET: Saare products ko database se branch filters ke sath lane ke liye
export async function GET() {
  try {
    await connectToDatabase(); 
    
    // 🏢 MULTI-BRANCH: Extract the currently selected active store location context
    const cookieStore = await cookies();
    const activeBranch = cookieStore.get('selectedBranch')?.value || 'Main Branch';
    
    // Smart Filter: Main branch hone par legacy items (bina branch tag wale) bhi safely visible rahenge
    const filterQuery = activeBranch === 'Main Branch' 
      ? { $or: [{ branch: activeBranch }, { branch: { $exists: false } }] } 
      : { branch: activeBranch };

    const products = await Product.find(filterQuery).sort({ createdAt: -1 }); 
    
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: 'Products lane me error aayi' }, { status: 500 });
  }
}

// POST: Naya product current selected branch context me save karne ke liye
export async function POST(req: Request) {
  try {
    await connectToDatabase();
    
    // 🏢 MULTI-BRANCH: Identify current active branch to tag the product to the right store
    const cookieStore = await cookies();
    const activeBranch = cookieStore.get('selectedBranch')?.value || 'Main Branch';
    
    const body = await req.json(); 
    const { name, barcode_sku, price, stock_quantity } = body;

    // Standard Validation
    if (!name || !barcode_sku || !price) {
      return NextResponse.json({ error: 'Name, Barcode, aur Price zaroori hain' }, { status: 400 });
    }

    const newProduct = await Product.create({
      name,
      barcode_sku,
      price,
      stock_quantity: stock_quantity || 0,
      branch: activeBranch // Attaching current active virtual branch identifier
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    console.error("Error creating product:", error);
    
    // Barcode SKU redundancy filter constraint warning
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Ye barcode pehle se exist karta hai' }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Product save nahi ho paya' }, { status: 500 });
  }
}