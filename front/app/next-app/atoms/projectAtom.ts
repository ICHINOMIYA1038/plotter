import { atom } from 'jotai';

export interface Project {
    id: string;
    name: string;
    description: string;
    createdAt: string; 
  }
  
  export const projectsAtom = atom<Project[]>([]);