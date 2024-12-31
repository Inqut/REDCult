import { supabase } from '../../lib/supabase';
import { createProfile, profileExists } from './profileService';
import { AUTH_ERRORS } from './constants';

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Verify profile exists
    const hasProfile = await profileExists(data.user.id);
    if (!hasProfile) {
      throw new Error(AUTH_ERRORS.PROFILE_REQUIRED);
    }

    return data;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error instanceof Error ? error : new Error('Failed to sign in');
  }
};

export const signUp = async (email: string, password: string, username: string) => {
  try {
    // First check if username is available
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username)
      .maybeSingle();

    if (existingProfile) {
      throw new Error('Username already taken');
    }

    // Create auth user
    const { data: auth, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });

    if (signUpError) {
      if (signUpError.message.includes('already registered')) {
        throw new Error('Email already registered');
      }
      throw signUpError;
    }

    if (!auth.user) throw new Error('Failed to create user');

    // Create profile
    await createProfile(auth.user.id, username);

    return auth;
  } catch (error) {
    console.error('Sign up error:', error);
    throw error instanceof Error ? error : new Error('Failed to sign up');
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    // Clear any local storage or state
    localStorage.removeItem('supabase.auth.token');
    
    // Force reload to clear all state
    window.location.href = '/';
  } catch (error) {
    console.error('Sign out error:', error);
    throw error instanceof Error ? error : new Error('Failed to sign out');
  }
};