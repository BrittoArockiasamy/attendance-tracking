import { connectDB } from '@/lib/mongo';
import User from '@/models/user';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const data = await req.json();

  await connectDB();

  try {
    const existingUser = await User.findOne({ phone: data.phone });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const newUser = await User.create(data);
    return NextResponse.json({ success: true, user: newUser });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

export async function GET() {
  await connectDB();
  const users = await User.find();
  return NextResponse.json(users);
}

// Delete User
export async function DELETE(req) {
  const { id } = await req.json();
  await connectDB();
  await User.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}

// Update User

export async function PUT(req) {
  const { id, name, phone, email, team, role } = await req.json();
  await connectDB();
  await User.findByIdAndUpdate(
    id,
    { name, phone, email, team, role },
    { new: true, runValidators: true }
  );
  return NextResponse.json({ success: true });
}
