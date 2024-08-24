'use client';

import { useAtom } from 'jotai';
import { fetchUserProjects, createProject } from '@/utils/db/projects';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { projectsAtom, Project } from '@/atoms/projectAtom';

const Home = () => {
  const [projects, setProjects] = useAtom(projectsAtom);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchUserProjects();
      setProjects(data);
    };
    fetchData();
  }, []);

  const handleCreateProject = async () => {
    const newProject = await createProject('New Project', 'Project description');
    setProjects([newProject, ...projects]); // 作成したプロジェクトをリストの先頭に追加
    router.push(`/projects/${newProject.oid}`); // 作成したプロジェクトの詳細ページに遷移
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      <button
        onClick={handleCreateProject}
        className="bg-gray-200 text-gray-800 rounded p-4 shadow flex items-center justify-center"
      >
        新規プロジェクト
      </button>
      {projects.map((project) => (
        <button
          key={project.oid}
          onClick={() => router.push(`/projects/${project.oid}`)}
          className="bg-gray-200 text-gray-800 rounded p-4 shadow"
        >
          {project.name}
        </button>
      ))}
    </div>
  );
};

export default Home;
