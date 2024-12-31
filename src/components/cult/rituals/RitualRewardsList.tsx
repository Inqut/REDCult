import React from 'react';
import { Trophy } from 'lucide-react';
import type { RitualReward } from '../../../types/ritual';

interface RitualRewardsListProps {
  rewards: RitualReward[];
}

export const RitualRewardsList = ({ rewards }: RitualRewardsListProps) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Rewards</h3>
      <ul className="space-y-2">
        {rewards.map((reward, index) => (
          <li key={index} className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            <span>{reward.description}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};