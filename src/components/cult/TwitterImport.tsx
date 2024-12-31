import React, { useState } from 'react';
import { Twitter, Loader } from 'lucide-react';
import { TwitterProfile } from '../../types/cult';
import { importFromTwitter } from '../../services/twitterService';
import { TwitterAuthButton } from './TwitterAuthButton';
import { Input } from '../ui/Input';

interface TwitterImportProps {
  cultType: CultType;
  onImport: (profile: TwitterProfile) => void;
}

export const TwitterImport = ({ cultType, onImport }: TwitterImportProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [twitterHandle, setTwitterHandle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImport = async () => {
    if (!twitterHandle) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const profile = await importFromTwitter(twitterHandle.replace('@', ''));
      onImport(profile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import profile');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <TwitterAuthButton
        onSuccess={() => setIsAuthenticated(true)}
        onError={(error) => setError(error.message)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <Input
          label="Twitter Handle"
          value={twitterHandle}
          onChange={(e) => setTwitterHandle(e.target.value)}
          placeholder="@username"
          className="flex-1"
        />
        <button
          onClick={handleImport}
          disabled={loading || !twitterHandle}
          className="mt-8 bg-crimson px-6 rounded-lg hover:bg-crimson-light transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            <Twitter className="w-5 h-5" />
          )}
          Import
        </button>
      </div>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
};