import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { useExplore } from '../../hooks/useExplore';
import { LoadingScreen } from '../ui/LoadingScreen';
import { CultList } from '../cult/lists/CultList';
import { PageHeader } from '../navigation/PageHeader';
import type { CultType } from '../../types/cult';

export const ExplorePage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [type, setType] = useState<CultType | 'all'>('all');
  const { cults, loading, error } = useExplore();

  const filteredCults = cults.filter(cult => {
    const matchesSearch = cult.name.toLowerCase().includes(search.toLowerCase()) ||
                         cult.bio.toLowerCase().includes(search.toLowerCase());
    const matchesType = type === 'all' || cult.type === type;
    return matchesSearch && matchesType;
  });

  if (loading) return <LoadingScreen />;

  if (error) {
    return (
      <div className="min-h-screen bg-crimson-darkest flex items-center justify-center">
        <div className="text-center text-crimson-light">
          <p className="text-xl mb-4">Failed to load cults</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={() => navigate('/sanctum')}
            className="mt-4 text-crimson hover:text-crimson-light transition-colors"
          >
            Return to Sanctum
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-crimson-darkest">
      <PageHeader 
        title="Explore Cults"
        actions={
          <button
            onClick={() => navigate('/cultcreation')}
            className="bg-crimson text-white px-4 py-2 rounded-lg hover:bg-crimson-light transition-colors"
          >
            Create Cult
          </button>
        }
      />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="flex-1 relative">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search cults..."
              className="w-full bg-crimson-darker border-2 border-crimson p-3 pl-10 rounded-lg focus:outline-none focus:border-crimson-light text-crimson-light placeholder-crimson-dark"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-crimson-dark" />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-crimson-light" />
            <select
              value={type}
              onChange={(e) => setType(e.target.value as CultType | 'all')}
              className="bg-crimson-darker border-2 border-crimson p-3 rounded-lg focus:outline-none focus:border-crimson-light text-crimson-light"
            >
              <option value="all">All Types</option>
              <option value="agent">AI Agents</option>
              <option value="developer">Developers</option>
            </select>
          </div>
        </div>

        {filteredCults.length > 0 ? (
          <CultList cults={filteredCults} />
        ) : (
          <div className="text-center py-12">
            <p className="text-crimson-light text-lg">No cults found matching your criteria</p>
            <button
              onClick={() => {
                setSearch('');
                setType('all');
              }}
              className="mt-4 text-crimson hover:text-crimson-light transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};