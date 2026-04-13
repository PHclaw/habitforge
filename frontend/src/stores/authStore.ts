import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../services/api";

interface User {
  id: number;
  email: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
}

interface AuthState {
  token: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string, fullName?: string) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      login: async (email, password) => {
        const res = await api.post<{ access_token: string }>("/auth/login", { email, password });
        set({ token: res.data.access_token });
        await (useAuthStore.getState() as any).fetchMe();
      },
      register: async (email, username, password, fullName) => {
        const res = await api.post<{ access_token: string }>("/auth/register", {
          email, username, password, full_name: fullName,
        });
        set({ token: res.data.access_token });
        await (useAuthStore.getState() as any).fetchMe();
      },
      logout: () => set({ token: null, user: null }),
      fetchMe: async () => {
        try {
          const res = await api.get<User>("/auth/me");
          set({ user: res.data });
        } catch { /* ignore */ }
      },
    }),
    { name: "habitforge-auth", partialize: (s) => ({ token: s.token }) }
  )
);

export default useAuthStore;
