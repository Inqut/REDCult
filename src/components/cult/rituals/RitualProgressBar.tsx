import React from 'react';
import { getRitualProgress } from '../../../utils/ritualUtils';
import type { Ritual } from '../../../types/ritual';

interface RitualProgressBarProps {
  ritual: Ritual;
}

export const RitualProgressBar = ({ ritual }: RitualProgressBarProps) => {
  const progress = getRitualProgress(ritual);
  
  return (
    <div className="w-full bg-crimson-darkest rounded-full h-2">
      <div 
        className="bg-crimson h-2 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};