import React, { useState } from 'react';
import { User, Mail, FileText, Loader, AlertCircle } from 'lucide-react';
import { Input } from '../ui/Input';
import { TextArea } from '../ui/TextArea';
import { ImageUpload } from './ImageUpload';
import { useProfile } from '../../hooks/useProfile';

export const ProfileManager = () => {
  const { profile, loading, error, updateProfile } = useProfile();
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: profile?.username || '',
    email: profile?.email || '',
    bio: profile?.bio || '',
    avatarUrl: profile?.avatar_url,
    bannerUrl: profile?.banner_url,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);

    try {
      await updateProfile({
        username: formData.username,
        bio: formData.bio,
        avatar_url: formData.avatarUrl,
        banner_url: formData.bannerUrl,
      });
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader className="w-8 h-8 animate-spin text-crimson" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-6">
          <ImageUpload
            type="banner"
            currentUrl={formData.bannerUrl}
            onUpload={(url) => setFormData({ ...formData, bannerUrl: url })}
          />

          <ImageUpload
            type="profile"
            currentUrl={formData.avatarUrl}
            onUpload={(url) => setFormData({ ...formData, avatarUrl: url })}
          />
        </div>

        <Input
          label="Username"
          icon={<User className="w-5 h-5" />}
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          required
        />

        <Input
          label="Email"
          icon={<Mail className="w-5 h-5" />}
          value={formData.email}
          disabled
        />

        <TextArea
          label="Bio"
          icon={<FileText className="w-5 h-5" />}
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          placeholder="Tell us about yourself..."
        />

        {(error || saveError) && (
          <div className="p-4 bg-red-500 bg-opacity-10 border border-red-500 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
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
    </div>
  );
};