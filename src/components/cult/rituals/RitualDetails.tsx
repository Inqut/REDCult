import React from 'react';
import { Clock, Users, Trophy, CheckCircle, X } from 'lucide-react';
import type { Ritual } from '../../../types/ritual';
import { RitualStatus } from './RitualStatus';
import { formatDistanceToNow } from '../../../utils/dateUtils';
import { RitualRequirementsList } from './RitualRequirementsList';
import { RitualRewardsList } from './RitualRewardsList';

interface RitualDetailsProps {
  ritual: Ritual;
  onClose: () => void;
  onJoin: () => void;
}

export const RitualDetails = ({ ritual, onClose, onJoin }: RitualDetailsProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-crimson-darker rounded-lg w-full max-w-2xl">
        <div className="flex justify-between items-center p-4 border-b border-crimson">
          <div className="flex items-center gap-3">
            <RitualStatus type={ritual.type} />
            <h2 className="text-xl font-semibold">{ritual.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-crimson-light hover:text-crimson transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-crimson-light mb-6">{ritual.description}</p>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>
                Ends {formatDistanceToNow(ritual.endTime)}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>
                {ritual.ritual_participants?.length || 0} / 
                {ritual.maxParticipants || '∞'} participants
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              <span>{ritual.rewards.length} rewards</span>
            </div>
          </div>

          <div className="space-y-6">
            <RitualRequirementsList requirements={ritual.requirements} />
            <RitualRewardsList rewards={ritual.rewards} />
          </div>

          <div className="mt-6">
            <button
              onClick={onJoin}
              className="w-full bg-crimson text-white p-3 rounded-lg hover:bg-crimson-light transition-colors"
            >
              Join Ritual
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};