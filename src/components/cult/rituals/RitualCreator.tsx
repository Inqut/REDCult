import React, { useState } from 'react';
import { Loader, AlertCircle } from 'lucide-react';
import { Input } from '../../ui/Input';
import { TextArea } from '../../ui/TextArea';
import { createRitual } from '../../../services/ritualService';
import type { RitualType, RitualRequirement, RitualReward } from '../../../types/ritual';

interface RitualCreatorProps {
  cultId: string;
  onComplete: () => void;
  onCancel: () => void;
}

export const RitualCreator = ({ cultId, onComplete, onCancel }: RitualCreatorProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'daily' as RitualType,
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    minParticipants: 1,
    maxParticipants: undefined as number | undefined,
    requirements: [] as RitualRequirement[],
    rewards: [] as RitualReward[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createRitual({
        cultId,
        ...formData,
      });
      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create ritual');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-crimson-darker p-6 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Create New Ritual</h3>

      <Input
        label="Ritual Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />

      <TextArea
        label="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as RitualType })}
            className="w-full bg-crimson-darkest border-2 border-crimson-dark p-3 rounded-lg focus:border-crimson outline-none"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="special">Special</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Duration (hours)</label>
          <input
            type="number"
            min="1"
            max="168"
            value={(new Date(formData.endTime).getTime() - new Date(formData.startTime).getTime()) / (1000 * 60 * 60)}
            onChange={(e) => {
              const hours = parseInt(e.target.value);
              setFormData({
                ...formData,
                endTime: new Date(new Date(formData.startTime).getTime() + hours * 60 * 60 * 1000).toISOString(),
              });
            }}
            className="w-full bg-crimson-darkest border-2 border-crimson-dark p-3 rounded-lg focus:border-crimson outline-none"
          />
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500 bg-opacity-10 border border-red-500 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border-2 border-crimson rounded-lg hover:border-crimson-light transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-crimson text-white px-4 py-2 rounded-lg hover:bg-crimson-light transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Creating...
            </>
          ) : (
            'Create Ritual'
          )}
        </button>
      </div>
    </form>
  );
};