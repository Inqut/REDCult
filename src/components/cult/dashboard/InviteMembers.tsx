import React, { useState } from 'react';
import { Mail, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import { Input } from '../../ui/Input';
import { useInvites } from '../../../hooks/useInvites';
import type { CultRole } from '../../../types/cult';

interface InviteMembersProps {
  cultId: string;
}

export const InviteMembers = ({ cultId }: InviteMembersProps) => {
  const { sendInvite, loading, error } = useInvites(cultId);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<CultRole>('member');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);

    if (await sendInvite(email, role)) {
      setEmail('');
      setSuccess(true);
    }
  };

  return (
    <div className="bg-crimson-darker p-6 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Invite Members</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail className="w-5 h-5" />}
          required
        />

        <div>
          <label className="block text-sm font-medium mb-2">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as CultRole)}
            className="w-full bg-crimson-darkest border-2 border-crimson-dark p-3 rounded-lg focus:border-crimson outline-none text-crimson-light"
          >
            <option value="member">Member</option>
            <option value="moderator">Moderator</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {error && (
          <div className="p-4 bg-red-500 bg-opacity-10 border border-red-500 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-500 bg-opacity-10 border border-green-500 rounded-lg flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <p className="text-green-500 text-sm">Invitation sent successfully!</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-crimson text-white p-3 rounded-lg hover:bg-crimson-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Sending...
            </>
          ) : (
            'Send Invitation'
          )}
        </button>
      </form>
    </div>
  );
};