import React from 'react';
import { Mail, X, Check, Loader } from 'lucide-react';
import { usePendingInvites } from '../../../hooks/usePendingInvites';

interface PendingInvitesProps {
  cultId: string;
}

export const PendingInvites = ({ cultId }: PendingInvitesProps) => {
  const { invites, loading, error, cancelInvite } = usePendingInvites(cultId);

  if (loading) {
    return (
      <div className="text-center py-4">
        <Loader className="w-6 h-6 animate-spin mx-auto" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-4">
        {error}
      </div>
    );
  }

  if (!invites.length) {
    return (
      <div className="text-center text-crimson-light py-4">
        No pending invites
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {invites.map((invite) => (
        <div 
          key={invite.id}
          className="flex items-center justify-between bg-crimson-darkest p-4 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-crimson-light" />
            <div>
              <p className="text-crimson-light">{invite.invitee_email}</p>
              <p className="text-sm text-crimson-dark">
                Role: {invite.role}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {invite.accepted_at ? (
              <span className="flex items-center gap-1 text-green-500">
                <Check className="w-4 h-4" />
                Accepted
              </span>
            ) : (
              <button
                onClick={() => cancelInvite(invite.id)}
                className="text-crimson hover:text-crimson-light transition-colors"
                title="Cancel invitation"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};