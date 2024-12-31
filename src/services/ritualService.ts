import { supabase } from '../lib/supabase';
import type { Ritual, RitualParticipant } from '../types/ritual';

export const createRitual = async (ritual: Omit<Ritual, 'id' | 'createdAt' | 'updatedAt'>) => {
  const { data, error } = await supabase
    .from('rituals')
    .insert([{
      cult_id: ritual.cultId,
      name: ritual.name,
      description: ritual.description,
      type: ritual.type,
      requirements: ritual.requirements,
      rewards: ritual.rewards,
      start_time: ritual.startTime,
      end_time: ritual.endTime,
      min_participants: ritual.minParticipants,
      max_participants: ritual.maxParticipants,
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const joinRitual = async (ritualId: string) => {
  const { data, error } = await supabase
    .from('ritual_participants')
    .insert([{
      ritual_id: ritualId,
      user_id: (await supabase.auth.getUser()).data.user?.id,
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateProgress = async (
  ritualId: string, 
  progress: Record<string, any>
) => {
  const { error } = await supabase
    .rpc('update_ritual_progress', {
      ritual_id: ritualId,
      user_id: (await supabase.auth.getUser()).data.user?.id,
      progress_update: progress,
    });

  if (error) throw error;
};

export const listRituals = async (cultId: string) => {
  const { data, error } = await supabase
    .from('rituals')
    .select(`
      *,
      ritual_participants (
        user_id,
        status,
        progress
      )
    `)
    .eq('cult_id', cultId)
    .order('start_time', { ascending: false });

  if (error) throw error;
  return data;
};