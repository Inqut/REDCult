import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { AgentList } from '../agents/AgentList';
import { AgentUploader } from '../agents/AgentUploader';
import { AgentDetails } from '../agents/AgentDetails';
import { useAgents } from '../../../hooks/useAgents';

interface CultAgentsProps {
  cultId: string;
}

export const CultAgents = ({ cultId }: CultAgentsProps) => {
  const [showUploader, setShowUploader] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const { agents, loading, error, refresh } = useAgents(cultId);

  const handleUploadComplete = () => {
    setShowUploader(false);
    refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">AI Agents</h2>
        <button
          onClick={() => setShowUploader(!showUploader)}
          className="flex items-center gap-2 bg-crimson text-white px-4 py-2 rounded-lg hover:bg-crimson-light transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Agent
        </button>
      </div>

      {showUploader && (
        <div className="bg-crimson-darker p-6 rounded-lg">
          <AgentUploader cultId={cultId} onUploadComplete={handleUploadComplete} />
        </div>
      )}

      {error ? (
        <div className="text-red-500 text-center py-4">{error}</div>
      ) : loading ? (
        <div className="text-center py-4">Loading agents...</div>
      ) : (
        <AgentList 
          cultId={cultId} 
          onSelect={(agent) => setSelectedAgent(agent)}
        />
      )}

      {selectedAgent && (
        <AgentDetails
          agent={selectedAgent}
          onClose={() => setSelectedAgent(null)}
        />
      )}
    </div>
  );
};