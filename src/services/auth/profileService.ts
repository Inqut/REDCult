import { supabase } from '../../lib/supabase';

export const createProfile = async (userId: string, username: string) => {
  const { error } = await supabase
    .from('profiles')
    .insert([{
      id: userId,
      username,
      created_at: new Date().toISOString(),
    }]);

  if (error) throw error;
};

export const profileExists = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  } catch (error) {
    console.error('Error checking profile:', error);
    return false;
  }
};