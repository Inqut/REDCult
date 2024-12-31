import React, { useState } from 'react';
import { Bot, MessageSquare, X } from 'lucide-react';
import { AgentChat } from './AgentChat';

interface AgentDetailsProps {
  agent: {
    id: string;
    name: string;
    description: string;
    config: any;
  };
  onClose: () => void;
}

export const AgentDetails = ({ agent, onClose }: AgentDetailsProps) => {
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-crimson-darker rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-crimson">
          <div className="flex items-center gap-3">
            <Bot className="w-6 h-6" />
            <h2 className="text-xl font-semibold">{agent.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-crimson-light hover:text-crimson transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {showChat ? (
            <AgentChat agent={agent} />
          ) : (
            <div className="space-y-6">
              <p className="text-crimson-light">{agent.description}</p>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {agent.config.topics.map((topic: string, index: number) => (
                    <span
                      key={index}
                      className="bg-crimson bg-opacity-20 text-crimson-light px-3 py-1 rounded-full text-sm"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setShowChat(true)}
                className="flex items-center gap-2 bg-crimson text-white px-4 py-2 rounded-lg hover:bg-crimson-light transition-colors"
              >
                <MessageSquare className="w-5 h-5" />
                Start Chat
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};