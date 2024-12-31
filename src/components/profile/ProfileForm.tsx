import React, { useState, useEffect } from 'react';
import { Loader, User, FileText } from 'lucide-react';
import { Input } from '../ui/Input';
import { TextArea } from '../ui/TextArea';
import { useProfile } from '../../hooks/useProfile';
import type { ProfileFormData } from '../../types/profile';

interface ProfileFormProps {
  userId: string;
  onComplete?: () => void;
}

export const ProfileForm = ({ userId, onComplete }: ProfileFormProps) => {
  const { profile, loading, error, updateProfile } = useProfile(userId);
  const [formData, setFormData] = useState<ProfileFormData>({
    username: '',
    fullName: '',
    bio: '',
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        fullName: profile.full_name || '',
        bio: profile.bio || '',
        avatarUrl: profile.avatar_url,
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);

    try {
      await updateProfile(formData);
      onComplete?.();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center">
        <Loader className="w-6 h-6 animate-spin text-crimson" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Username"
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        icon={<User className="w-5 h-5" />}
        required
      />
      <Input
        label="Full Name"
        value={formData.fullName}
        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
        icon={<User className="w-5 h-5" />}
      />
      <TextArea
        label="Bio"
        value={formData.bio}
        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
        icon={<FileText className="w-5 h-5" />}
        placeholder="Tell us about yourself..."
      />

      {(error || saveError) && (
        <div className="p-4 bg-red-500 bg-opacity-10 border border-red-500 rounded-lg">
          <p className="text-red-500 text-sm">{error || saveError}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        className="w-full bg-crimson text-white p-3 rounded-lg hover:bg-crimson-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {saving ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            Saving...
          </>
        ) : (
          'Save Changes'
        )}
      </button>
    </form>
  );
};