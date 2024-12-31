import { supabase } from '../../lib/supabase';
import { useAuthStore } from './authStore';

export const initializeAuth = async () => {
  const { setUser, setLoading, setError } = useAuthStore.getState();
  
  try {
    setLoading(true);
    
    // Get initial session
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    
    setUser(session?.user ?? null);
    
    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  } catch (error) {
    console.error('Auth initialization error:', error);
    setError(error instanceof Error ? error : new Error('Failed to initialize auth'));
  } finally {
    setLoading(false);
  }
};