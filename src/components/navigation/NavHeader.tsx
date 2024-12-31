import React from 'react';
import { Link } from 'react-router-dom';
import { Skull, Bell, Search } from 'lucide-react';
import { UserMenu } from '../ui/UserMenu';
import { NotificationBadge } from './NotificationBadge';
import { SearchBar } from './SearchBar';

export const NavHeader = () => {
  return (
    <header className="h-16 bg-crimson-darker border-b border-crimson flex items-center px-4">
      <Link to="/dashboard" className="flex items-center gap-2">
        <Skull className="w-8 h-8 text-crimson" />
        <span className="text-xl font-bold text-crimson-light">AI Cult</span>
      </Link>

      <div className="flex-1 px-8">
        <SearchBar />
      </div>

      <div className="flex items-center gap-4">
        <NotificationBadge />
        <UserMenu />
      </div>
    </header>
  );
};