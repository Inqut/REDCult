import React from 'react';
import { MessageSquare, Users, Activity } from 'lucide-react';
import type { Agent } from '../../../../types/agent';

export const AgentMetrics = ({ agents }: { agents: Agent[] }) => {
  const metrics = {
    totalInteractions: agents.reduce((acc, agent) => acc + (agent.stats?.interactions || 0), 0),
    activeUsers: agents.reduce((acc, agent) => acc + (agent.stats?.activeUsers || 0), 0),
    avgEngagement: agents.length ? 
      agents.reduce((acc, agent) => acc + (agent.stats?.engagementRate || 0), 0) / agents.length : 0
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-crimson-darker p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare className="w-5 h-5 text-crimson-light" />
          <h3 className="text-sm font-medium">Total Interactions</h3>
        </div>
        <p className="text-2xl font-bold">{metrics.totalInteractions}</p>
      </div>

      <div className="bg-crimson-darker p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-5 h-5 text-crimson-light" />
          <h3 className="text-sm font-medium">Active Users</h3>
        </div>
        <p className="text-2xl font-bold">{metrics.activeUsers}</p>
      </div>

      <div className="bg-crimson-darker p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-5 h-5 text-crimson-light" />
          <h3 className="text-sm font-medium">Avg. Engagement</h3>
        </div>
        <p className="text-2xl font-bold">{metrics.avgEngagement.toFixed(1)}%</p>
      </div>
    </div>
  );
};