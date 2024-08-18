// atoms/userAtom.ts
import { User } from '@supabase/supabase-js';
import { atom } from 'recoil';

export const userState = atom<User | null>({
  key: 'userState',
  default: null,
});
