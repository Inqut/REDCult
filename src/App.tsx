import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { NavigationGuard } from './components/navigation/NavigationGuard';
import { InitiationGate } from './components/InitiationGate';
import { Sanctum } from './components/Sanctum';
import { CultCreationContainer } from './components/cult/CultCreationContainer';
import { AuthContainer } from './components/auth/AuthContainer';
import { AuthCallback } from './components/auth/AuthCallback';
import { ProfileSettings } from './components/profile/ProfileSettings';
import { MyCultsPage } from './components/cult/MyCultsPage';
import { CultDashboard } from './components/cult/CultDashboard';
import { ExplorePage } from './components/explore/ExplorePage';
import { LandingPage } from './components/LandingPage';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { ChatInterface } from './components/chat/ChatInterface';
import { useAuth } from './hooks/useAuth';

export default function App() {
  const { user, loading, error } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-crimson-darkest flex items-center justify-center">
        <div className="text-center text-crimson-light">
          <p className="text-xl mb-4">Failed to initialize app</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <NavigationGuard>
        <div className="min-h-screen bg-black">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={user ? <Navigate to="/sanctum" replace /> : <LandingPage />} />
            <Route path="/auth" element={<AuthContainer />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/explore" element={<ExplorePage />} />

            {/* Protected routes */}
            <Route path="/sanctum" element={<Sanctum />} />
            <Route path="/cultcreation" element={<CultCreationContainer />} />
            <Route path="/profile/settings" element={<ProfileSettings />} />
            <Route path="/cults" element={<MyCultsPage />} />
            <Route path="/cults/:cultId" element={<CultDashboard />} />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Global chat interface */}
          {user && <ChatInterface />}
        </div>
      </NavigationGuard>
    </BrowserRouter>
  );
};