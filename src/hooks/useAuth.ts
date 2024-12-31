import { useAuthStore } from '../services/auth/authStore';
import { signIn, signUp } from '../services/auth/authService';

export const useAuth = () => {
  const { user, loading, error, signOut } = useAuthStore();

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut
  };
};