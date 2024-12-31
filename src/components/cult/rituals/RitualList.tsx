import React from 'react';
import { Clock, Users, Trophy } from 'lucide-react';
import { useRituals } from '../../../hooks/useRituals';
import { RitualStatus } from './RitualStatus';
import { formatDistanceToNow } from 'date-fns';

interface RitualListProps {
  cultId: string;
  onSelect: (ritualId: string) => void;
}

export const RitualList = ({ cultId, onSelect }: RitualListProps) => {
  const { rituals, loading, error } = useRituals(cultId);

  if (loading) {
    return <div className="text-center py-8">Loading rituals...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  if (!rituals.length) {
    return (
      <div className="text-center py-8 text-crimson-light">
        No active rituals
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {rituals.map((ritual) => (
        <div
          key={ritual.id}
          onClick={() => onSelect(ritual.id)}
          className="bg-crimson-darker p-6 rounded-lg hover:bg-crimson-dark transition-colors cursor-pointer"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">{ritual.name}</h3>
              <p className="text-crimson-light">{ritual.description}</p>
            </div>
            <RitualStatus type={ritual.type} />
          </div>

          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>
                Ends {formatDistanceToNow(new Date(ritual.endTime), { addSuffix: true })}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>
                {ritual.ritual_participants?.length || 0} / 
                {ritual.maxParticipants || '∞'} participants
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              <span>{ritual.rewards.length} rewards</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};