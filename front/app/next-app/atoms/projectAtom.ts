import { atom } from 'jotai';

export interface Project {
    oid: string;
    user_id: string;
    name: string;
    description: string;
    createdat: string; 
  }
  
  export const projectsAtom = atom<Project[]>([]);
