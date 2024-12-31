import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { RitualList } from './RitualList';
import { RitualDetails } from './RitualDetails';
import { RitualCreator } from './RitualCreator';
import { useRituals } from '../../../hooks/useRituals';
import { joinRitual } from '../../../services/ritualService';

interface RitualManagerProps {
  cultId: string;
}

export const RitualManager = ({ cultId }: RitualManagerProps) => {
  const [showCreator, setShowCreator] = useState(false);
  const [selectedRitualId, setSelectedRitualId] = useState<string | null>(null);
  const { rituals, loading, error, refresh } = useRituals(cultId);

  const handleCreate = () => {
    setShowCreator(true);
  };

  const handleCreateComplete = () => {
    setShowCreator(false);
    refresh();
  };

  const handleJoin = async (ritualId: string) => {
    try {
      await joinRitual(ritualId);
      refresh();
    } catch (error) {
      console.error('Failed to join ritual:', error);
    }
  };

  const selectedRitual = rituals.find(r => r.id === selectedRitualId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Rituals</h2>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-crimson text-white px-4 py-2 rounded-lg hover:bg-crimson-light transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Ritual
        </button>
      </div>

      {showCreator && (
        <RitualCreator
          cultId={cultId}
          onComplete={handleCreateComplete}
          onCancel={() => setShowCreator(false)}
        />
      )}

      {error ? (
        <div className="text-red-500 text-center py-4">{error}</div>
      ) : loading ? (
        <div className="text-center py-4">Loading rituals...</div>
      ) : (
        <RitualList
          cultId={cultId}
          onSelect={setSelectedRitualId}
        />
      )}

      {selectedRitual && (
        <RitualDetails
          ritual={selectedRitual}
          onClose={() => setSelectedRitualId(null)}
          onJoin={() => handleJoin(selectedRitual.id)}
        />
      )}
    </div>
  );
};