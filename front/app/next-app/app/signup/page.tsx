'use client';

import { useState } from 'react';
import { signup } from '../../utils/supabase/actions'
import Link from 'next/link';

export default function SignupPage() {
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    try {
      await signup(formData);
      setNotification({ type: 'success', message: 'Signup successful!' });
    } catch (error) {
      setNotification({ type: 'error', message: 'Signup failed!' });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {notification && (
        <div
          className={`p-4 mb-4 text-sm ${
            notification.type === 'success' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
          }`}
        >
          {notification.message}
        </div>
      )}
      <form onSubmit={handleSignup} className="bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl mb-4">新規登録</h2>
        <label htmlFor="email" className="block mb-2">
          メールアドレス:
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <label htmlFor="password" className="block mb-2">
          パスワード:
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
          新規登録
        </button>
      </form>
      <div className="mt-4">
        <Link href="/login" className="text-blue-500 hover:underline">
          ログインはこちら
        </Link>
      </div>
    </div>
  );
}
