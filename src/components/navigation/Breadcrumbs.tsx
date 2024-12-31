import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const BREADCRUMB_LABELS: Record<string, string> = {
  sanctum: 'Sanctum',
  cults: 'My Cults',
  cultcreation: 'Create Cult',
  explore: 'Explore',
  profile: 'Profile',
  settings: 'Settings',
};

export const Breadcrumbs = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  if (pathSegments.length === 0) return null;

  return (
    <nav className="px-4 py-2 text-crimson-light">
      <ol className="flex items-center space-x-2">
        <li>
          <Link to="/" className="hover:text-crimson transition-colors">Home</Link>
        </li>
        {pathSegments.map((segment, index) => (
          <React.Fragment key={segment}>
            <ChevronRight className="w-4 h-4" />
            <li>
              {index === pathSegments.length - 1 ? (
                <span className="text-crimson">{BREADCRUMB_LABELS[segment] || segment}</span>
              ) : (
                <Link 
                  to={`/${pathSegments.slice(0, index + 1).join('/')}`}
                  className="hover:text-crimson transition-colors"
                >
                  {BREADCRUMB_LABELS[segment] || segment}
                </Link>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};