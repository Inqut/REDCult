import React, { useState } from 'react';
import { TwitterImport } from './TwitterImport';
import { ManualCultForm } from './ManualCultForm';
import { Bot, Twitter } from 'lucide-react';
import { CultType } from '../../types/cult';

export const CultCreationForm = () => {
  const [creationType, setCreationType] = useState<'manual' | 'twitter'>('manual');
  const [cultType, setCultType] = useState<CultType>('agent');

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Create Your Cult</h1>
      
      <div className="mb-8">
        <h2 className="text-xl mb-4">Choose Your Path</h2>
        <div className="flex gap-4">
          <button
            onClick={() => setCultType('agent')}
            className={`flex-1 p-4 rounded-lg border-2 ${
              cultType === 'agent'
                ? 'border-crimson bg-crimson-darker'
                : 'border-crimson-dark hover:border-crimson'
            }`}
          >
            <Bot className="w-8 h-8 mx-auto mb-2" />
            <div className="text-lg font-semibold">AI Agent</div>
          </button>
          <button
            onClick={() => setCultType('developer')}
            className={`flex-1 p-4 rounded-lg border-2 ${
              cultType === 'developer'
                ? 'border-crimson bg-crimson-darker'
                : 'border-crimson-dark hover:border-crimson'
            }`}
          >
            <Bot className="w-8 h-8 mx-auto mb-2" />
            <div className="text-lg font-semibold">Developer</div>
          </button>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setCreationType('manual')}
            className={`flex-1 p-3 rounded-lg border ${
              creationType === 'manual'
                ? 'border-crimson bg-crimson-darker'
                : 'border-crimson-dark hover:border-crimson'
            }`}
          >
            Manual Creation
          </button>
          <button
            onClick={() => setCreationType('twitter')}
            className={`flex-1 p-3 rounded-lg border flex items-center justify-center gap-2 ${
              creationType === 'twitter'
                ? 'border-crimson bg-crimson-darker'
                : 'border-crimson-dark hover:border-crimson'
            }`}
          >
            <Twitter className="w-5 h-5" />
            Import from Twitter
          </button>
        </div>

        {creationType === 'twitter' ? (
          <TwitterImport cultType={cultType} />
        ) : (
          <ManualCultForm cultType={cultType} />
        )}
      </div>
    </div>
  );
};