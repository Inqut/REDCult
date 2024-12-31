import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { CultRole } from '../types/cult';

export const useInvites = (cultId: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendInvite = async (email: string, role: CultRole) => {
    setLoading(true);
    setError(null);

    try {
      const { error: inviteError } = await supabase
        .from('cult_invites')
        .insert([
          {
            cult_id: cultId,
            invitee_email: email.toLowerCase(),
            role,
          }
        ]);

      if (inviteError) {
        if (inviteError.code === '23505') {
          throw new Error('An invitation has already been sent to this email');
        }
        throw inviteError;
      }

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send invitation';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    sendInvite,
    loading,
    error,
  };
};