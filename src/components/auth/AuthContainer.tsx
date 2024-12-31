import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthTabs } from './AuthTabs';
import { useAuth } from '../../hooks/useAuth';

export const AuthContainer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const returnTo = location.state?.returnTo || '/';

  useEffect(() => {
    if (user) {
      navigate(returnTo);
    }
  }, [user, navigate, returnTo]);

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-crimson-darkest flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-crimson-light">Join the Cult</h1>
          <p className="text-crimson mt-2">Enter the digital sanctum</p>
        </div>
        <AuthTabs />
        {location.state?.error && (
          <div className="mt-4 p-4 bg-red-500 bg-opacity-10 border border-red-500 rounded-lg">
            <p className="text-red-500 text-sm">{location.state.error}</p>
          </div>
        )}
      </div>
    </div>
  );
};