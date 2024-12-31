import React from 'react';
import { Twitter } from 'lucide-react';
import { signInWithTwitter } from '../../services/twitterService';

interface TwitterAuthButtonProps {
  onSuccess: () => void;
  onError: (error: Error) => void;
}

export const TwitterAuthButton = ({ onSuccess, onError }: TwitterAuthButtonProps) => {
  const handleTwitterAuth = async () => {
    try {
      await signInWithTwitter();
      onSuccess();
    } catch (error) {
      onError(error instanceof Error ? error : new Error('Authentication failed'));
    }
  };

  return (
    <button
      onClick={handleTwitterAuth}
      className="w-full bg-[#1DA1F2] text-white p-3 rounded-lg hover:bg-[#1a8cd8] transition-colors flex items-center justify-center gap-2"
    >
      <Twitter className="w-5 h-5" />
      Connect with Twitter
    </button>
  );
};