import React from 'react';
import { Users, Shield, Crown } from 'lucide-react';
import { InviteMembers } from './InviteMembers';
import { PendingInvites } from './PendingInvites';
import { useMembers } from '../../../hooks/useMembers';

interface MembersProps {
  cultId: string;
}

export const Members = ({ cultId }: MembersProps) => {
  const { members, loading, error } = useMembers(cultId);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'admin':
        return <Shield className="w-4 h-4 text-crimson" />;
      case 'moderator':
        return <Shield className="w-4 h-4 text-crimson-light" />;
      default:
        return <Users className="w-4 h-4 text-crimson-dark" />;
    }
  };

  return (
    <div className="space-y-8">
      <InviteMembers cultId={cultId} />

      <div className="bg-crimson-darker p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Pending Invites</h3>
        <PendingInvites cultId={cultId} />
      </div>

      <div className="bg-crimson-darker p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Members</h3>
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : (
          <div className="space-y-4">
            {members.map((member) => (
              <div 
                key={member.id}
                className="flex items-center justify-between bg-crimson-darkest p-4 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {getRoleIcon(member.role)}
                  <div>
                    <p className="text-crimson-light">{member.username}</p>
                    <p className="text-sm text-crimson-dark capitalize">
                      {member.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};