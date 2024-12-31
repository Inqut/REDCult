import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface UpdateImagesParams {
  profileImageUrl?: string;
  bannerUrl?: string;
}

export const useCultImages = (cultId: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateImages = async ({ profileImageUrl, bannerUrl }: UpdateImagesParams) => {
    setLoading(true);
    setError(null);

    try {
      const updates: Record<string, string> = {};
      if (profileImageUrl) updates.profile_image_url = profileImageUrl;
      if (bannerUrl) updates.banner_url = bannerUrl;

      const { error: updateError } = await supabase
        .from('cults')
        .update(updates)
        .eq('id', cultId);

      if (updateError) throw updateError;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update images';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateImages,
    loading,
    error,
  };
};