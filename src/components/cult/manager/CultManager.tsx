import React, { useState } from 'react';
import { Bot, Users, MessageSquare, Settings } from 'lucide-react';
import { AgentDashboard } from './agents/AgentDashboard';
import { MembershipManager } from './members/MembershipManager';
import { CultSettings } from './settings/CultSettings';
import { ElizaChat } from './eliza/ElizaChat';
import { useCult } from '../../../hooks/useCult';
import { LoadingScreen } from '../../ui/LoadingScreen';

export const CultManager = ({ cultId }: { cultId: string }) => {
  const [activeTab, setActiveTab] = useState('agents');
  const { cult, loading, error } = useCult(cultId);

  if (loading) return <LoadingScreen />;
  if (error) return <div>Error: {error}</div>;
  if (!cult) return <div>Cult not found</div>;

  const tabs = [
    { id: 'agents', label: 'AI Agents', icon: Bot },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'chat', label: 'Eliza Chat', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-crimson-darkest">
      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex border-b border-crimson mb-8">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`px-4 py-2 border-b-2 flex items-center gap-2 ${
                activeTab === id
                  ? 'border-crimson text-crimson'
                  : 'border-transparent text-crimson-dark hover:text-crimson-light'
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'agents' && <AgentDashboard cultId={cultId} />}
          {activeTab === 'members' && <MembershipManager cultId={cultId} />}
          {activeTab === 'chat' && <ElizaChat cultId={cultId} />}
          {activeTab === 'settings' && <CultSettings cult={cult} />}
        </div>
      </div>
    </div>
  );
};