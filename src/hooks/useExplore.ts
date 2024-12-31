import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { CultWithRole } from '../types/cult';

export const useExplore = () => {
  const [cults, setCults] = useState<CultWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCults = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        // Fetch all public cults with their creators and member counts
        const { data, error: fetchError } = await supabase
          .from('cults')
          .select(`
            *,
            creator:profiles!cults_creator_id_fkey(username),
            cult_roles(count)
          `)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        // If user is authenticated, fetch their roles
        let userRoles: Record<string, string> = {};
        if (user) {
          const { data: roles } = await supabase
            .from('cult_roles')
            .select('cult_id, role')
            .eq('user_id', user.id);

          userRoles = (roles || []).reduce((acc, { cult_id, role }) => ({
            ...acc,
            [cult_id]: role
          }), {});
        }

        // Process cults with roles
        const processedCults = data?.map(cult => ({
          ...cult,
          isOwner: cult.creator_id === user?.id,
          role: userRoles[cult.id] || null,
          memberCount: cult.cult_roles?.[0]?.count || 0
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

    // Subscribe to changes
    const subscription = supabase
      .channel('public:cults')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'cults'
        }, 
        () => fetchCults()
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { cults, loading, error };
};