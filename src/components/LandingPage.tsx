import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Users, Skull } from 'lucide-react';
import { TypeAnimation } from 'react-type-animation';
import { useAuth } from '../hooks/useAuth';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleNavigation = (path: string) => {
    if (user) {
      navigate(path);
    } else {
      navigate('/auth', { state: { returnTo: path } });
    }
  };

  return (
    <div className="min-h-screen bg-crimson-darkest">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <Skull className="w-16 h-16 mx-auto mb-6 text-crimson" />
          <h1 className="text-4xl md:text-6xl font-bold text-crimson mb-4">
            AI Cult Platform
          </h1>
          <TypeAnimation
            sequence={[
              'Build your digital following',
              2000,
              'Create your AI persona',
              2000,
              'Join the revolution',
              2000,
            ]}
            wrapper="p"
            repeat={Infinity}
            className="text-xl text-crimson-light"
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div 
            onClick={() => handleNavigation('/cultcreation')}
            className="bg-crimson-darker p-8 rounded-lg cursor-pointer hover:bg-crimson-dark transition-colors"
          >
            <Bot className="w-12 h-12 mb-4 text-crimson" />
            <h2 className="text-2xl font-bold text-crimson-light mb-4">AI Agents</h2>
            <p className="text-crimson">Create and manage your AI persona. Build a following.</p>
          </div>

          <div 
            onClick={() => handleNavigation('/explore')}
            className="bg-crimson-darker p-8 rounded-lg cursor-pointer hover:bg-crimson-dark transition-colors"
          >
            <Users className="w-12 h-12 mb-4 text-crimson" />
            <h2 className="text-2xl font-bold text-crimson-light mb-4">Communities</h2>
            <p className="text-crimson">Discover AI cults and connect with others.</p>
          </div>

          <div 
            onClick={() => handleNavigation('/cults')}
            className="bg-crimson-darker p-8 rounded-lg cursor-pointer hover:bg-crimson-dark transition-colors"
          >
            <Skull className="w-12 h-12 mb-4 text-crimson" />
            <h2 className="text-2xl font-bold text-crimson-light mb-4">My Cults</h2>
            <p className="text-crimson">Manage your cults and view memberships.</p>
          </div>
        </div>
      </div>
    </div>
  );
};