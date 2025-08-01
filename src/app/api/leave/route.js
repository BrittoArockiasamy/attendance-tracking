import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongo';
import Leave from '@/models/Leave';

export async function POST(req) {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { dates, reason } = await req.json();
  await connectDB();

  const newLeave = await Leave.create({ userId, dates, reason });
  return NextResponse.json({ success: true, leave: newLeave });
}
