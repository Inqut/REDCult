import React from 'react';
import { ImageUpload } from '../../profile/ImageUpload';
import { useCultImages } from '../../../hooks/useCultImages';

interface CultImagesProps {
  cultId: string;
  profileImageUrl?: string;
  bannerUrl?: string;
}

export const CultImages = ({ cultId, profileImageUrl, bannerUrl }: CultImagesProps) => {
  const { updateImages, loading, error } = useCultImages(cultId);

  return (
    <div className="bg-crimson-darker p-6 rounded-lg space-y-6">
      <h3 className="text-xl font-semibold mb-4">Cult Images</h3>
      
      <div className="space-y-6">
        <ImageUpload
          type="banner"
          currentUrl={bannerUrl}
          onUpload={(url) => updateImages({ bannerUrl: url })}
        />
        
        <ImageUpload
          type="profile"
          currentUrl={profileImageUrl}
          onUpload={(url) => updateImages({ profileImageUrl: url })}
        />
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
};