'use client';  // ファイル全体をクライアントコンポーネントとして扱う

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { getProjectByOid } from '@/utils/db/projects';
import { createClient } from '@/utils/supabase/client';

const Editor = dynamic(() => import('@/app/components/Editor'), { ssr: false });

interface ProjectDetailPageProps {
  params: { oid: string };
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const [project, setProject] = useState<any>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        console.log(params.oid);
        const response = await getProjectByOid(params.oid);
        setProject(response);
      } catch (error) {
        console.error('プロジェクトの取得に失敗しました:', error);
      }
    };

    fetchProject();
  }, [params.oid]);

  if (!project) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{project.name}</h1>
      <ClientSideEditor oid={project.oid} />
    </div>
  );
}

function ClientSideEditor({ oid }: { oid: any }) {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
        const response = await fetch(`/api/s3?oid=${oid}`, {
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
  }, [oid]);

  if (loading) {
    return <div>Loading editor content...</div>;
  }

  return <Editor initialContent={content || {}} />;
}
