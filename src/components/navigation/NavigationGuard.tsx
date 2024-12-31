import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNavigationState } from '../../hooks/useNavigationState';

const PUBLIC_PATHS = ['/', '/auth', '/auth/callback'];

export const NavigationGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { setPaths } = useNavigationState();

  useEffect(() => {
    if (loading) return;

    const isPublicPath = PUBLIC_PATHS.includes(location.pathname);
    
    if (!user && !isPublicPath) {
      navigate('/auth', { 
        state: { returnTo: location.pathname },
        replace: true 
      });
      return;
    }

    setPaths(location.pathname, location.state?.returnTo || null);
  }, [location.pathname, user, loading]);

  if (loading) return null;

  return <>{children}</>;
};