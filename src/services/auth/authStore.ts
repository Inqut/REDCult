import { create } from 'zustand';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: Error | null;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  signOut: async () => {
    try {
      set({ loading: true, error: null });
      
      // Clear Supabase session
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear store state
      set({ user: null });
      
      // Clear any stored auth data
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.clear();
      
      // Redirect to home
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
      set({ error: error instanceof Error ? error : new Error('Failed to sign out') });
    } finally {
      set({ loading: false });
    }
  },
}));