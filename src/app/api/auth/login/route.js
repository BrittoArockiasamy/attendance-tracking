import { connectDB } from '@/lib/mongo';
import User from '@/models/user';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { phone } = await req.json();
  await connectDB();
  const user = await User.findOne({ phone });

  if (!user) {
    return NextResponse.json({ error: 'Invalid phone number' }, { status: 401 });
  }

  const res = NextResponse.json({ success: true, user });
  res.cookies.set('userId', user._id.toString());
  res.cookies.set('userRole', user.role);
  return res;
}
