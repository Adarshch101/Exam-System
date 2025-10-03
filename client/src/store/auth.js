import { create } from 'zustand';

const saved = localStorage.getItem('auth_user');

export const useAuth = create((set) => ({
  user: saved ? JSON.parse(saved) : null,
  login: (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
    set({ user });
  },
  updateUser: (user) => {
    localStorage.setItem('auth_user', JSON.stringify(user));
    set({ user });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('auth_user');
    set({ user: null });
  },
}));
