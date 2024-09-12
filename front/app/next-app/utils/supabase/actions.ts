'use server';
import { createClient as createAdminClient } from '@supabase/supabase-js'

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';

async function CreateUserProfile(supabase: any, userId: string, email?:string) {
  // プロフィールが存在しない場合、新しいレコードを作成
    const { data:profile, error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email: email, // ユーザーのメールアドレスを挿入
        nickname: '', // デフォルトのニックネームは空にする（必要に応じて変更）
        organization_name: '', // デフォルトの団体名なども必要に応じて追加
        membership_plan: 'Free', // デフォルトの会員プラン
        is_trial_used: false,
        gender: '',
        age_group: 'unknown', // デフォルト値
      });

    if (insertError) {
      throw new Error('プロフィールの作成中にエラーが発生しました。');
    }

  return profile;
}
async function checkEmailExists(email: string) {
  const supabase = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SU_SERVICE_ROLE!);

  const { data, error } = await supabase.auth.admin.listUsers();

  if (error) {
    return { isEmailExist: false, isEmailConfirmed: false };
  }

  // Find the user with the matching email address
  const user = data.users.find((user) => user.email === email);

  if (!user) {
    // Return if the user with the email does not exist
    return { isEmailExist: false, isEmailConfirmed: false };
  }

  console.log(user)

  // すでにemail認証もしている場合にはuser_metaデータがないのでそれで区別する
  const isEmailConfirmed = !!user.email_confirmed_at;

  return { isEmailExist: true, isEmailConfirmed };
}

export async function login(formData: FormData) {
  const supabase = createClient();

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { data: signInData, error } = await supabase.auth.signInWithPassword(data);

  console.log(signInData)

  if (error) {
    console.error(error);
    return {error: "ログインに失敗しました。"}
  }

  const userId = signInData.user?.id;

  if (!userId) {
    return {error: "ユーザーIDが存在しません。"}
  }
    revalidatePath('/home');
    return redirect('/home'); 
}

export async function signup(formData: FormData) {
  const supabase = createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const {isEmailExist, isEmailConfirmed} = await checkEmailExists(email)

    // hasUserMetaDataがあるということはメール認証が必要
  if (isEmailExist && !isEmailConfirmed) {
    const { data: signUpData, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return {success: "確認用のメールを再送しました。"}
  }

  // hasUserMetaDataがないということはすでに登録されたデータ
  if (isEmailExist && isEmailConfirmed) {
    return {error: "このメールアドレスは既に登録されています。"}
  }

  const { data: signUpData, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error(error);
    return {error:`新規登録に失敗しました。時間をあけてお試しください。`};
  }

  return {success:'確認用のメールを送信しました。メールをご確認ください。'};
}
