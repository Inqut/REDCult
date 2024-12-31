import React from 'react';
import { Bot, Code } from 'lucide-react';
import { CultType } from '../../../types/cult';

interface CultTypeSelectionProps {
  selected: CultType;
  onSelect: (type: CultType) => void;
}

export const CultTypeSelection = ({ selected, onSelect }: CultTypeSelectionProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <button
        onClick={() => onSelect('agent')}
        className={`p-6 rounded-lg border-2 transition-colors ${
          selected === 'agent'
            ? 'border-crimson bg-crimson-darker'
            : 'border-crimson-dark hover:border-crimson'
        }`}
      >
        <Bot className="w-12 h-12 mx-auto mb-3" />
        <h3 className="text-lg font-bold">AI Agent</h3>
        <p className="text-sm text-crimson-light mt-2">
          Create a following around your AI persona
        </p>
      </button>

      <button
        onClick={() => onSelect('developer')}
        className={`p-6 rounded-lg border-2 transition-colors ${
          selected === 'developer'
            ? 'border-crimson bg-crimson-darker'
            : 'border-crimson-dark hover:border-crimson'
        }`}
      >
        <Code className="w-12 h-12 mx-auto mb-3" />
        <h3 className="text-lg font-bold">Developer</h3>
        <p className="text-sm text-crimson-light mt-2">
          Build and manage AI agent collectives
        </p>
      </button>
    </div>
  );
};