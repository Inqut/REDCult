import React from 'react';
import { Menu, X } from 'lucide-react';
import { NavHeader } from './NavHeader';
import { Sidebar } from './Sidebar';

interface MobileNavProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const MobileNav = ({ isOpen, onToggle }: MobileNavProps) => {
  return (
    <>
      <div className="flex items-center h-16 bg-crimson-darker border-b border-crimson px-4">
        <button
          onClick={onToggle}
          className="p-2 text-crimson-light hover:text-crimson transition-colors"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <NavHeader />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onToggle} />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-16 left-0 bottom-0 w-64 bg-crimson-darker transform transition-transform z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar isOpen={isOpen} />
      </div>
    </>
  );
};