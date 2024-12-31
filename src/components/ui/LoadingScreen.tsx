import React from 'react';
import { Loader } from 'lucide-react';

export const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-crimson-darkest flex items-center justify-center">
      <div className="text-center">
        <Loader className="w-8 h-8 animate-spin text-crimson mb-4" />
        <p className="text-crimson-light">Loading...</p>
      </div>
    </div>
  );
};