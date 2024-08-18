'use client';

import { useEffect, useState } from 'react';
import { getProjectByOid } from '@/utils/db/projects';
import Editor from "@/app/components/Editor";

export default function ProjectDetailPage({ params }: { params: { oid: string } }) {
  const [project, setProject] = useState<any>(null);
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProjectByOid(params.oid);
      setProject(data);
    };
    fetchData();
  }, [params.oid]);

  if (!project) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{project.name}</h1>
      <Editor setContent={setContent}/>
    </div>
  );
}
