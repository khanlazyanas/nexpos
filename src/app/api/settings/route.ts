import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Setting from '@/models/Setting';

export const dynamic = 'force-dynamic';

// 1. Current Settings mangwane ke liye
export async function GET() {
  try {
    await connectToDatabase();
    let settings = await Setting.findOne();
    
    // Agar database me koi setting pehle se nahi hai, toh default create kar do
    if (!settings) {
      settings = await Setting.create({});
    }
    
    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    console.error("Settings Fetch Error:", error);
    return NextResponse.json({ error: 'Settings load karne me dikkat aayi' }, { status: 500 });
  }
}

// 2. Settings update karne ke liye
export async function PUT(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    let settings = await Setting.findOne();
    if (!settings) {
      settings = new Setting({});
    }

    // Body se data lekar update karna
    settings.storeName = body.storeName || settings.storeName;
    settings.storeAddress = body.storeAddress || settings.storeAddress;
    settings.storePhone = body.storePhone || settings.storePhone;
    settings.gstPercentage = Number(body.gstPercentage) ?? settings.gstPercentage;

    await settings.save();
    return NextResponse.json({ success: true, message: 'Store settings updated!', settings }, { status: 200 });
  } catch (error) {
    console.error("Settings Update Error:", error);
    return NextResponse.json({ error: 'Settings update fail ho gaya' }, { status: 500 });
  }
}