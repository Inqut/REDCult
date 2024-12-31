import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Settings } from 'lucide-react';
import { useAuthStore } from '../../services/auth/authStore';

export const UserMenu = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { loading, signOut } = useAuthStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 hover:text-crimson-light transition-colors"
        disabled={loading}
      >
        <User className="w-5 h-5" />
        <span>Profile</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-crimson-darker border border-crimson rounded-lg shadow-lg py-1">
          <button
            onClick={() => {
              setIsOpen(false);
              navigate('/profile/settings');
            }}
            className="flex items-center space-x-2 w-full px-4 py-2 text-left hover:bg-crimson-dark transition-colors"
            disabled={loading}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
          <button
            onClick={handleSignOut}
            disabled={loading}
            className="flex items-center space-x-2 w-full px-4 py-2 text-left hover:bg-crimson-dark transition-colors disabled:opacity-50"
          >
            <LogOut className="w-4 h-4" />
            <span>{loading ? 'Signing out...' : 'Sign Out'}</span>
          </button>
        </div>
      )}
    </div>
  );
};