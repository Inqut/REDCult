import React from 'react';
import { Settings } from 'lucide-react';
import { ProfileManager } from './ProfileManager';

export const ProfileSettings = () => {
  return (
    <div className="min-h-screen bg-crimson-darkest">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-8">
          <Settings className="w-6 h-6" />
          <h1 className="text-3xl font-bold">Profile Settings</h1>
        </div>

        <ProfileManager />
      </div>
    </div>
  );
};