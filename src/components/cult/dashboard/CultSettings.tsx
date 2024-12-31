import React from 'react';
import { Settings } from 'lucide-react';
import { CultImages } from './CultImages';
import { CultProfile } from '../../../types/cult';

interface CultSettingsProps {
  cult: CultProfile;
}

export const CultSettings = ({ cult }: CultSettingsProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-5 h-5" />
        <h2 className="text-2xl font-bold">Cult Settings</h2>
      </div>

      <CultImages
        cultId={cult.id}
        profileImageUrl={cult.profile_image_url}
        bannerUrl={cult.banner_url}
      />

      {/* Add other settings sections here */}
    </div>
  );
};