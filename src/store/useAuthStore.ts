'use client';
// ============================================================
// Auth Store — Zustand
// ============================================================
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import { supabase } from '@/lib/supabase';

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => void;
  clearError: () => void;
}

export interface SignupData {
  email: string;
  password: string;
  full_name: string;
  phone: string;
  college_id: string;
  role: User['role'];
  vehicle_type: User['vehicle_type'];
  vehicle_number: string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const cleanEmail = (email || '').trim().toLowerCase();
          const { data, error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
          if (error || !data?.user) {
            set({ isLoading: false, error: error?.message || 'Login failed. Check your email or password.' });
            return false;
          }
          set({ currentUser: data.user as User, isAuthenticated: true, isLoading: false });
          return true;
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'An unexpected error occurred during login.';
          set({ isLoading: false, error: message });
          return false;
        }
      },

      signup: async (formData) => {
        set({ isLoading: true, error: null });
        try {
          const cleanEmail = (formData.email || '').trim().toLowerCase();
          const { data, error } = await supabase.auth.signUp({
            email: cleanEmail,
            password: formData.password,
            options: {
              data: {
                full_name: (formData.full_name || '').trim(),
                phone: (formData.phone || '').trim(),
                college_id: (formData.college_id || '').trim(),
                role: formData.role,
                vehicle_type: formData.vehicle_type,
                vehicle_number: formData.vehicle_number ? formData.vehicle_number.trim().toUpperCase() : null,
              },
            },
          });
          if (error || !data?.user) {
            set({ isLoading: false, error: error?.message || 'Signup failed. Please try again.' });
            return false;
          }
          set({ currentUser: data.user as User, isAuthenticated: true, isLoading: false });
          return true;
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'An unexpected error occurred during signup.';
          set({ isLoading: false, error: message });
          return false;
        }
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({ currentUser: null, isAuthenticated: false });
      },

      updateProfile: (updates) => {
        const current = get().currentUser;
        if (current) {
          set({ currentUser: { ...current, ...updates } });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'campus-ride-auth',
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
