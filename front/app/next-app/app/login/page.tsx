'use client';

import { useState } from 'react';
import { login } from '../../utils/supabase/actions'
import Link from 'next/link';

export default function LoginPage() {
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    try {
      await login(formData);
      setNotification({ type: 'success', message: 'Login successful!' });
    } catch (error) {
      setNotification({ type: 'error', message: 'Login failed!' });
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
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl mb-4">ログイン</h2>
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
          ログイン
        </button>
      </form>
      <div className="mt-4">
        <Link href="/signup" className="text-blue-500 hover:underline">
         新規登録はこちら
        </Link>
      </div>
    </div>
  );
}
