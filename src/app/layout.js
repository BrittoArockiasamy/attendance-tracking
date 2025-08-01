


// 'use client';

// import Link from 'next/link';
// import { usePathname, useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import './globals.css';

// export default function RootLayout({ children }) {
//   const pathname = usePathname();
//   const router = useRouter();
//   const [role, setRole] = useState('');

//   useEffect(() => {
//     const userRole = document.cookie
//       .split('; ')
//       .find(row => row.startsWith('userRole='))
//       ?.split('=')[1];
//     setRole(userRole);
//   }, []);

//   const handleLogout = async () => {
//     await fetch('/api/auth/logout', { method: 'POST' });
//     router.push('/');
//   };

//   return (
//     <html lang="en">
//       <body className="min-h-screen bg-gray-50">
//         <header className="bg-blue-600 text-white flex justify-between items-center p-4">
//           <div className="font-bold text-lg">DummyLogo</div>
//           <nav className="flex gap-6">
//             {role === 'admin' && (
//               <>
//                 <Link href="/admin/dashboard">View Users</Link>
//                 <Link href="/admin/leaves">View Leaves</Link>
//               </>
//             )}
//             {role === 'employee' && (
//               <>
//                 <Link href="/employee/dashboard">Apply Leave</Link>
//                 <Link href="/employee/history">My Leave History</Link>
//               </>
//             )}
//           </nav>
//           <button
//             onClick={handleLogout}
//             className="bg-red-500 text-white px-4 py-2 rounded"
//           >
//             Logout
//           </button>
//         </header>

//         <main className="p-6">{children}</main>
//       </body>
//     </html>
//   );
// }

// import './globals.css';
// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body className="min-h-screen bg-gray-50">{children}</body>
//     </html>
//   );
// }

import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  );
}



// import './globals.css';

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body className="min-h-screen bg-gray-50">
//         {children}
//       </body>
//     </html>
//   );
// }
