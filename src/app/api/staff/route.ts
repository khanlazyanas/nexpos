import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User'; 
import Shift from '@/models/Shift'; // 📊 Leaderboard analytics ke liye include kiya
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

// GET: Saare Staff ki list + Live Performance Leaderboard lane ke liye
export async function GET() {
  try {
    await connectToDatabase();
    
    // 1. Saare cashiers ki profile list nikaalo
    const staffMembers = await User.find({ role: 'Cashier' }).select('-password').sort({ createdAt: -1 });

    // 2. 📊 AGGREGATION LOGIC: Shift collection se live performance leaderboard calculate karo
    const leaderboardData = await Shift.aggregate([
      { $match: { status: 'Closed' } }, // Sirf closed shifts ka sales uthao
      {
        $group: {
          _id: "$cashierName",
          totalSalesAmount: { $sum: { $subtract: ["$expectedCash", "$openingCash"] } }, // Sales = Expected - Opening Base
          shiftsCount: { $sum: 1 }
        }
      },
      { $sort: { totalSalesAmount: -1 } } // Jiski sales zyada, wo top par 🏆
    ]);

    // Dono data ek sath single object me bhej rahe hain
    return NextResponse.json({ staff: staffMembers, leaderboard: leaderboardData }, { status: 200 });
  } catch (error) {
    console.error("Fetch Staff Error:", error);
    return NextResponse.json({ error: 'Failed to fetch staff analytics' }, { status: 500 });
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

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'Cashier' 
    });

    return NextResponse.json({ success: true, message: 'Staff member added successfully' }, { status: 201 });
  } catch (error) {
    console.error("Add Staff Error:", error);
    return NextResponse.json({ error: 'Failed to add staff member' }, { status: 500 });
  }
}

// DELETE: Cashier ka access hatane ke liye
export async function DELETE(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Staff ID is required' }, { status: 400 });
    }

    await User.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Access revoked successfully' }, { status: 200 });
  } catch (error) {
    console.error("Delete Staff Error:", error);
    return NextResponse.json({ error: 'Failed to delete staff member' }, { status: 500 });
  }
}