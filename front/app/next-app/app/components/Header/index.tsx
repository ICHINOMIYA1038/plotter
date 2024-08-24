// components/Header.tsx
'use client';
import Link from 'next/link';
import { useAtom } from 'jotai';
import { userAtom } from '@/atoms/userAtom';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

export const Header = () => {
  const [user, setUser] = useAtom<User | null>(userAtom);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      }
    };
    fetchUser();
  }, [setUser]);

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
                        location.reload();
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
