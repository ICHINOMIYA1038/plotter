'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { userState } from '@/atoms/userAtom';
import { createClient } from '@/utils/supabase/client';

export const Header = () => {
  const [user, setUser] = useRecoilState(userState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error('Error fetching user:', error);
        }

        console.log('Fetched user data:', data);

        if (data?.user) {
          setUser(data.user);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [setUser]);

  if (loading) {
    return (
      <header className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/">
            <a className="text-2xl font-bold">戯曲エディタ</a>
          </Link>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <span>読み込み中...</span>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <a className="text-2xl font-bold">戯曲エディタ</a>
        </Link>
        <nav>
          <ul className="flex space-x-4">
            {user ? (
              <>
                <li>
                  <span>ようこそ、{user.email}さん</span>
                </li>
                <li>
                  <button
                    onClick={async () => {
                      const supabase = createClient();
                      const { error } = await supabase.auth.signOut();
                      if (!error) {
                        setUser(null);
                      }
                    }}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    ログアウト
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/login">
                    <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                      ログイン
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/signup">
                    <a className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                      新規登録
                    </a>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};
