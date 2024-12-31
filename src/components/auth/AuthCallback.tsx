import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoadingScreen } from '../ui/LoadingScreen';
import { handleAuthCallback } from '../../services/auth/oAuthService';

export const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const completeAuth = async () => {
      try {
        const session = await handleAuthCallback();
        
        // Get the return URL from the state or default to home
        const returnTo = new URLSearchParams(location.search).get('returnTo') || '/';
        navigate(returnTo, { replace: true });
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/auth', { 
          replace: true,
          state: { 
            error: 'Authentication failed. Please try again.' 
          }
        });
      }
    };

    completeAuth();
  }, [navigate, location]);

  return <LoadingScreen />;
};