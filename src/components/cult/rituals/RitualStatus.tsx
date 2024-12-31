import React from 'react';
import { Calendar, Repeat, Star } from 'lucide-react';
import type { RitualType } from '../../../types/ritual';

interface RitualStatusProps {
  type: RitualType;
}

export const RitualStatus = ({ type }: RitualStatusProps) => {
  const getStatusInfo = () => {
    switch (type) {
      case 'daily':
        return {
          icon: <Repeat className="w-4 h-4" />,
          label: 'Daily',
          className: 'bg-blue-500',
        };
      case 'weekly':
        return {
          icon: <Calendar className="w-4 h-4" />,
          label: 'Weekly',
          className: 'bg-purple-500',
        };
      case 'special':
        return {
          icon: <Star className="w-4 h-4" />,
          label: 'Special',
          className: 'bg-yellow-500',
        };
    }
  };

  const { icon, label, className } = getStatusInfo();

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${className}`}>
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
};