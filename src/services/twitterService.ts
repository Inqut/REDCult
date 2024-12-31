import { supabase } from '../lib/supabase';
import { TwitterProfile } from '../types/cult';

export const signInWithTwitter = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'twitter',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) throw error;
  return data;
};

export const importFromTwitter = async (handle: string): Promise<TwitterProfile> => {
  // First check if we have a valid Twitter session
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.provider_token) {
    throw new Error('No Twitter authentication found');
  }

  // Make authenticated request to Twitter API
  const response = await fetch(`https://api.twitter.com/2/users/by/username/${handle}?user.fields=description,profile_image_url,public_metrics`, {
    headers: {
      'Authorization': `Bearer ${session.provider_token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Twitter profile');
  }

  const data = await response.json();
  
  return {
    handle: data.data.username,
    name: data.data.name,
    bio: data.data.description,
    avatarUrl: data.data.profile_image_url,
    followers: data.data.public_metrics.followers_count,
  };
};