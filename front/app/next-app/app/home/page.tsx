'use client';

import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { projectsAtom, Project } from '@/atoms/projectAtom';
import { fetchProjects } from '@/utils/db/projects';

export default function HomePage() {
  const [projects, setProjects] = useAtom(projectsAtom);

  useEffect(() => {
    async function loadProjects() {
      console.log('Loading projects...'); // 追加
      try {
        const fetchedProjects = await fetchProjects();
        setProjects(fetchedProjects);
      } catch (error) {
        console.error(error);
      }
    }
    loadProjects();
  }, [setProjects]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">最近作成したプロジェクト</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {projects.map((project: Project) => (
          <div
            key={project.id}
            className="bg-white p-4 rounded shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
            <p className="text-gray-600 mb-4">{project.description}</p>
            <p className="text-gray-400 text-sm">作成日: {new Date(project.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
