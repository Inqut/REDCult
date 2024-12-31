import React from 'react';
import { CheckCircle, Circle, Loader } from 'lucide-react';
import { useRitualProgress } from '../../../hooks/useRitualProgress';
import type { RitualRequirement } from '../../../types/ritual';

interface RitualProgressProps {
  ritualId: string;
  requirements: RitualRequirement[];
}

export const RitualProgress = ({ ritualId, requirements }: RitualProgressProps) => {
  const { progress, loading, error, updateProgress } = useRitualProgress(ritualId);

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <Loader className="w-6 h-6 animate-spin text-crimson" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-4">{error}</div>
    );
  }

  const handleRequirementClick = async (index: number) => {
    if (!progress) return;

    const currentProgress = progress.progress || {};
    const isCompleted = currentProgress[`requirement_${index}`]?.completed;

    await updateProgress({
      [`requirement_${index}`]: {
        completed: !isCompleted,
        completedAt: !isCompleted ? new Date().toISOString() : null,
      }
    });
  };

  return (
    <div className="space-y-4">
      {requirements.map((requirement, index) => {
        const isCompleted = progress?.progress?.[`requirement_${index}`]?.completed;

        return (
          <button
            key={index}
            onClick={() => handleRequirementClick(index)}
            className="w-full flex items-center gap-3 p-3 rounded-lg bg-crimson-darker hover:bg-crimson-dark transition-colors"
          >
            {isCompleted ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <Circle className="w-5 h-5 text-crimson-light" />
            )}
            <span className={isCompleted ? 'line-through text-crimson-light' : ''}>
              {requirement.description}
            </span>
          </button>
        );
      })}
    </div>
  );
};