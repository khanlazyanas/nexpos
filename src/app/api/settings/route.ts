import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Setting from '@/models/Setting';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    let settings = await Setting.findOne();
    
    if (!settings) {
      settings = await Setting.create({});
    }
    
    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    console.error("Settings Fetch Error:", error);
    return NextResponse.json({ error: 'Settings load error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    let settings = await Setting.findOne();
    if (!settings) {
      settings = new Setting({});
    }

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