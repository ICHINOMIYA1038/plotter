'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function Profile() {
  const [profile, setProfile] = useState({
    nickname: '',
    organizationName: '',
    membershipPlan: '',
    isTrialUsed: false,
    gender: '',
    ageGroup: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          setErrorMessage('プロフィール情報の取得に失敗しました。');
        } else {
          setProfile(data);
        }
      }
    };

    fetchProfile();
  }, [supabase]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', user.id);

      if (error) {
        setErrorMessage('プロフィールの更新に失敗しました。');
      } else {
        router.push('/home'); // 更新後、ホームにリダイレクト
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">プロフィール設定</h1>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <form onSubmit={handleFormSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium">ニックネーム</label>
          <input
            type="text"
            name="nickname"
            value={profile.nickname}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">団体名</label>
          <input
            type="text"
            name="organizationName"
            value={profile.organizationName}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">会員プラン</label>
          <select
            name="membershipPlan"
            value={profile.membershipPlan}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            required
          >
            <option value="Free">Free</option>
            <option value="Paid">Paid</option>
            <option value="Trial">Trial</option>
            <option value="Withdrawn">Withdrawn</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">トライアル利用済み</label>
          <input
            type="checkbox"
            name="isTrialUsed"
            checked={profile.isTrialUsed}
            onChange={(e) =>
              setProfile((prev) => ({ ...prev, isTrialUsed: e.target.checked }))
            }
            className="mt-1"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">性別</label>
          <input
            type="text"
            name="gender"
            value={profile.gender}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">年齢層</label>
          <select
            name="ageGroup"
            value={profile.ageGroup}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            required
          >
            <option value="teens">10代</option>
            <option value="twenties">20代</option>
            <option value="thirties">30代</option>
            <option value="forties">40代</option>
            <option value="fifties">50代</option>
            <option value="sixties_plus">60代以上</option>
            <option value="unknown">秘密</option>
          </select>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            保存
          </button>
        </div>
      </form>
    </div>
  );
}
