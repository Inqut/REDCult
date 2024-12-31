import { supabase } from '../lib/supabase';
import { CultProfile, CultType } from '../types/cult';
import { profileExists } from './auth/profileService';

interface CreateCultData {
  type: CultType;
  name: string;
  bio: string;
  twitterHandle?: string;
  avatarUrl?: string;
}

export const createCult = async (data: CreateCultData): Promise<CultProfile> => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error('You must be logged in to create a cult');
  }

  // Verify profile exists before creating cult
  const hasProfile = await profileExists(user.id);
  if (!hasProfile) {
    throw new Error('Please complete your profile before creating a cult');
  }

  const { data: cult, error } = await supabase
    .from('cults')
    .insert([
      {
        creator_id: user.id,
        type: data.type,
        name: data.name,
        bio: data.bio,
        twitter_handle: data.twitterHandle,
        avatar_url: data.avatarUrl,
        hierarchy: {
          agents: [],
          developers: [],
        },
        stats: {
          followers: 0,
          engagement: 0,
          reputation: 0,
        },
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Cult creation error:', error);
    throw new Error(error.message);
  }

  if (!cult) {
    throw new Error('Failed to create cult');
  }

  return cult;
};