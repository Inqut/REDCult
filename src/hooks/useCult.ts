import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { CultProfile } from '../types/cult';

export const useCult = (cultId: string) => {
  const [cult, setCult] = useState<CultProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCult = async () => {
      try {
        // First fetch the cult details
        const { data: cultData, error: cultError } = await supabase
          .from('cults')
          .select(`
            *,
            creator:profiles!cults_creator_id_fkey(username)
          `)
          .eq('id', cultId)
          .single();

        if (cultError) throw cultError;

        // Then fetch the roles separately
        const { data: rolesData, error: rolesError } = await supabase
          .from('cult_roles')
          .select(`
            *,
            profile:profiles(username)
          `)
          .eq('cult_id', cultId);

        if (rolesError) throw rolesError;

        setCult({
          ...cultData,
          roles: rolesData || []
        });
      } catch (err) {
        console.error('Error fetching cult:', err);
        setError(err instanceof Error ? err.message : 'Failed to load cult');
      } finally {
        setLoading(false);
      }
    };

    fetchCult();
  }, [cultId]);

  return { cult, loading, error };
};