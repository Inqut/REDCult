import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useMyCults } from '../../hooks/useMyCults';
import { LoadingScreen } from '../ui/LoadingScreen';
import { PageHeader } from '../navigation/PageHeader';
import { CultList } from './lists/CultList';
import { EmptyCultState } from './states/EmptyCultState';

export const MyCultsPage = () => {
  const navigate = useNavigate();
  const { cults, loading, error } = useMyCults();

  if (loading) return <LoadingScreen />;

  if (error) {
    return (
      <div className="min-h-screen bg-crimson-darkest flex items-center justify-center">
        <div className="text-center text-crimson-light">
          <p className="text-xl mb-4">Failed to load cults</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const foundedCults = cults.filter(cult => cult.isOwner);
  const joinedCults = cults.filter(cult => !cult.isOwner);

  return (
    <div className="min-h-screen bg-crimson-darkest">
      <PageHeader 
        title="My Cults"
        actions={
          <button
            onClick={() => navigate('/cultcreation')}
            className="bg-crimson text-white px-4 py-2 rounded-lg hover:bg-crimson-light transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create New Cult
          </button>
        }
      />

      <div className="container mx-auto px-4 py-8">
        {/* Founded Cults */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-crimson-light mb-4">
            Founded Cults
          </h2>
          {foundedCults.length > 0 ? (
            <CultList cults={foundedCults} />
          ) : (
            <EmptyCultState
              message="You haven't founded any cults yet"
              actionText="Create your first cult"
              onAction={() => navigate('/cultcreation')}
            />
          )}
        </section>

        {/* Joined Cults */}
        <section>
          <h2 className="text-xl font-semibold text-crimson-light mb-4">
            Joined Cults
          </h2>
          {joinedCults.length > 0 ? (
            <CultList cults={joinedCults} />
          ) : (
            <EmptyCultState
              message="You haven't joined any cults yet"
              actionText="Explore cults to join"
              onAction={() => navigate('/explore')}
            />
          )}
        </section>
      </div>
    </div>
  );
};