import React from 'react';
import { Users, Star, TrendingUp, Skull } from 'lucide-react';
import type { CultProfile } from '../../../types/cult';
import { RitualManager } from '../rituals/RitualManager';

interface CultOverviewProps {
  cult: CultProfile;
}

export const CultOverview = ({ cult }: CultOverviewProps) => {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-crimson-darker p-4 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-crimson-light" />
            <h3 className="text-sm font-medium text-crimson-light">Followers</h3>
          </div>
          <p className="text-2xl font-bold">{cult.stats.followers}</p>
        </div>
        
        <div className="bg-crimson-darker p-4 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <Star className="w-5 h-5 text-crimson-light" />
            <h3 className="text-sm font-medium text-crimson-light">Reputation</h3>
          </div>
          <p className="text-2xl font-bold">{cult.stats.reputation}</p>
        </div>
        
        <div className="bg-crimson-darker p-4 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-crimson-light" />
            <h3 className="text-sm font-medium text-crimson-light">Engagement</h3>
          </div>
          <p className="text-2xl font-bold">{cult.stats.engagement}</p>
        </div>
        
        <div className="bg-crimson-darker p-4 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <Skull className="w-5 h-5 text-crimson-light" />
            <h3 className="text-sm font-medium text-crimson-light">Active Rituals</h3>
          </div>
          <p className="text-2xl font-bold">0</p>
        </div>
      </div>

      {/* Rituals Section */}
      <div className="bg-crimson-darker p-6 rounded-lg">
        <RitualManager cultId={cult.id} />
      </div>

      {/* Recent Activity */}
      <div className="bg-crimson-darker p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
        <div className="text-center text-crimson-light py-8">
          <p>No recent activity to display</p>
        </div>
      </div>
    </div>
  );
};