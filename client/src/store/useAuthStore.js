import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setUser: (user, token) =>
        set(() => {
          Cookies.set('token', token, { expires: 7, secure: true, sameSite: 'Lax' });
          return { user, token, isAuthenticated: !!user };
        }),

      logout: () =>
        set(() => {
          Cookies.remove('token');
          return { user: null, token: null, isAuthenticated: false };
        }),

      restoreSession: () => {
        const token = Cookies.get('token');
        const state = get();
        if (token && state.user) {
          set({ isAuthenticated: true });
          return;
        }
        if (token) {
          set({ token, isAuthenticated: true });
          return;
        }
        set({ token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);
