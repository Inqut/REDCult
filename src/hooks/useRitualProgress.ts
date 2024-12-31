import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { RitualParticipant } from '../types/ritual';

export const useRitualProgress = (ritualId: string) => {
  const [progress, setProgress] = useState<RitualParticipant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error: fetchError } = await supabase
        .from('ritual_participants')
        .select('*')
        .eq('ritual_id', ritualId)
        .eq('user_id', user.id)
        .single();

      if (fetchError) throw fetchError;
      setProgress(data);
    } catch (err) {
      console.error('Error fetching ritual progress:', err);
      setError(err instanceof Error ? err.message : 'Failed to load progress');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();

    const subscription = supabase
      .channel('ritual_progress_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public',
          table: 'ritual_participants',
          filter: `ritual_id=eq.${ritualId}` 
        }, 
        fetchProgress
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [ritualId]);

  const updateProgress = async (update: Record<string, any>) => {
    try {
      const { error: updateError } = await supabase.rpc(
        'update_ritual_progress',
        {
          ritual_id: ritualId,
          progress_update: update,
        }
      );

      if (updateError) throw updateError;
      await fetchProgress();
    } catch (err) {
      console.error('Error updating progress:', err);
      throw err;
    }
  };

  return {
    progress,
    loading,
    error,
    updateProgress,
    refresh: fetchProgress,
  };
};