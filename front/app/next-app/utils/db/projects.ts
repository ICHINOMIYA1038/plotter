import { createClient } from '../supabase/client'; // Supabaseクライアントを作成

export async function fetchProjects() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('createdat', { ascending: false });
  
    if (error) {
      throw new Error('プロジェクトの取得に失敗しました。');
    }
  
    return data || [];
  }

  export async function updateProject(oid: string, updates: { name?: string; description?: string }) {
    const supabase = createClient();
  
    const { data: userData, error: authError } = await supabase.auth.getUser();
    
    if (authError || !userData?.user) {
      throw new Error('ユーザーが認証されていません');
    }
  
    const { data, error } = await supabase
      .from('projects')
      .update(updates) // 更新するフィールドを動的に指定
      .eq('oid', oid) // 指定された oid のプロジェクトをターゲットにする
      .eq('user_id', userData.user.id) // 自分のプロジェクトであることを確認
      .select();
  
    if (error) {
      console.error('Error updating project:', error);
      throw new Error('プロジェクトの更新に失敗しました。');
    }
    return data[0];
  }
  

  export async function fetchUserProjects() {
    const supabase = createClient();
    
    // Promiseをawaitで解決する
    const { data: userData, error: authError } = await supabase.auth.getUser();
    
    if (authError || !userData?.user) {
      throw new Error('ユーザーが認証されていません');
    }
  
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userData.user.id);
  
    if (error) {
      console.error('Error:', error);
      throw new Error('プロジェクトの取得に失敗しました。');
    }
  
    return data;
  }  
  
  export async function createProject(name: string, description: string) {
    const supabase = createClient();
    
    const { data: userData, error: authError } = await supabase.auth.getUser();
  
    if (authError || !userData?.user) {
      throw new Error('ユーザーが認証されていません');
    }
  
    // Declare user_id outside the if-else block
    const user_id = userData.user.id;
  
    const { data, error } = await supabase
      .from('projects')
      .insert([{ name, description, user_id }])
      .select();
  
    if (error) {
      console.error('Error:', error);
      throw new Error('プロジェクトの作成に失敗しました。');
    }
  
    return data[0];
  }
  
  export async function fetchProjectById(id: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
  
    if (error) {
      throw new Error('プロジェクトの取得に失敗しました。');
    }
  
    return data;
  }
  
  export async function getProjectByOid(oid: string) {
    const supabase = createClient();
  
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('oid', oid)
      .single();
  
    if (error) {
      console.error('Error:', error);
      throw new Error('プロジェクトの取得に失敗しました。');
    }
  
    return data;
  }
  