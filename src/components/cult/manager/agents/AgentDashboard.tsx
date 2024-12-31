import React, { useState } from 'react';
import { Plus, Bot } from 'lucide-react';
import { AgentList } from './AgentList';
import { AgentCreator } from './AgentCreator';
import { AgentMetrics } from './AgentMetrics';
import { useAgents } from '../../../../hooks/useAgents';

export const AgentDashboard = ({ cultId }: { cultId: string }) => {
  const [showCreator, setShowCreator] = useState(false);
  const { agents, loading, error, refresh } = useAgents(cultId);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Bot className="w-6 h-6" />
          AI Agents
        </h2>
        <button
          onClick={() => setShowCreator(true)}
          className="bg-crimson text-white px-4 py-2 rounded-lg hover:bg-crimson-light transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Agent
        </button>
      </div>

      <AgentMetrics agents={agents} />

      {showCreator && (
        <AgentCreator
          cultId={cultId}
          onComplete={() => {
            setShowCreator(false);
            refresh();
          }}
          onCancel={() => setShowCreator(false)}
        />
      )}

      <AgentList
        agents={agents}
        loading={loading}
        error={error}
      />
    </div>
  );
};