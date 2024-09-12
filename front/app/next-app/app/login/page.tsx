'use client';

import { useState, useEffect } from 'react';
import { login } from '../../utils/supabase/actions';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useAtom } from 'jotai';
import { userAtom } from '@/atoms/userAtom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false); // チェックボックスの状態
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const router = useRouter();
  const [, setUser] = useAtom(userAtom);

  // セキュリティ向上のため、パスワードを保存しないように変更
  useEffect(() => {
    const savedEmail = localStorage.getItem('savedEmail');
    const rememberMeStatus = localStorage.getItem('rememberMe') === 'true';

    if (savedEmail && rememberMeStatus) {
      setEmail(savedEmail);
      setRememberMe(rememberMeStatus); // チェックボックスをオンに設定
    }
  }, []);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    try {
      const supabase = createClient();
      await login(formData);

      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
        setNotification({ type: 'success', message: 'ログイン成功！' });

        // チェックボックスがオンなら、メールアドレスを保存（パスワードは保存しない）
        if (rememberMe) {
          localStorage.setItem('savedEmail', email);
          localStorage.setItem('rememberMe', 'true');
        } else {
          // チェックボックスがオフの場合は削除
          localStorage.removeItem('savedEmail');
          localStorage.setItem('rememberMe', 'false');
        }

      }
    } catch (error) {
      setNotification({ type: 'error', message: 'ログインに失敗しました！' });
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
      <form onSubmit={handleLogin} className="bg-white p-24 rounded shadow-md">
        <h2 className="text-2xl mb-4">ログイン</h2>
        <label htmlFor="email" className="block mb-2">
          メールアドレス:
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={email} // ステートから自動入力
          onChange={(e) => setEmail(e.target.value)}
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
          value={password} // ステートから自動入力
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        
        {/* チェックボックス */}
        <label htmlFor="rememberMe" className="block mb-4">
          <input
            id="rememberMe"
            type="checkbox"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)} // 状態をトグル
            className="mr-2"
          />
          メールアドレスを記憶する
        </label>

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
