import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();

  // Clear userId and userRole cookies
  cookieStore.set('userId', '', { maxAge: 0 });
  cookieStore.set('userRole', '', { maxAge: 0 });

  return NextResponse.json({ success: true });


  // const response = NextResponse.redirect('/');

  // // Remove cookies
  // response.cookies.set('userId', '', { path: '/', maxAge: 0 });
  // response.cookies.set('userRole', '', { path: '/', maxAge: 0 });

  // return response;
}
