import React from 'react';
import { Bot, ExternalLink } from 'lucide-react';
import { useAgents } from '../../../hooks/useAgents';

interface AgentListProps {
  cultId: string;
}

export const AgentList = ({ cultId }: AgentListProps) => {
  const { agents, loading, error } = useAgents(cultId);

  if (loading) {
    return <div className="text-center py-8">Loading agents...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  if (!agents.length) {
    return (
      <div className="text-center py-8 text-crimson-light">
        No AI agents have been added yet
      </div>
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
      {agents.map((agent) => (
        <div
          key={agent.id}
          className="bg-crimson-darker p-6 rounded-lg hover:bg-crimson-dark transition-colors"
        >
          <div className="flex items-start gap-4">
            <Bot className="w-8 h-8 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-semibold mb-2">{agent.name}</h3>
              <p className="text-crimson-light mb-4">{agent.description}</p>
              
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="text-crimson-light">Model:</span>{' '}
                  {agent.config.modelProvider}
                </div>
                
                {agent.config.topics && (
                  <div className="flex flex-wrap gap-2">
                    {agent.config.topics.map((topic: string, index: number) => (
                      <span
                        key={index}
                        className="text-xs bg-crimson bg-opacity-20 text-crimson-light px-2 py-1 rounded"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                )}

                {agent.config.twitterProfile?.username && (
                  <a
                    href={`https://twitter.com/${agent.config.twitterProfile.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-crimson hover:text-crimson-light"
                  >
                    <ExternalLink className="w-4 h-4" />
                    @{agent.config.twitterProfile.username}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};