import { atom } from 'jotai';

export interface Project {
    id: string;
    oid: string;
    name: string;
    description: string;
    createdAt: string; 
  }
  
  export const projectsAtom = atom<Project[]>([]);