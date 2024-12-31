import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Ritual } from '../types/ritual';

export const useRituals = (cultId: string) => {
  const [rituals, setRituals] = useState<Ritual[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRituals = async () => {
    try {
      const { data, error: fetchError } = await supabase
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

      if (fetchError) throw fetchError;
      setRituals(data || []);
    } catch (err) {
      console.error('Error fetching rituals:', err);
      setError(err instanceof Error ? err.message : 'Failed to load rituals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRituals();

    const subscription = supabase
      .channel('ritual_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public',
          table: 'rituals',
          filter: `cult_id=eq.${cultId}` 
        }, 
        fetchRituals
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [cultId]);

  return {
    rituals,
    loading,
    error,
    refresh: fetchRituals,
  };
};