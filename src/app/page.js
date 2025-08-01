'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Spinner from '@/components/Spinner'; // Make sure this path is correct
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginValidationSchema } from '@/utils/validationSchemas';

export default function LoginPage() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginValidationSchema),
  });

  // Check if already authenticated
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

  const onSubmit = async ({ phone }) => {
    setLoading(true);
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone }),
      headers: { 'Content-Type': 'application/json' },
    });

    setLoading(false);
    if (res.ok) {
      const data = await res.json();
      if (data.user.role === 'admin') {
        router.push('/admin/viewusers');
      } else {
        router.push('/employee/dashboard');
      }
    } else {
      alert('Invalid phone number');
    }
  };

  const handleNumericInput = (e) => {
    const onlyNums = e.target.value.replace(/\D/g, '').slice(0, 10);
    setValue('phone', onlyNums);
  };

  if (checkingAuth) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      {/* Dummy Logo */}
      <header className="w-full bg-white shadow p-4 flex justify-center">
        <span className="text-xl font-bold">DummyLogo</span>
      </header>

      <main className="flex flex-1 items-center justify-center w-full">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-8 rounded shadow-md w-96"
        >
          <h1 className="text-2xl font-bold mb-4">Login</h1>

          <input
            {...register('phone')}
            type="text"
            placeholder="Enter Phone Number"
            maxLength="10"
            inputMode="numeric"
            onChange={handleNumericInput}
            className={`w-full border p-2 mb-1 rounded ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          <p className="text-sm text-gray-500 mb-2">
            Please enter your 10-digit mobile number
          </p>
          {errors.phone && (
            <p className="text-red-600 text-sm mb-2">
              {errors.phone.message}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner size="sm" color="white" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>
      </main>
    </div>
  );
}
