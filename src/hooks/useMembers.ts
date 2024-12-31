import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Member {
  id: string;
  username: string;
  role: string;
  joined_at: string;
}

export const useMembers = (cultId: string) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('cult_roles')
          .select(`
            user_id,
            role,
            assigned_at,
            profile:profiles(username)
          `)
          .eq('cult_id', cultId)
          .order('assigned_at', { ascending: true });

        if (fetchError) throw fetchError;

        const processedMembers = data?.map(({ user_id, role, assigned_at, profile }) => ({
          id: user_id,
          username: profile?.username || 'Unknown User',
          role,
          joined_at: assigned_at,
        })) || [];

        setMembers(processedMembers);
      } catch (err) {
        console.error('Error fetching members:', err);
        setError(err instanceof Error ? err.message : 'Failed to load members');
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();

    // Subscribe to changes
    const subscription = supabase
      .channel('cult_roles_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'cult_roles',
          filter: `cult_id=eq.${cultId}` 
        }, 
        fetchMembers
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [cultId]);

  return {
    members,
    loading,
    error,
  };
};