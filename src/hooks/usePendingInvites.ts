import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface CultInvite {
  id: string;
  invitee_email: string;
  role: string;
  created_at: string;
  accepted_at: string | null;
}

export const usePendingInvites = (cultId: string) => {
  const [invites, setInvites] = useState<CultInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvites = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('cult_invites')
          .select('*')
          .eq('cult_id', cultId)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        setInvites(data || []);
      } catch (err) {
        console.error('Error fetching invites:', err);
        setError(err instanceof Error ? err.message : 'Failed to load invites');
      } finally {
        setLoading(false);
      }
    };

    fetchInvites();

    // Subscribe to changes
    const subscription = supabase
      .channel('cult_invites_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'cult_invites',
          filter: `cult_id=eq.${cultId}` 
        }, 
        fetchInvites
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [cultId]);

  const cancelInvite = async (inviteId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('cult_invites')
        .delete()
        .eq('id', inviteId);

      if (deleteError) throw deleteError;

      setInvites(invites.filter(invite => invite.id !== inviteId));
    } catch (err) {
      console.error('Error canceling invite:', err);
      setError(err instanceof Error ? err.message : 'Failed to cancel invite');
    }
  };

  return {
    invites,
    loading,
    error,
    cancelInvite,
  };
};