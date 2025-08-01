'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const userRole = document.cookie
      .split('; ')
      .find(row => row.startsWith('userRole='))
      ?.split('=')[1];

    if (userRole === 'admin') {
      router.push('/admin/viewusers');
    } else if (userRole === 'employee') {
      router.push('/employee/dashboard');
    } else {
      setCheckingAuth(false);
    }
  }, [router]);

  if (checkingAuth) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        {/* Your login form here */}
      </div>
    </div>
  );
}
