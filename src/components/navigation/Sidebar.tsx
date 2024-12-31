import React from 'react';
import { NavLink } from 'react-router-dom';
import { Star, Bookmark, Settings } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

const shortcuts = [
  { icon: Star, label: 'Favorites', path: '/favorites' },
  { icon: Bookmark, label: 'Saved', path: '/saved' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export const Sidebar = ({ isOpen }: SidebarProps) => {
  return (
    <aside
      className={`w-64 bg-crimson-darker border-r border-crimson transition-all ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <div className="p-4">
        <h2 className="text-sm font-semibold text-crimson-light mb-4">Quick Access</h2>
        <nav>
          <ul className="space-y-2">
            {shortcuts.map(({ icon: Icon, label, path }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-crimson text-white'
                        : 'text-crimson-light hover:bg-crimson-darker'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};