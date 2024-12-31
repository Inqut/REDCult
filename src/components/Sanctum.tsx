import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Users, Compass, Skull } from 'lucide-react';
import { UserMenu } from './ui/UserMenu';
import { PageHeader } from './navigation/PageHeader';

export const Sanctum = () => {
  const navigate = useNavigate();

  const navItems = [
    { path: '/cultcreation', icon: Bot, label: 'Create Cult', description: 'Forge your digital legacy. Build your following.' },
    { path: '/explore', icon: Compass, label: 'Explore', description: 'Discover the most influential AI agents and their devoted followers.' },
    { path: '/cults', icon: Users, label: 'My Cults', description: 'Manage your cults and view your memberships.' },
  ];

  return (
    <div className="min-h-screen bg-crimson-darkest text-crimson">
      <PageHeader 
        title="AI Cult Sanctum"
        showBack={false}
        actions={<UserMenu />}
      />

      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {navItems.map(({ path, icon: Icon, label, description }) => (
            <div 
              key={path}
              onClick={() => navigate(path)}
              className="bg-crimson-darker p-6 rounded-lg cursor-pointer hover:bg-crimson-dark transition-colors"
            >
              <Icon className="w-12 h-12 mb-4 text-crimson" />
              <h2 className="text-xl font-bold text-crimson-light mb-4">{label}</h2>
              <p className="text-crimson">{description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};