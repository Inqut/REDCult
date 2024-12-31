import React from 'react';
import { CultCard } from '../CultCard';
import type { CultWithRole } from '../../../types/cult';

interface CultListProps {
  cults: CultWithRole[];
}

export const CultList = ({ cults }: CultListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cults.map(cult => (
        <CultCard key={cult.id} cult={cult} />
      ))}
    </div>
  );
};