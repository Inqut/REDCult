import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useAgents = (cultId: string) => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgents = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('cult_agents')
        .select('*')
        .eq('cult_id', cultId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setAgents(data || []);
    } catch (err) {
      console.error('Error fetching agents:', err);
      setError(err instanceof Error ? err.message : 'Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();

    // Subscribe to changes
    const subscription = supabase
      .channel('cult_agents_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'cult_agents',
          filter: `cult_id=eq.${cultId}` 
        }, 
        fetchAgents
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [cultId]);

  return {
    agents,
    loading,
    error,
    refresh: fetchAgents,
  };
};