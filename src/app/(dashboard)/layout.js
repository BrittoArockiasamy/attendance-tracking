import '../globals.css';
import Link from 'next/link';
import { cookies } from 'next/headers';
import LogoutButton from '@/components/LogoutButton'

export default async function DashboardLayout({ children }) {
  const cookieStore = await cookies();
  const userRole = cookieStore.get('userRole')?.value;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white flex justify-between items-center p-4">
        <div className="font-bold text-lg">DummyLogo</div>

        <nav className="flex gap-6">
          {userRole === 'admin' && (
            <>
              <Link href="/admin/viewusers">View Users</Link>
              <Link href="/admin/leaves">Admin Leaves</Link>
            </>
          )}
          {userRole === 'employee' && (
            <>
              <Link href="/employee/addleave">Apply Leave</Link>
              <Link href="/employee/dashboard">My Leave History</Link>
            </>
          )}
        </nav>

        {/* <form action="/api/auth/logout" method="POST">
          <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer">
            Logout
          </button>
        </form> */}
        <LogoutButton />
      </header>

      <main className="p-6">{children}</main>
    </div>
  );
}
