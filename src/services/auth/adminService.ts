import { supabase } from '../../lib/supabase';

export const createAdminUser = async (email: string, password: string) => {
  try {
    const { data: auth, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: 'admin',
          is_admin: true
        }
      }
    });

    if (signUpError) {
      if (signUpError.message.includes('already registered')) {
        // If admin exists, just return
        return null;
      }
      throw signUpError;
    }

    if (!auth?.user) throw new Error('Failed to create admin user');

    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: auth.user.id,
        username: 'admin',
        role: 'admin',
        created_at: new Date().toISOString()
      });

    if (profileError) throw profileError;

    return auth;
  } catch (error) {
    console.error('Failed to create admin:', error);
    throw error;
  }
};

export const isAdmin = async (userId: string): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.user_metadata?.is_admin === true;
};