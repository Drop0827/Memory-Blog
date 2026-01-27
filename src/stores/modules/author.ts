import { create } from 'zustand';
import { User } from '@/types/app/user';

interface AuthorState {
  // 作者信息
  author: User;
  setAuthor: (data: User) => void;
}

export default create<AuthorState>((set) => ({
  author: {} as User,
  setAuthor: (data: User) => set(() => ({ author: data })),
}));
