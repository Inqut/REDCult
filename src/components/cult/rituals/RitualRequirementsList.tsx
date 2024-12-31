import React from 'react';
import { CheckCircle } from 'lucide-react';
import type { RitualRequirement } from '../../../types/ritual';

interface RitualRequirementsListProps {
  requirements: RitualRequirement[];
}

export const RitualRequirementsList = ({ requirements }: RitualRequirementsListProps) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Requirements</h3>
      <ul className="space-y-2">
        {requirements.map((req, index) => (
          <li key={index} className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>{req.description}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};