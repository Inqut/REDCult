import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Twitter } from 'lucide-react';
import { CultCreationForm } from './forms/CultCreationForm';
import { TwitterImport } from './TwitterImport';
import { TwitterProfile } from '../../types/cult';
import { useAuth } from '../../hooks/useAuth';
import { profileExists } from '../../services/auth/profileService';
import { LoadingScreen } from '../ui/LoadingScreen';

export const CultCreationContainer = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [creationType, setCreationType] = useState<'manual' | 'twitter'>('manual');

  useEffect(() => {
    const checkProfile = async () => {
      if (!user) return;
      
      try {
        const exists = await profileExists(user.id);
        setHasProfile(exists);
        if (!exists) {
          navigate('/profile/settings', { 
            state: { 
              message: 'Please complete your profile before creating a cult',
              returnTo: '/cultcreation'
            }
          });
        }
      } catch (error) {
        console.error('Error checking profile:', error);
      } finally {
        setLoading(false);
      }
    };

    checkProfile();
  }, [user, navigate]);

  if (loading) return <LoadingScreen />;
  if (!hasProfile) return null;

  const handleTwitterImport = (profile: TwitterProfile) => {
    // Handle the imported Twitter profile
    console.log('Imported Twitter profile:', profile);
  };

  return (
    <div className="min-h-screen bg-crimson-darkest text-crimson-light">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setCreationType('manual')}
              className={`px-6 py-3 rounded-lg border-2 transition-colors ${
                creationType === 'manual'
                  ? 'border-crimson bg-crimson-darker'
                  : 'border-crimson-dark hover:border-crimson'
              }`}
            >
              Manual Creation
            </button>
            <button
              onClick={() => setCreationType('twitter')}
              className={`px-6 py-3 rounded-lg border-2 transition-colors flex items-center gap-2 ${
                creationType === 'twitter'
                  ? 'border-crimson bg-crimson-darker'
                  : 'border-crimson-dark hover:border-crimson'
              }`}
            >
              <Twitter className="w-5 h-5" />
              Import from Twitter
            </button>
          </div>
        </div>

        {creationType === 'twitter' ? (
          <TwitterImport cultType="agent" onImport={handleTwitterImport} />
        ) : (
          <CultCreationForm />
        )}
      </div>
    </div>
  );
};