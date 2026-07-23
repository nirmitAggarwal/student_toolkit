import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,

      isAuthenticated: false,
      isLoading: true,

      setUser: (user, token) => {
        Cookies.set("token", token, {
          expires: 7,
          secure: true,
          sameSite: "Lax",
        });

        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        Cookies.remove("token");

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      restoreSession: () => {
        const token = Cookies.get("token");

        if (token) {
          set({
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          set({
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    },
  ),
);
