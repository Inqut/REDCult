import { supabase } from '../../lib/supabase';
import { createProfile } from './profileService';

export const signUp = async (email: string, password: string, username: string) => {
  const { data: auth, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
    },
  });

  if (signUpError) throw signUpError;
  if (!auth.user) throw new Error('Failed to create user');

  try {
    await createProfile(auth.user.id, username);
    return auth;
  } catch (error) {
    // Clean up auth user if profile creation fails
    await supabase.auth.admin.deleteUser(auth.user.id);
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};