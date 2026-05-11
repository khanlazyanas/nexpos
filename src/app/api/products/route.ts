import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';

// GET: Saare products ko database se lane ke liye
export async function GET() {
  try {
    await connectToDatabase(); // Pehle DB connect karo
    const products = await Product.find({}).sort({ createdAt: -1 }); // Latest pehle
    
    // Express me 'res.status(200).json()' hota tha, Next.js me 'NextResponse.json()' use hota hai
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: 'Products lane me error aayi' }, { status: 500 });
  }
}

// POST: Naya product database me save karne ke liye
export async function POST(req: Request) {
  try {
    await connectToDatabase();
    
    // Express me 'req.body' hota tha, Next.js me 'req.json()' method hota hai
    const body = await req.json(); 
    const { name, barcode_sku, price, stock_quantity } = body;

    // Validation
    if (!name || !barcode_sku || !price) {
      return NextResponse.json({ error: 'Name, Barcode, aur Price zaroori hain' }, { status: 400 });
    }

    const newProduct = await Product.create({
      name,
      barcode_sku,
      price,
      stock_quantity: stock_quantity || 0
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    console.error("Error creating product:", error);
    
    // Agar same barcode wala product dobara add ho
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Ye barcode pehle se exist karta hai' }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Product save nahi ho paya' }, { status: 500 });
  }
}