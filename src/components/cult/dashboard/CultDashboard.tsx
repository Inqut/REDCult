import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Settings, Users, MessageSquare, BarChart, Skull } from 'lucide-react';
import { LoadingScreen } from '../ui/LoadingScreen';
import { CultOverview } from './CultOverview';
import { CultContent } from '../content/CultContent';
import { CultSettings } from './CultSettings';
import { RitualManager } from '../rituals/RitualManager';
import { useCult } from '../../hooks/useCult';

export const CultDashboard = () => {
  const { cultId } = useParams();
  const navigate = useNavigate();
  const { cult, loading, error } = useCult(cultId!);
  const [activeTab, setActiveTab] = useState('overview');

  if (loading) return <LoadingScreen />;
  
  if (error) {
    return (
      <div className="min-h-screen bg-crimson-darkest flex items-center justify-center">
        <div className="text-center text-crimson-light">
          <p className="text-xl mb-4">Failed to load cult dashboard</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!cult) {
    return (
      <div className="min-h-screen bg-crimson-darkest flex items-center justify-center">
        <div className="text-center text-crimson-light">
          <p className="text-xl mb-4">Cult not found</p>
          <button
            onClick={() => navigate('/cults')}
            className="text-crimson hover:text-crimson-light transition-colors"
          >
            Return to My Cults
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-crimson-darkest">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center gap-4">
            <Skull className="w-12 h-12 text-crimson" />
            <div>
              <h1 className="text-3xl font-bold text-crimson-light">{cult.name}</h1>
              <p className="text-crimson">{cult.bio}</p>
            </div>
          </div>
        </header>

        <nav className="flex border-b border-crimson mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 border-b-2 ${
              activeTab === 'overview'
                ? 'border-crimson text-crimson'
                : 'border-transparent text-crimson-dark hover:text-crimson-light'
            }`}
          >
            <BarChart className="w-5 h-5 inline-block mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('rituals')}
            className={`px-4 py-2 border-b-2 ${
              activeTab === 'rituals'
                ? 'border-crimson text-crimson'
                : 'border-transparent text-crimson-dark hover:text-crimson-light'
            }`}
          >
            <Skull className="w-5 h-5 inline-block mr-2" />
            Rituals
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`px-4 py-2 border-b-2 ${
              activeTab === 'content'
                ? 'border-crimson text-crimson'
                : 'border-transparent text-crimson-dark hover:text-crimson-light'
            }`}
          >
            <MessageSquare className="w-5 h-5 inline-block mr-2" />
            Content
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 border-b-2 ${
              activeTab === 'settings'
                ? 'border-crimson text-crimson'
                : 'border-transparent text-crimson-dark hover:text-crimson-light'
            }`}
          >
            <Settings className="w-5 h-5 inline-block mr-2" />
            Settings
          </button>
        </nav>

        <main>
          {activeTab === 'overview' && <CultOverview cult={cult} />}
          {activeTab === 'rituals' && <RitualManager cultId={cult.id} />}
          {activeTab === 'content' && <CultContent cultId={cult.id} />}
          {activeTab === 'settings' && <CultSettings cult={cult} />}
        </main>
      </div>
    </div>
  );
};