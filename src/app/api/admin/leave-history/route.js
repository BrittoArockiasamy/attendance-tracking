import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {connectDB} from '@/lib/mongo';
import Leave from '@/models/Leave';
import User from '@/models/user';


export async function GET(req) {
  
  const cookieStore = await cookies();
  const userRole = cookieStore.get('userRole')?.value;

  if (userRole !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  const { searchParams } = new URL(req.url);
  const teamFilter = searchParams.get('team');

  const userQuery = teamFilter ? { team: teamFilter } : {};
  const users = await User.find(userQuery);
  const userIds = users.map(user => user._id);

  const leaves = await Leave.find({ userId: { $in: userIds } }).populate('userId');

  // Group by phone
  const grouped = {};
  leaves.forEach((leave) => {
    const { phone, email, name, team } = leave.userId;
    if (!grouped[phone]) {
      grouped[phone] = {
        phone,
        email,
        name,
        team,
        dates: [],
        reason: leave.reason || '-',
      };
    }
    grouped[phone].dates.push(...leave.dates);
  });

  const response = Object.values(grouped).map(user => ({
    ...user,
    dates: user.dates.join(', '),
  }));

  return NextResponse.json(response);
}
