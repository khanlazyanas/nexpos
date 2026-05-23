import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User'; 
import bcrypt from 'bcryptjs';

// GET: Saare Staff (Cashiers) ki list lane ke liye
export async function GET() {
  try {
    await connectToDatabase();
    // Sirf un users ko laao jinka role 'Cashier' hai
    const staffMembers = await User.find({ role: 'Cashier' }).select('-password').sort({ createdAt: -1 });
    return NextResponse.json(staffMembers, { status: 200 });
  } catch (error) {
    console.error("Fetch Staff Error:", error);
    return NextResponse.json({ error: 'Failed to fetch staff' }, { status: 500 });
  }
}

// POST: Naya Cashier add karne ke liye
export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Check agar email pehle se exist karta hai
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    // Password Hash (Encrypt) karna
    const hashedPassword = await bcrypt.hash(password, 10);

    // Naya Cashier Save karna
    const newStaff = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'Cashier' // Default fix role for this API
    });

    return NextResponse.json({ success: true, message: 'Staff member added successfully' }, { status: 201 });
  } catch (error) {
    console.error("Add Staff Error:", error);
    return NextResponse.json({ error: 'Failed to add staff member' }, { status: 500 });
  }
}