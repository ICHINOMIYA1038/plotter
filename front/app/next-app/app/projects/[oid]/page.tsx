'use client';  // ファイル全体をクライアントコンポーネントとして扱う

import { useEffect, useState } from 'react';
import { getProjectByOid, updateProject } from '@/utils/db/projects'; // プロジェクト名の更新関数をインポート
import { createClient } from '@/utils/supabase/client';
import EditorMain from '@/app/components/EditorMain';
import { AiOutlineEdit } from 'react-icons/ai'; // 編集アイコンを追加
import Sidebar from '@/app/components/Sidebar';
import { TOC } from '@/app/components/Toc';
import { useAtom } from 'jotai';
import { editorAtom } from '@/atoms/editorAtom';
import { selectionNodeAtom } from '@/atoms/selectionNodeAtom';

interface ProjectDetailPageProps {
  params: { oid: string };
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const [project, setProject] = useState<any>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await getProjectByOid(params.oid);
        setProject(response);
      } catch (error) {
        console.error('プロジェクトの取得に失敗しました:', error);
      }
    };

    fetchProject();
  }, [params.oid]);

  if (!project) return <div>読み込み中・・・</div>;

  return (
    <div className="p-4">
      <EditableProjectName project={project} setProject={setProject} />
      <div className="flex h-screen">
        <div className="flex-1 h-full overflow-auto">
          <ClientSideEditor project={project} />
        </div>
      </div>
    </div>
  );
}

// プロジェクト名を編集可能にするコンポーネント
function EditableProjectName({ project, setProject }: any) {
  const [isEditing, setIsEditing] = useState(false); // 編集状態の管理
  const [projectName, setProjectName] = useState(project.name); // プロジェクト名の管理
  const [isSaving, setIsSaving] = useState(false); // 保存状態の管理

// プロジェクト名の更新処理
const saveProjectName = async () => {
  if (projectName !== project.name) {
    try {
      setIsSaving(true);
      
      // プロジェクト名をオブジェクトとして渡す
      await updateProject(project.oid, { name: projectName }); // オブジェクトで渡すように修正
      
      setProject((prevProject: any) => ({ ...prevProject, name: projectName })); // ローカル状態を更新
    } catch (error) {
      console.error('プロジェクト名の更新に失敗しました:', error);
    } finally {
      setIsSaving(false);
      setIsEditing(false); // 編集モードを終了
    }
  } else {
    setIsEditing(false); // 名前が変更されていなければ編集モードを終了
  }
};

  return (
    <div className="mb-4">
      {isEditing ? (
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            onBlur={saveProjectName} // フォーカスが外れたときに保存
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                saveProjectName(); // Enterキーで保存
              } else if (e.key === 'Escape') {
                setIsEditing(false); // Escキーで編集キャンセル
              }
            }}
            className="border border-gray-300 rounded px-2 py-1 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          {isSaving && <span className="text-sm text-gray-500">保存中...</span>}
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <button
            onClick={() => setIsEditing(true)} // 編集モードに切り替え
            className="text-blue-500 hover:text-blue-700"
          >
            <AiOutlineEdit size={24} /> {/* 編集アイコン */}
          </button>
        </div>
      )}
    </div>
  );
}

function ClientSideEditor({ project }: any) {
  const [content, setContent] = useState<any>(null);
  const [dummy, setDummy] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editor, setEditor] = useAtom(editorAtom);
  const [selectionNode, setSelectionNode] = useAtom(selectionNodeAtom);

  useEffect(() => {
    const fetchJSONFromS3 = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getSession();

      // 正しくアクセストークンを取得
      const token = data.session?.access_token;
    
      if (!token) {
        throw new Error('User is not logged in');
      }
      
      try {
        const response = await fetch(`/api/s3?oid=${project.oid}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // トークンをAuthorizationヘッダーに含める
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const jsonContent = await response.json();
        setContent(jsonContent);
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJSONFromS3();
  }, [project.oid]);

  if (loading) {
    return <div>読み込み中・・・</div>;
  }

  return(<>
  <TOC editor={editor}/>
  <Sidebar editor={editor} node={selectionNode}/>
  <EditorMain project={project} initialContent={content || {}} />
  </>)
  ;
}
