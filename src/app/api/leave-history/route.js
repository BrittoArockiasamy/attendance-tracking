import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectDB } from '@/lib/mongo';
import Leave from '@/models/Leave';
import User from '@/models/user';

export async function GET() {

  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await connectDB();

  const user = await User.findById(userId);
  const leaveHistory = await Leave.find({ userId }).sort({ createdAt: -1 });

  const response = leaveHistory.map((leave) => ({
    _id: leave._id,
    name: user.name,
    dates: leave.dates.join(', '),
    reason: leave.reason || '-',
    createdAt: new Date(leave.createdAt).toLocaleDateString(),
  }));

  return NextResponse.json(response);
}
