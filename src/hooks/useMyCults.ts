import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { CultWithRole } from '../types/cult';

export const useMyCults = () => {
  const [cults, setCults] = useState<CultWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCults = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        // Fetch cults where user has a role
        const { data: cultRoles, error: rolesError } = await supabase
          .from('cult_roles')
          .select(`
            cult:cults (
              id,
              name,
              bio,
              type,
              stats,
              created_at,
              creator:profiles!cults_creator_id_fkey (username)
            ),
            role
          `)
          .eq('user_id', user.id);

        if (rolesError) throw rolesError;

        const processedCults = cultRoles?.map(({ cult, role }) => ({
          ...cult,
          isOwner: role === 'owner',
          role,
        })) || [];

        setCults(processedCults);
      } catch (err) {
        console.error('Error fetching cults:', err);
        setError(err instanceof Error ? err.message : 'Failed to load cults');
      } finally {
        setLoading(false);
      }
    };

    fetchCults();
  }, []);

  return { cults, loading, error };
};