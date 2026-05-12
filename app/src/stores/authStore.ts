"use client";

import { create } from "zustand";
import type { User } from "@/services/auth";
import * as authService from "@/services/auth";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;

  // Actions
  checkSession: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName?: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,

  checkSession: async () => {
    set({ loading: true, error: null });
    try {
      const user = await authService.getMe();
      set({ user, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const user = await authService.login(email, password);
      set({ user, loading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed";
      set({ error: message, loading: false });
      throw err;
    }
  },

  register: async (email, password, displayName) => {
    set({ loading: true, error: null });
    try {
      const user = await authService.register(email, password, displayName);
      set({ user, loading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed";
      set({ error: message, loading: false });
      throw err;
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } finally {
      set({ user: null, loading: false, error: null });
    }
  },

  clearError: () => set({ error: null }),
}));
