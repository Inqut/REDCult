import { supabase } from '../lib/supabase';

export const signUp = async (email: string, password: string, username: string) => {
  // First sign up the user
  const { data: auth, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username, // Store username in auth metadata
      },
    },
  });

  if (signUpError) throw signUpError;
  if (!auth.user) throw new Error('Failed to create user');

  try {
    // Create the user profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: auth.user.id,
          username,
          created_at: new Date().toISOString(),
        },
      ]);

    if (profileError) throw profileError;

    return auth;
  } catch (error) {
    // If profile creation fails, clean up by deleting the auth user
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

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const createUserProfile = async (userId: string, username: string) => {
  const { error } = await supabase
    .from('profiles')
    .insert([
      {
        id: userId,
        username,
        created_at: new Date().toISOString(),
      },
    ]);

  if (error) throw error;
};