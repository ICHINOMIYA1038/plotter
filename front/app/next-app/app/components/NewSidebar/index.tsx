"use client";

import { userAtom } from '@/atoms/userAtom';
import { fetchUserProjects } from '@/utils/db/projects';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { useAtom } from 'jotai';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

export default function NewSidebar({ editor, project }: any) {
  const [isOpen, setIsOpen] = useState(true); // サイドバーの初期状態を開いた状態に
  const [activeSection, setActiveSection] = useState<string | null>(null); // アクティブなセクションの状態
  const [projectList, setProjectList] = useState([]); // プロジェクトリストの状態
  const [user, setUser] = useAtom<User | null>(userAtom); // ユーザーの状態
  const [isTransitioning, setIsTransitioning] = useState(false); // アニメーション中の状態

  const toggleSidebar = () => {
    setIsTransitioning(true);
    if (isOpen) {
      setActiveSection(null); // メインサイドバーが閉じるとき、サブサイドバーも閉じる
    }
    setIsOpen(!isOpen);
  };

  const handleTransitionEnd = () => {
    setIsTransitioning(false); // アニメーション終了後にコンテンツを表示
  };

  const toggleSection = (section: 'output' | 'input' | 'projects') => {
    setActiveSection((prevState) => (prevState === section ? null : section)); // クリックしたセクションのみ開き、他を閉じる
  };

  const saveProjectData = () => {
    console.log('Project data saved to DB:', project);
  };

  // ユーザー情報を取得するためのエフェクト
  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      }
    };
    fetchUser();
  }, [setUser]);

  // プロジェクトリストを取得するためのエフェクト
  useEffect(() => {
    const loadProjects = async () => {
      const projects: any = await fetchUserProjects();
      setProjectList(projects); // 取得したプロジェクトリストを状態に設定
    };

    loadProjects();
  }, []);

  return (
    <div className="relative flex">
      {/* メインサイドバー */}
      <div
        className={`fixed left-0 top-0 h-full z-50 ${isOpen ? 'w-72' : 'w-16'} transition-all duration-300 bg-gray-800 text-white`}
        onTransitionEnd={handleTransitionEnd}
      >
        <button className="p-2" onClick={toggleSidebar}>
          {isOpen ? '←' : '→'}
        </button>
        {!isTransitioning && isOpen && (
          <div className="p-4 space-y-4 flex flex-col justify-between h-full">
            <div>
              {/* ログアウトボタンを上に配置 */}
              {user && (
                <div className="mb-6">
                  <button
                    onClick={async () => {
                      const supabase = createClient();
                      const { error } = await supabase.auth.signOut();
                      if (!error) {
                        setUser(null);
                        location.reload();
                      }
                    }}
                    className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:-translate-y-1"
                  >
                    ログアウト
                  </button>
                </div>
              )}

              {/* ログインしていない場合 */}
              {!user ? (
                <div className="space-y-6">
                  {/* ログインボタン */}
                  <Link href="/login">
                    <a className="block w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-transform transform hover:-translate-y-1">
                      ログイン
                    </a>
                  </Link>
                  {/* 新規登録ボタン */}
                  <Link href="/signup">
                    <a className="block w-full bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:-translate-y-1">
                      新規登録
                    </a>
                  </Link>
                  {/* プランリンク */}
                  <Link href="/plan">
                    <a className="block w-full text-left text-white hover:underline transition-transform transform hover:-translate-y-1 py-2">
                      プラン
                    </a>
                  </Link>
                  {/* ヘルプリンク */}
                  <Link href="/help">
                    <a className="block w-full text-left text-white hover:underline transition-transform transform hover:-translate-y-1 py-2">
                      ヘルプ
                    </a>
                  </Link>
                </div>
              ) : (
                <>
                  {/* ログインしている場合 */}
                  <div className="mb-4">
                    <p className="mb-2">ようこそ、{user.email}さん</p>
                  </div>

                  {/* ホームボタン */}
                  <button className="w-full text-left py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-transform transform hover:-translate-y-1">
                    ホーム
                  </button>

                  {/* プロジェクト一覧 */}
                  <div>
                    <button
                      className="w-full text-left py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-transform transform hover:-translate-y-1"
                      onClick={() => toggleSection('projects')}
                    >
                      プロジェクト一覧
                    </button>
                  </div>

                  {/* 出力セクション */}
                  <div>
                    <button
                      className="w-full text-left py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-transform transform hover:-translate-y-1"
                      onClick={() => toggleSection('output')}
                    >
                      出力
                    </button>
                  </div>

                  {/* 入力セクション */}
                  <div>
                    <button
                      className="w-full text-left py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-transform transform hover:-translate-y-1"
                      onClick={() => toggleSection('input')}
                    >
                      入力
                    </button>
                  </div>

                  {/* 設定セクション */}
                  <button className="w-full text-left py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-transform transform hover:-translate-y-1">
                    設定
                  </button>

                  {/* プロフィールセクション */}
                  <button className="w-full text-left py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-transform transform hover:-translate-y-1">
                    プロフィール
                  </button>

                  {/* 保存ボタン */}
                  <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:-translate-y-1 mt-4">
                    プロジェクトを保存
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* メインコンテンツの左マージンを動的に調整 */}
      <div className={`flex-1 transition-all duration-300 ${isOpen ? 'ml-72' : 'ml-16'} `}>
        {/* サブサイドバー */}
        {activeSection === 'projects' && (
          <div className="fixed left-72 top-0 h-full w-80 bg-gray-700 text-white p-4 z-50">
            <button className="absolute top-2 right-2 text-xl" onClick={() => toggleSection('projects')}>
              ×
            </button>
            <h3 className="text-lg font-semibold">プロジェクト一覧</h3>
            <ul>
              {projectList.map((proj: any, index: number) => (
                <li key={index} className="border-b border-gray-600 py-2">
                  <Link href={`/projects/${proj.oid}`}>
                    <a className="hover:underline transition-transform transform hover:-translate-y-1">{proj.name}</a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeSection === 'output' && (
          <div className="fixed left-72 top-0 h-full w-80 bg-gray-700 text-white p-4 z-50">
            <button className="absolute top-2 right-2 text-xl" onClick={() => toggleSection('output')}>
              ×
            </button>
            <h3 className="text-lg font-semibold">出力オプション</h3>
            {/* ここに出力メニューや編集機能を追加 */}
            <p>出力オプションを表示</p>
          </div>
        )}

        {activeSection === 'input' && (
          <div className="fixed left-72 top-0 h-full w-80 bg-gray-700 text-white p-4 z-50">
            <button className="absolute top-2 right-2 text-xl" onClick={() => toggleSection('input')}>
              ×
            </button>
            <h3 className="text-lg font-semibold">入力オプション</h3>
            {/* ここに入力メニューや編集機能を追加 */}
            <p>入力オプションを表示</p>
          </div>
        )}
      </div>
    </div>
  );
}
