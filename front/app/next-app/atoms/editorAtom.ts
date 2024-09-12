// atoms/editorAtom.ts
import { atom } from 'jotai';
import { Editor } from "@tiptap/react"; // Import the correct Editor type

export const editorAtom = atom<Editor | null>(null);
