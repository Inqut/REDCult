import React from 'react';
import { Twitter } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const SocialAuth = () => {
  const { signInWithGoogle, signInWithTwitter } = useAuth();

  return (
    <div className="space-y-3">
      <button
        onClick={signInWithGoogle}
        className="w-full bg-white text-gray-800 p-3 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
      >
        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
        Continue with Google
      </button>

      <button
        onClick={signInWithTwitter}
        className="w-full bg-[#1DA1F2] text-white p-3 rounded-lg hover:bg-[#1a8cd8] transition-colors flex items-center justify-center gap-2"
      >
        <Twitter className="w-5 h-5" />
        Continue with Twitter
      </button>
    </div>
  );
};