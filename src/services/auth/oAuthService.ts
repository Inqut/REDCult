import { supabase } from '../../lib/supabase';
import { createProfile, profileExists } from './profileService';

const handleOAuthProfile = async (userId: string, metadata: any) => {
  const exists = await profileExists(userId);
  if (!exists) {
    // Create profile using OAuth metadata
    await createProfile(userId, metadata.user_name || metadata.email.split('@')[0]);
  }
};

export const handleAuthCallback = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) throw error;
  if (!session?.user) throw new Error('No user in session');

  // Handle profile creation/verification
  await handleOAuthProfile(session.user.id, session.user.user_metadata);
  
  return session;
};

export const getAuthRedirectUrl = (provider: 'google' | 'twitter', returnTo?: string) => {
  const baseUrl = `${window.location.origin}/auth/callback`;
  const redirectTo = returnTo ? `${baseUrl}?returnTo=${encodeURIComponent(returnTo)}` : baseUrl;
  
  return {
    redirectTo,
    scopes: provider === 'google' ? 'profile email' : undefined,
  };
};