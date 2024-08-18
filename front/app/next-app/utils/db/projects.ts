import { createClient } from '../supabase/client'; // Supabaseクライアントを作成

export async function fetchProjects() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('projects') 
    .select('*')

  if (error) {
    throw new Error('プロジェクトの取得に失敗しました。');
  }
  console.log('Fetched projects:', data); // 追加

  return data;
}
